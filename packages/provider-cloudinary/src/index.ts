import crypto from "crypto"
import { type Provider } from "@filenest/core"

import {
    DeleteAssetInput,
    GetUploadUrlInput,
    RenameAssetInput,
    type Asset,
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
    private URL: string
    private MAX_RESULTS = 50
    private API_SECRET: string
    private API_KEY: string
    private HEADERS: Headers
    private async doFetch(url: string | URL, init?: RequestInit) {
        return fetch(url, { headers: this.HEADERS, ...init }).then((res) => res.json())
    }

    constructor(config: CloudinaryConfig) {
        const { API_KEY, API_SECRET, CLOUD_NAME } = config
        this.API_SECRET = API_SECRET
        this.API_KEY = API_KEY
        this.URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`
        this.HEADERS = new Headers({
            Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
        })
    }

    // Stolen from https://github.com/cloudinary/cloudinary_npm/blob/master/lib/utils/index.js
    private async makeSignature(params: Record<string, any>) {
        const { API_SECRET } = this

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

    private async getConfig() {
        const url = new URL(this.URL.toString() + "/config")
        url.searchParams.append("settings", "true")
        return (await this.doFetch(url)) as CloudinaryEnvironment
    }

    private mapResourceType(type: string, format: string) {
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

    private mapResourceToSchema(resource: CloudinaryResource) {
        return {
            assetId: resource.asset_id,
            publicId: resource.public_id,
            type: this.mapResourceType(resource.resource_type, resource.format) as AssetType,
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

    private mapResourcesToSchema(resource: CloudinaryResource[]) {
        return resource.map((asset) => this.mapResourceToSchema(asset))
    }

    private mapFolderToSchema(folder: CloudinaryFolder) {
        return {
            id: folder.path,
            name: folder.name,
            path: folder.path,
        }
    }

    private mapFoldersToSchema(data: CloudinaryFolder[]) {
        return data.map((folder) => this.mapFolderToSchema(folder))
    }

    public async getRawAssetByAssetId(id: string) {
        const url = new URL(this.URL.toString() + "/resources/" + id)
        const asset: CloudinaryResource = await this.doFetch(url)
        return asset
    }

    public async getResources(input?: GetResourcesInput) {
        let url = new URL(this.URL.toString() + "/resources/search")

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
        url.searchParams.append("max_results", this.MAX_RESULTS.toString())

        if (input?.nextCursor) {
            url.searchParams.append("next_cursor", input.nextCursor)
        }

        const assets: CloudinarySearchResponse = await this.doFetch(url)

        url = new URL([this.URL.toString(), "/folders/", input?.folder].join(""))

        const folders: CloudinaryFolderResponse = await this.doFetch(url)

        return {
            folder: assets.resources[0]?.folder || input?.folder || "",
            resources: {
                folders: {
                    data: this.mapFoldersToSchema(folders.folders),
                    count: folders.total_count,
                },
                assets: {
                    data: this.mapResourcesToSchema(assets.resources),
                    count: assets.total_count,
                    nextCursor: assets.next_cursor,
                },
            },
        }
    }

    public async createFolder(input: CreateFolderInput) {
        const url = new URL(this.URL.toString() + "/folders/" + input.path)
        const folder: CloudinaryFolder = await this.doFetch(url, { method: "POST" })
        return this.mapFolderToSchema(folder)
    }

    public async renameFolder(input: RenameFolderInput) {
        // We need to check if environment uses fixed or dynamic folder mode.
        // Only dynamic folder mode supports renaming folders.
        const config = await this.getConfig()

        if (config.settings.folder_mode === "fixed") {
            throw new Error("Renaming folders is not supported in fixed folder mode.")
        }

        const url = new URL(this.URL.toString() + "/folders/" + input.path)
        url.searchParams.append("to_folder", input.newPath)

        const folder: { from: CloudinaryFolder; to: CloudinaryFolder } = await this.doFetch(url, { method: "PUT" })

        return this.mapFolderToSchema(folder.to)
    }

    public async deleteFolder(input: DeleteFolderInput) {
        const { resources } = await this.getResources({ folder: input.path })
        const config = await this.getConfig()

        if (resources.assets.count > 0 && !input.force) {
            throw new Error("ERR_FOLDER_NOT_EMPTY")
        }

        const resource_types = ["image", "raw", "video"]

        // Delete all assets in the folder when force deleting
        if (resources.assets.count > 0) {
            if (config.settings.folder_mode === "fixed") {
                await Promise.all(
                    resource_types.map(async (type) => {
                        const url = new URL(this.URL.toString() + `/resources/${type}/upload`)
                        url.searchParams.set("prefix", input.path + "/")
                        return this.doFetch(url, { method: "DELETE" })
                    })
                )
            }

            if (config.settings.folder_mode === "dynamic") {
                let url = new URL(this.URL.toString() + "/resources/by_asset_folder")
                url.searchParams.set("asset_folder", input.path)
                const assets: CloudinarySearchResponse = await this.doFetch(url)
                const public_ids = assets.resources.map((asset) => asset.public_id)
                await Promise.all(
                    resource_types.map(async (type) => {
                        const url = new URL(this.URL.toString() + `/resources/${type}/upload`)
                        url.searchParams.set("public_ids", public_ids.join(","))
                        return this.doFetch(url, { method: "DELETE" })
                    })
                )
            }
        }

        // ...Finally delete folder
        const url = new URL(this.URL.toString() + "/folders/" + input.path)
        await this.doFetch(url, { method: "DELETE" })

        return {
            success: true,
        }
    }

    public async getUploadUrl(input: GetUploadUrlInput) {
        const { params } = input
        
        const { settings } = await this.getConfig()

        if (settings.folder_mode === "dynamic") {
            params.asset_folder = params.folder || params.asset_folder || ""
            delete params.folder
        }

        const timestamp = Math.floor(Date.now() / 1000).toString()
        params.timestamp = timestamp

        const signature = await this.makeSignature(params)

        const url = new URL(this.URL.toString() + "/auto/upload")
        url.searchParams.append("api_key", this.API_KEY)
        url.searchParams.append("signature", signature)
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.append(key, value)
        })
        url.searchParams.sort()

        return url.toString()
    }

    public async renameAsset(input: RenameAssetInput) {
        const { id, name, updateDeliveryUrl } = input

        const { settings } = await this.getConfig()

        if (settings.folder_mode === "fixed" && !updateDeliveryUrl) {
            throw new Error("ERR_DELIVERY_URL_WILL_CHANGE")
        }

        if (settings.folder_mode === "dynamic" && updateDeliveryUrl === undefined) {
            throw new Error("ERR_UPDATE_DELIVERY_URL_REQUIRED")
        }

        const { resource_type, type, public_id } = await this.getRawAssetByAssetId(id)

        if (settings.folder_mode === "dynamic") {
            const url = new URL(this.URL.toString() + `/resources/${resource_type}/${type}/` + public_id)
            url.searchParams.append("display_name", name.replace("/", "-"))
            await this.doFetch(url, { method: "POST" })
        }

        if (
            (settings.folder_mode === "fixed" && updateDeliveryUrl) ||
            (settings.folder_mode === "dynamic" && updateDeliveryUrl === true)
        ) {
            const timestamp = Math.floor(Date.now() / 1000).toString()

            const url = new URL(this.URL.toString() + `/${resource_type}/rename`)
            url.searchParams.append("from_public_id", public_id)
            url.searchParams.append("to_public_id", slugify(name))
            url.searchParams.append("api_key", this.API_KEY)
            url.searchParams.append("timestamp", timestamp)

            const signature = await this.makeSignature({
                timestamp,
                from_public_id: public_id,
                to_public_id: slugify(name),
            })

            url.searchParams.append("signature", signature)
            url.searchParams.sort()

            await this.doFetch(url, { method: "POST" })
        }

        return {
            success: true,
        }
    }

    public async deleteAsset(input: DeleteAssetInput) {
        const { resource_type, type, public_id } = await this.getRawAssetByAssetId(input.id)

        const url = new URL(this.URL.toString() + `/resources/${resource_type}/${type}`)
        url.searchParams.append("public_ids", [public_id].toString())

        await this.doFetch(url, { method: "DELETE" })

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
