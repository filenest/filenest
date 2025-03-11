import crypto from "crypto"
import {
    ErrorCode,
    FeatureFlags,
    FileBase,
    FolderBase,
    RouteReturnError,
    type Provider,
} from "@filenest/core"

export const featureFlags: FeatureFlags = {
    files: {
        rename: true,
    },
    folders: {
        list: true,
        create: true,
        delete: true,
        rename: true,
    },
}

type CloudinaryConfig = {
    API_KEY: string
    API_SECRET: string
    CLOUD_NAME: string
}

export class Cloudinary implements Provider {
    name = "Cloudinary" as const

    supports = featureFlags

    private _URL: string
    private _MAX_RESULTS = 500
    private _API_SECRET: string
    private _API_KEY: string
    private _HEADERS: Headers
    private resourceTypes = ["image", "raw", "video"]

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

    private _mapResourceToSchema(resource: CloudinaryResource): FileBase {
        return {
            id: resource.asset_id,
            key: resource.public_id,
            url: resource.secure_url,
            name: resource.display_name || resource.filename,
            size: resource.bytes,
            updatedAt: resource.version.toString(),
        }
    }

    private _mapResourcesToSchema(resource: CloudinaryResource[]) {
        return resource.map((asset) => this._mapResourceToSchema(asset))
    }

    private _mapFolderToSchema(folder: CloudinaryFolder): FolderBase {
        return {
            id: folder.path,
            key: folder.path,
            displayName: folder.name,
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

    files: Provider["files"] = {
        getFiles: async (input) => {
            let url: URL = new URL(this._URL.toString() + "/resources")

            if (!input?.prefix && !input?.query) {
                return new RouteReturnError("Specify either prefix or query")
            }

            if (input?.prefix && input.query) {
                return new RouteReturnError(
                    "Specify either prefix or query, but not both"
                )
            }

            if (input?.query) {
                url = new URL(this._URL.toString() + "/resources/search")

                const folder = input?.prefix ? `folder:\"${input.prefix}\"` : 'folder=""'

                const searchQuery = `(public_id:${input.query}* OR display_name:${input.query}* OR filename:${input.query}*)`

                const expression = [folder, searchQuery].filter((i) => !!i).join(" AND ")

                url.searchParams.append("expression", expression)
                url.searchParams.append("max_results", this._MAX_RESULTS.toString())
            }

            if (input?.prefix) {
                const { settings } = await this._getConfig()

                if (settings.folder_mode === "fixed") {
                    url.searchParams.append("prefix", input.prefix)
                }

                if (settings.folder_mode === "dynamic") {
                    url = new URL(this._URL.toString() + "/resources/by_asset_folder")
                    url.searchParams.append("asset_folder", input.prefix)
                    url.searchParams.append("max_results", this._MAX_RESULTS.toString())
                }
            }

            if (input?.cursor) {
                url.searchParams.append("next_cursor", input.cursor.toString())
            }

            const files: CloudinarySearchResponse = await this._doFetch(url)

            return {
                success: true,
                data: {
                    files: this._mapResourcesToSchema(files.resources),
                    count: files.total_count,
                    cursor: files.next_cursor,
                },
            }
        },
        getRequiredParams: () => {
            return {
                success: true,
                data: {
                    requiredParams: {
                        fileParam: "file",
                        folderParam: "folder",
                    },
                    defaultParams: {
                        use_filename: "true",
                        unique_filename: "true",
                    },
                },
            }
        },
        getUploadUrl: async (input) => {
            const { signingParams } = input

            if (!signingParams) {
                return new RouteReturnError("signingParams is required")
            }

            const { settings } = await this._getConfig()

            if (settings.folder_mode === "dynamic") {
                signingParams.asset_folder =
                    signingParams.folder || signingParams.asset_folder || ""
                delete signingParams.folder
            }

            const timestamp = Math.floor(Date.now() / 1000).toString()
            signingParams.timestamp = timestamp

            const signature = await this._makeSignature(signingParams)

            const url = new URL(this._URL.toString() + "/auto/upload")
            url.searchParams.append("api_key", this._API_KEY)
            url.searchParams.append("signature", signature)
            Object.entries(signingParams).forEach(([key, value]) => {
                url.searchParams.append(key, value)
            })
            url.searchParams.sort()

            return {
                success: true,
                data: url.toString(),
            }
        },
        deleteFiles: async (input) => {
            const { ids, prefix } = input

            if (!ids && !prefix) {
                return new RouteReturnError("Specify either ids or prefix")
            }

            if (ids && prefix) {
                return new RouteReturnError("Specify either ids or prefix, but not both")
            }

            if (ids) {
                // Cloudinary allows 100 ids at a time
                const chunkSize = 100
                const chunks = Array.from(
                    { length: Math.ceil(ids.length / chunkSize) },
                    (_, i) => ids.slice(i * chunkSize, i * chunkSize + chunkSize)
                )

                let deletedCount = 0

                const url = new URL(this._URL.toString() + "/resources")

                for (const chunk of chunks) {
                    url.searchParams.set("asset_ids", chunk.join(","))

                    const response = (await this._doFetch(url, {
                        method: "DELETE",
                    }).then((res) => res.json())) as CloudinaryFilesDeleteResponse

                    deletedCount += Object.keys(response.deleted).length
                }

                return {
                    success: true,
                    data: deletedCount,
                }
            }

            if (prefix) {
                let isAllDeleted = false
                let deletedCount = 0

                for (const type of this.resourceTypes) {
                    const url = new URL(this._URL.toString() + `/resources/${type}`)
                    url.searchParams.append("prefix", prefix)

                    while (!isAllDeleted) {
                        const response = (await this._doFetch(url, {
                            method: "DELETE",
                        }).then((res) => res.json())) as CloudinaryFilesDeleteResponse

                        deletedCount += Object.keys(response.deleted).length

                        if (response.next_cursor && response.partial) {
                            url.searchParams.set("next_cursor", response.next_cursor)
                        } else {
                            isAllDeleted = true
                        }
                    }
                }

                return {
                    success: true,
                    data: deletedCount,
                }
            }

            return new RouteReturnError("Specify either ids or prefix")
        },
        updateFile: async (input) => {
            return new RouteReturnError("Not implemented")
        },
    }

    folders: Provider["folders"] = {
        getFolders: async (input) => {
            const url = new URL([this._URL.toString(), "/folders/", input.path].join(""))

            const folders: CloudinaryFolderResponse = await this._doFetch(url)

            return {
                success: true,
                data: {
                    folders: this._mapFoldersToSchema(folders.folders),
                    count: folders.total_count,
                    cursor: folders.next_cursor,
                },
            }
        },
        createFolder: async (input) => {
            const url = new URL(this._URL.toString() + "/folders/" + input.path)
            const folder: CloudinaryFolder = await this._doFetch(url, { method: "POST" })
            return {
                success: true,
                data: this._mapFolderToSchema(folder),
            }
        },
        updateFolder: async (input) => {
            const { path, newPath } = input

            // We need to check if environment uses fixed or dynamic folder mode.
            // Only dynamic folder mode supports renaming folders.
            const config = await this._getConfig()

            if (config.settings.folder_mode === "fixed") {
                return new RouteReturnError(
                    "Renaming folders is not supported in fixed folder mode"
                )
            }

            const url = new URL(this._URL.toString() + "/folders/" + path)
            if (newPath) {
                url.searchParams.append("to_folder", newPath)
            }

            const folder: { from: CloudinaryFolder; to: CloudinaryFolder } =
                await this._doFetch(url, { method: "PUT" })

            return {
                success: true,
                data: this._mapFolderToSchema(folder.to),
            }
        },
        deleteFolder: async (input) => {
            const { path, ignoreNotEmpty } = input

            const result = await this.files.getFiles({ prefix: path })

            if ("error" in result) {
                return result
            }

            const hasFiles = (result.data.count ?? 0) > 0

            const config = await this._getConfig()

            if (hasFiles && !ignoreNotEmpty) {
                return new RouteReturnError("This folder is not empty", {
                    code: ErrorCode.FOLDER_NOT_EMPTY,
                })
            }

            // Delete all assets in the folder when force deleting
            if (hasFiles) {
                if (config.settings.folder_mode === "fixed") {
                    await this.files.deleteFiles({ prefix: path })
                }

                if (config.settings.folder_mode === "dynamic") {
                    // In dynamic folders mode, we need to go to
                    // manually delete all assets in nested folders
                    let url = new URL(this._URL.toString() + "/resources/by_asset_folder")
                    url.searchParams.set("asset_folder", path)
                    url.searchParams.set("max_results", this._MAX_RESULTS.toString())

                    const allFolders: FolderBase[] = []

                    const getAllSubfolders = async (path: string) => {
                        const result = await this.folders!.getFolders({ path })
                        if ("error" in result) {
                            return
                        }
                        for (const folder of result.data.folders) {
                            allFolders.push(folder)
                            await getAllSubfolders(folder.key)
                        }
                    }

                    // Recursively get all subfolders
                    await getAllSubfolders(path)

                    // Then delete all assets in those folders
                    await Promise.all(
                        allFolders.map(async (folder) => {
                            // We need to get their ids and then delete them by id
                            let allDone = false

                            while (!allDone) {
                                const result = await this.files.getFiles({
                                    prefix: folder.key,
                                })

                                if ("error" in result) return

                                const ids = result.data.files.map((file) => file.id)
                                await this.files.deleteFiles({ ids })

                                if (!result.data.cursor) {
                                    allDone = true
                                }
                            }
                        })
                    )
                }
            }

            // ...Finally delete folder
            const url = new URL(this._URL.toString() + "/folders/" + input.path)
            await this._doFetch(url, { method: "DELETE" })

            return {
                success: true,
                data: {},
            }
        },
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
    next_cursor?: string | null
}

type CloudinaryFolder = {
    name: string
    path: string
}

type CloudinaryFolderResponse = {
    folders: CloudinaryFolder[]
    total_count: number
    next_cursor?: string | null
}

type CloudinaryFilesDeleteResponse = {
    deleted: Record<string, "deleted">
    partial: boolean
    next_cursor?: string | null
}
