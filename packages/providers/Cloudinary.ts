import { GetResourcesByFolderInput, GetResourcesByFolderReturn, GetAssetsInput, GetAssetsReturn, Provider, AssetType } from "."

type CloudinaryConfig = {
    API_KEY: string
    API_SECRET: string
    CLOUD_NAME: string
}

export class Cloudinary implements Provider {
    private URL: string
    private URL_SEARCH = "/resources/search"
    private URL_FOLDERS = "/folders"
    private MAX_RESULTS = 50
    private HEADERS: Headers
    private async doFetch(url: string | URL) {
        return fetch(url, { headers: this.HEADERS }).then((res) => res.json())
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

    private mapExternalAssetsToSchema(data: CloudinarySearchResponse["resources"]) {
        return data.map((asset) => ({
            assetId: asset.asset_id,
            publicId: asset.public_id,
            type: this.mapResourceType(asset.resource_type) as AssetType,
            format: asset.format,
            url: asset.url,
            folder: asset.folder,
            name: asset.filename,
            bytes: asset.bytes,
            width: asset.width,
            height: asset.height,
            tags: asset.tags,
            modifiedAt: asset.version,
        }))
    }

    private mapExternalFoldersToSchema(data: CloudinaryFolderResponse["folders"]) {
        return data.map((folder) => ({
            id: folder.path,
            name: folder.name,
            path: folder.path,
        }))
    }

    public async getAssets(input?: GetAssetsInput) {
        const url = new URL(this.URL.toString() + this.URL_SEARCH)
        url.searchParams.append("expression", input?.searchQuery ?? "")
        url.searchParams.append("with_field", "tags")
        url.searchParams.append("max_results", this.MAX_RESULTS.toString())

        const assets: CloudinarySearchResponse = await this.doFetch(url)

        return {
            data: this.mapExternalAssetsToSchema(assets.resources),
            count: assets.total_count,
        }
    }

    public async getResourcesByFolder(input?: GetResourcesByFolderInput) {
        let url = new URL(this.URL.toString() + this.URL_SEARCH)

        const folder = input?.folder ? "folder:" + input.folder : 'folder=""'
        const searchQuery = input?.searchQuery ? `AND ${input.searchQuery}` : null
        const expression = [folder, searchQuery].join(" ")

        url.searchParams.append("expression", expression)
        url.searchParams.append("with_field", "tags")
        url.searchParams.append("max_results", this.MAX_RESULTS.toString())

        const assets: CloudinarySearchResponse = await this.doFetch(url)

        url = new URL([this.URL.toString(), this.URL_FOLDERS, "/", input?.folder].join(""))

        const folders: CloudinaryFolderResponse = await this.doFetch(url)

        return {
            folder: assets.resources[0]?.folder || input?.folder || "",
            resources: {
                folders: {
                    data: this.mapExternalFoldersToSchema(folders.folders),
                    count: folders.total_count,
                },
                assets: {
                    data: this.mapExternalAssetsToSchema(assets.resources),
                    count: assets.total_count,
                },
            },
        }
    }
}

type CloudinarySearchResponse = {
    total_count: number
    resources: Array<{
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
    }>
}

type CloudinaryFolderResponse = {
    total_count: number
    folders: Array<{
        name: string
        path: string
    }>
}
