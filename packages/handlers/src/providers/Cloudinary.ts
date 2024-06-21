import crypto from "crypto"
import { type Provider } from ".."

import {
    type Asset,
    type AssetType,
    type CreateFolderInput,
    type DeleteFolderInput,
    type GetAssetInput,
    type GetAssetsInput,
    type GetResourcesByFolderInput,
    type RenameFolderInput,
    type UploadInput,
} from "../types"

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

    private makeSignature(params: Record<string, any>) {
        const { API_SECRET } = this
        const q = Object.keys(params)
            .sort()
            .map((key) => `${key}=${params[key]}`)
            .join("&")
        const hash = crypto.createHash("sha1")
        hash.update(q + API_SECRET)
        return hash.digest("hex")
    }

    private async getConfig() {
        const url = new URL(this.URL.toString() + "/config")
        url.searchParams.append("settings", "true")
        return (await this.doFetch(url)) as CloudinaryEnvironment
    }

    private mapResourceType(type: string) {
        switch (type) {
            case "image":
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
            type: this.mapResourceType(resource.resource_type) as AssetType,
            format: resource.format,
            url: resource.url,
            folder: resource.folder,
            name: resource.filename,
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

    public async getAsset(input: GetAssetInput) {
        const url = new URL(this.URL.toString() + "/resources/" + input.id)
        const asset: CloudinaryResource = await this.doFetch(url)
        return this.mapResourceToSchema(asset)
    }

    public async getAssets(input?: GetAssetsInput) {
        const url = new URL(this.URL.toString() + "/resources/search")
        url.searchParams.append("expression", input?.searchQuery ?? "")
        url.searchParams.append("with_field", "tags")
        url.searchParams.append("max_results", this.MAX_RESULTS.toString())

        const assets: CloudinarySearchResponse = await this.doFetch(url)

        return {
            data: this.mapResourcesToSchema(assets.resources),
            count: assets.total_count,
        }
    }

    public async getResourcesByFolder(input?: GetResourcesByFolderInput) {
        let url = new URL(this.URL.toString() + "/resources/search")

        const folder = input?.folder ? "folder:" + input.folder : 'folder=""'
        const searchQuery = input?.searchQuery ? `AND ${input.searchQuery}` : null
        const expression = [folder, searchQuery].join(" ")

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
        const { resources } = await this.getResourcesByFolder({ folder: input.path })
        const config = await this.getConfig()

        if (resources.assets.count > 0 && !input.force) {
            throw new Error("ERR_FOLDER_NOT_EMPTY")
        }

        const resource_types = ["image", "raw", "video"]

        // Delete all assets in the folder when force deleting
        if (resources.assets.count > 0) {
            if (config.settings.folder_mode === "fixed") {
                await Promise.all(resource_types.map(async type => {
                    const url = new URL(this.URL.toString() + `/resources/${type}/upload`)
                    url.searchParams.set("prefix", input.path + "/")
                    return this.doFetch(url, { method: "DELETE" })
                }))
            }

            if (config.settings.folder_mode === "dynamic") {
                let url = new URL(this.URL.toString() + "/resources/by_asset_folder")
                url.searchParams.set("asset_folder", input.path)
                const assets: CloudinarySearchResponse = await this.doFetch(url)
                const public_ids = assets.resources.map((asset) => asset.public_id)
                await Promise.all(resource_types.map(async type => {
                    const url = new URL(this.URL.toString() + `/resources/${type}/upload`)
                    url.searchParams.set("public_ids", public_ids.join(","))
                    return this.doFetch(url, { method: "DELETE" })
                }))
            }
        }

        // ...Finally delete folder
        const url = new URL(this.URL.toString() + "/folders/" + input.path)
        await this.doFetch(url, { method: "DELETE" })

        return {
            success: true,
        }
    }

    public async upload(input: UploadInput) {
        const config = await this.getConfig()

        const uploadedFiles: Asset[] = await Promise.all(
            input.files.map((file) => {
                const url = new URL(this.URL.toString() + "/auto/upload")

                const filename = file.name
                const publicId = input.folder ? `${input.folder}/${filename}` : filename
                const timestamp = Math.floor(Date.now() / 1000)
                const folder: Record<string, any> = {}

                url.searchParams.append("api_key", this.API_KEY)
                url.searchParams.append("file", file.arrayBuffer.toString())
                url.searchParams.append("timestamp", timestamp.toString())
                url.searchParams.append("use_filename", "true")

                if (config.settings.folder_mode === "dynamic") {
                    url.searchParams.append("asset_folder", input.folder || "")
                    folder.asset_folder = input.folder || ""
                }

                if (config.settings.folder_mode === "fixed") {
                    url.searchParams.append("folder", input.folder || "")
                    folder.folder = input.folder || ""
                }

                const signature = this.makeSignature({
                    timestamp,
                    use_filename: "true",
                    ...folder,
                })

                url.searchParams.append("signature", signature)

                url.searchParams.sort()

                return this.doFetch(url, { method: "POST" })
            })
        )

        return uploadedFiles
    }

    public async renameAsset() {
        return null as any
    }

    public async deleteAsset() {
        return null as any
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
