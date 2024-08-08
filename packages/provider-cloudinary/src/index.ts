import crypto from "crypto"
import { type Provider } from "@filenest/core"

import {
    DeleteAssetInput,
    GetUploadUrlInput,
    RenameAssetInput,
    type AssetType,
    type CreateFolderInput,
    type DeleteFolderInput,
    type GetResourcesInput,
    type RenameFolderInput,
} from "@filenest/core"
import slugify from "slugify"

type CloudinaryConfig = {
    API_KEY: string
    API_SECRET: string
    CLOUD_NAME: string
}

export class Cloudinary implements Provider {
    private _URL: string
    private _MAX_RESULTS = 50
    private _API_SECRET: string
    private _API_KEY: string
    private _HEADERS: Headers

    private async _doFetch(url: string | URL, init?: RequestInit) {
        return fetch(url, { headers: this._HEADERS, ...init }).then((res) => res.json())
    }

    constructor(config: CloudinaryConfig) {
        const { API_KEY, API_SECRET, CLOUD_NAME } = config
        this._API_SECRET = API_SECRET
        this._API_KEY = API_KEY
        this._URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`
        this._HEADERS = new Headers({
            Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
        })
    }

    // Stolen from https://github.com/cloudinary/cloudinary_npm/blob/master/lib/utils/index.js
    private async _makeSignature(params: Record<string, any>) {
        const { _API_SECRET: API_SECRET } = this

        function toArray(arg: any) {
            switch (true) {
                case arg == null:
                    return []
                case Array.isArray(arg):
                    return arg
                default:
                    return [arg]
            }
        }

        function present(value: any) {
            return value != null && ("" + value).length > 0
        }

        const to_sign = Object.entries(params)
            .filter(([_, v]) => present(v))
            .map(([k, v]) => `${k}=${toArray(v).join(",")}`)
            .sort()
            .join("&")

        const hash = crypto
            .createHash("sha1")
            .update(to_sign + API_SECRET)
            .digest()

        return Buffer.from(hash).toString("hex")
    }

    private async _getConfig() {
        const url = new URL(this._URL.toString() + "/config")
        url.searchParams.append("settings", "true")
        return (await this._doFetch(url)) as CloudinaryEnvironment
    }

    private _mapResourceType(type: string, format: string) {
        switch (type) {
            case "image":
                if (format == "pdf") return "document"
                return "image"
            case "video":
                return "video"
            case "raw":
                return "document"
            default:
                return "other"
        }
    }

    private _mapResourceToSchema(resource: CloudinaryResource) {
        return {
            assetId: resource.asset_id,
            publicId: resource.public_id,
            type: this._mapResourceType(resource.resource_type, resource.format) as AssetType,
            format: resource.format,
            url: resource.url,
            folder: resource.folder,
            name: resource.display_name || resource.filename,
            bytes: resource.bytes,
            width: resource.width,
            height: resource.height,
            tags: resource.tags,
            modifiedAt: resource.version,
        }
    }

    private _mapResourcesToSchema(resource: CloudinaryResource[]) {
        return resource.map((asset) => this._mapResourceToSchema(asset))
    }

    private _mapFolderToSchema(folder: CloudinaryFolder) {
        return {
            id: folder.path,
            name: folder.name,
            path: folder.path,
        }
    }

    private _mapFoldersToSchema(data: CloudinaryFolder[]) {
        return data.map((folder) => this._mapFolderToSchema(folder))
    }

    private async _getRawAssetByAssetId(id: string) {
        const url = new URL(this._URL.toString() + "/resources/" + id)
        const asset: CloudinaryResource = await this._doFetch(url)
        return asset
    }

    public getResources = async (input?: GetResourcesInput) => {
        let url = new URL(this._URL.toString() + "/resources/search")

        const folder = () => {
            if (input?.global) return
            return input?.folder ? "folder:" + input.folder : 'folder=""'
        }

        const searchQuery = input?.searchQuery
            ? `(public_id:${input.searchQuery}* OR display_name:${input.searchQuery}* OR filename:${input.searchQuery}*)`
            : undefined

        const expression = [folder(), searchQuery].filter(i => !!i).join(" AND ")

        url.searchParams.append("expression", expression)
        url.searchParams.append("with_field", "tags")
        url.searchParams.append("max_results", this._MAX_RESULTS.toString())

        if (input?.nextCursor) {
            url.searchParams.append("next_cursor", input.nextCursor)
        }

        const assets: CloudinarySearchResponse = await this._doFetch(url)

        url = new URL([this._URL.toString(), "/folders/", input?.folder].join(""))

        const folders: CloudinaryFolderResponse = await this._doFetch(url)

        return {
            folder: assets.resources[0]?.folder || input?.folder || "",
            resources: {
                folders: {
                    data: this._mapFoldersToSchema(folders.folders),
                    count: folders.total_count,
                },
                assets: {
                    data: this._mapResourcesToSchema(assets.resources),
                    count: assets.total_count,
                    nextCursor: assets.next_cursor,
                },
            },
        }
    }

    public createFolder = async (input: CreateFolderInput) => {
        const url = new URL(this._URL.toString() + "/folders/" + input.path)
        const folder: CloudinaryFolder = await this._doFetch(url, { method: "POST" })
        return this._mapFolderToSchema(folder)
    }

    public renameFolder = async (input: RenameFolderInput) => {
        // We need to check if environment uses fixed or dynamic folder mode.
        // Only dynamic folder mode supports renaming folders.
        const config = await this._getConfig()

        if (config.settings.folder_mode === "fixed") {
            throw new Error("Renaming folders is not supported in fixed folder mode.")
        }

        const url = new URL(this._URL.toString() + "/folders/" + input.path)
        url.searchParams.append("to_folder", input.newPath)

        const folder: { from: CloudinaryFolder; to: CloudinaryFolder } = await this._doFetch(url, { method: "PUT" })

        return this._mapFolderToSchema(folder.to)
    }

    public deleteFolder = async (input: DeleteFolderInput) => {
        const { resources } = await this.getResources({ folder: input.path })
        const config = await this._getConfig()

        if (resources.assets.count > 0 && !input.force) {
            return {
                success: false,
                message: "ERR_FOLDER_NOT_EMPTY",
            }
        }

        const resource_types = ["image", "raw", "video"]

        // Delete all assets in the folder when force deleting
        if (resources.assets.count > 0) {
            if (config.settings.folder_mode === "fixed") {
                await Promise.all(
                    resource_types.map(async (type) => {
                        const url = new URL(this._URL.toString() + `/resources/${type}/upload`)
                        url.searchParams.set("prefix", input.path + "/")
                        return this._doFetch(url, { method: "DELETE" })
                    })
                )
            }

            if (config.settings.folder_mode === "dynamic") {
                let url = new URL(this._URL.toString() + "/resources/by_asset_folder")
                url.searchParams.set("asset_folder", input.path)
                const assets: CloudinarySearchResponse = await this._doFetch(url)
                const public_ids = assets.resources.map((asset) => asset.public_id)
                await Promise.all(
                    resource_types.map(async (type) => {
                        const url = new URL(this._URL.toString() + `/resources/${type}/upload`)
                        url.searchParams.set("public_ids", public_ids.join(","))
                        return this._doFetch(url, { method: "DELETE" })
                    })
                )
            }
        }

        // ...Finally delete folder
        const url = new URL(this._URL.toString() + "/folders/" + input.path)
        await this._doFetch(url, { method: "DELETE" })

        return {
            success: true,
        }
    }

    public getUploadUrl = async (input: GetUploadUrlInput) => {
        const { params } = input
        
        const { settings } = await this._getConfig()

        if (settings.folder_mode === "dynamic") {
            params.asset_folder = params.folder || params.asset_folder || ""
            delete params.folder
        }

        const timestamp = Math.floor(Date.now() / 1000).toString()
        params.timestamp = timestamp

        const signature = await this._makeSignature(params)

        const url = new URL(this._URL.toString() + "/auto/upload")
        url.searchParams.append("api_key", this._API_KEY)
        url.searchParams.append("signature", signature)
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value)
        })
        url.searchParams.sort()

        return url.toString()
    }

    public renameAsset = async (input: RenameAssetInput) => {
        const { id, name, updateDeliveryUrl } = input

        const { settings } = await this._getConfig()

        if (settings.folder_mode === "fixed" && !updateDeliveryUrl) {
            return {
                success: false,
                message: "ERR_DELIVERY_URL_WILL_CHANGE",
            }
        }

        if (settings.folder_mode === "dynamic" && updateDeliveryUrl === undefined) {
            return {
                success: false,
                message: "ERR_UPDATE_DELIVERY_URL_REQUIRED",
            }
        }

        const { resource_type, type, public_id } = await this._getRawAssetByAssetId(id)

        if (settings.folder_mode === "dynamic") {
            const url = new URL(this._URL.toString() + `/resources/${resource_type}/${type}/` + public_id)
            url.searchParams.append("display_name", name.replace("/", "-"))
            await this._doFetch(url, { method: "POST" })
        }

        if (
            (settings.folder_mode === "fixed" && updateDeliveryUrl) ||
            (settings.folder_mode === "dynamic" && updateDeliveryUrl === true)
        ) {
            const timestamp = Math.floor(Date.now() / 1000).toString()

            const url = new URL(this._URL.toString() + `/${resource_type}/rename`)
            url.searchParams.append("from_public_id", public_id)
            url.searchParams.append("to_public_id", slugify(name))
            url.searchParams.append("api_key", this._API_KEY)
            url.searchParams.append("timestamp", timestamp)

            const signature = await this._makeSignature({
                timestamp,
                from_public_id: public_id,
                to_public_id: slugify(name),
            })

            url.searchParams.append("signature", signature)
            url.searchParams.sort()

            await this._doFetch(url, { method: "POST" })
        }

        return {
            success: true,
        }
    }

    public deleteAsset = async (input: DeleteAssetInput) => {
        const { resource_type, type, public_id } = await this._getRawAssetByAssetId(input.id)

        const url = new URL(this._URL.toString() + `/resources/${resource_type}/${type}`)
        url.searchParams.append("public_ids", [public_id].toString())

        await this._doFetch(url, { method: "DELETE" })

        return {
            success: true,
        }
    }
}

type CloudinaryEnvironment = {
    cloud_name: string
    created_at: string
    settings: {
        folder_mode: "fixed" | "dynamic"
    }
}

type CloudinaryResource = {
    asset_id: string
    public_id: string
    folder: string
    filename: string
    display_name?: string
    format: string
    version: number
    resource_type: "image" | "raw" | "video"
    type: string
    created_at: string
    uploaded_at: string
    bytes: number
    backup_bytes: number
    width: number
    height: number
    aspect_ratio: number
    pixels: number
    pages: number
    url: string
    secure_url: string
    status: string
    access_mode: string
    access_control: any
    etag: string
    created_by: Record<string, unknown>
    uploaded_by: Record<string, unknown>
    last_updated: Record<string, unknown>
    tags: string[]
}

type CloudinarySearchResponse = {
    resources: CloudinaryResource[]
    total_count: number
    next_cursor: string
}

type CloudinaryFolder = {
    name: string
    path: string
}

type CloudinaryFolderResponse = {
    total_count: number
    folders: CloudinaryFolder[]
}
