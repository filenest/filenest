import { Provider } from ".."

import {
    type GetResourcesByFolderInput,
    type GetAssetsInput,
    type AssetType,
    type GetAssetInput,
    type CreateFolderInput,
    type RenameFolderInput,
    type DeleteFolderInput,
} from "../types"

type CloudinaryConfig = {
    API_KEY: string
    API_SECRET: string
    CLOUD_NAME: string
}

export class Cloudinary implements Provider {
    private URL: string
    private MAX_RESULTS = 50
    private HEADERS: Headers
    private async doFetch(url: string | URL, init?: RequestInit) {
        return fetch(url, { headers: this.HEADERS, ...init }).then((res) => res.json())
    }

    constructor(config: CloudinaryConfig) {
        const { API_KEY, API_SECRET, CLOUD_NAME } = config
        this.URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}`
        this.HEADERS = new Headers({
            Authorization: `Basic ${btoa(`${API_KEY}:${API_SECRET}`)}`,
        })
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
        let url = new URL(this.URL.toString() + "/config")
        url.searchParams.append("settings", "true")

        const config: CloudinaryEnvironment = await this.doFetch(url)

        if (config.settings.folder_mode === "fixed") {
            throw new Error("Renaming folders is not supported in fixed folder mode.")
        }

        url = new URL(this.URL.toString() + "/folders/" + input.path)
        url.searchParams.append("to_folder", input.newPath)

        const folder: { from: CloudinaryFolder; to: CloudinaryFolder } = await this.doFetch(url, { method: "PUT" })

        return this.mapFolderToSchema(folder.to)
    }

    public async deleteFolder(input: DeleteFolderInput) {
        const { resources } = await this.getResourcesByFolder({ folder: input.path })

        if (resources.assets.count > 0 && !input.force) {
            throw new Error("The folder you're trying to delete is not empty. Delete all assets first.")
        }

        // Delete all assets in the folder when force deleting
        let url = new URL(this.URL.toString() + "/resources")
        url.searchParams.append("prefix", input.path)
        await this.doFetch(url, { method: "DELETE" })

        // ...Finally delete folder
        url = new URL(this.URL.toString() + "/folders/" + input.path)
        await this.doFetch(url, { method: "DELETE" })

        return {
            success: true,
        }
    }

    public async upload() {
        return null as any
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
    total_count: number
    resources: CloudinaryResource[]
}

type CloudinaryFolder = {
    name: string
    path: string
}

type CloudinaryFolderResponse = {
    total_count: number
    folders: CloudinaryFolder[]
}
