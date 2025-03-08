import { RouteHandlers, type Provider } from "@filenest/core"

interface UploadThingConfig {
    UPLOADTHING_TOKEN: string
}

export class UploadThing implements Provider {
    name = "UploadThing" as const

    private UPLOADTHING_TOKEN: string
    private apiKey: string
    private appId: string
    private apiUrlV6 = "https://api.uploadthing.com/v6"
    private apiUrlV7 = "https://api.uploadthing.com/v7"

    constructor(config: UploadThingConfig) {
        this.UPLOADTHING_TOKEN = config.UPLOADTHING_TOKEN
        const { apiKey, appId } = JSON.parse(
            Buffer.from(config.UPLOADTHING_TOKEN, "base64").toString("utf-8")
        )
        this.apiKey = apiKey
        this.appId = appId
    }

    private getFileUrl(key: string) {
        return `https://${this.appId}.ufs.sh/f/${key}`
    }

    private async defaultFetch(info: RequestInfo, init?: RequestInit) {
        return fetch(info, {
            method: "POST",
            headers: {
                "X-Uploadthing-Api-Key": this.apiKey,
                "content-type": "application/json",
            },
            ...init,
        })
    }

    files: Provider["files"] = {
        GET: async (input = {}) => {
            try {
                const body: Record<string, any> = {}
                if (input.limit) body.limit = input.limit
                if (input.skip) body.offset = input.skip

                // Uploadthing doesn't support filering as of writing this.
                // So let's fetch all files and filter them in memory.
                // Might be bad practice, but I want filtering. Can change later.
                if (input.query) body.limit = 100_000

                const response = await this.defaultFetch(`${this.apiUrlV6}/listFiles`, {
                    body: JSON.stringify(body),
                })

                const json = (await response.json()) as
                    | UploadThingListItemsResponse
                    | UploadThingError

                if ("error" in json) {
                    throw new Error(json.error)
                }

                let files = json.files

                if (input.query) {
                    files = files.filter((file) =>
                        file.name.toLowerCase().includes(input.query!.toLowerCase())
                    )
                }

                return {
                    success: true,
                    data: json.files.map((file) => ({
                        id: file.key,
                        key: file.key,
                        name: file.name,
                        size: file.size,
                        updatedAt: file.uploadedAt.toString(),
                        url: this.getFileUrl(file.key),
                    })),
                }
            } catch (error) {
                return {
                    success: false,
                    error,
                    message: "Failed to fetch files",
                }
            }
        },
        POST: async (input) => {
            return { success: true, message: "POST files" }
        },
    }

    folders: Provider["folders"] = {
        GET: async (input) => {
            return { success: false, error: true, message: "Not supported" }
        },
        POST: async (input) => {
            return { success: false, error: true, message: "Not supported" }
        },
    }

    resources: Provider["resources"] = {
        GET: async (input) => {
            if (!input) {
                return { success: false, error: true, message: "Missing input" }
            }

            try {
                const files = await this.files.GET({ prefix: input.path })

                if ("error" in files) {
                    throw new Error("Failed to fetch resources")
                }

                return {
                    success: true,
                    data: {
                        files: files.data,
                        folders: [], // not supported, return empty array
                    },
                }
            } catch (error) {
                return {
                    success: false,
                    error,
                    message: "Failed to fetch resources",
                }
            }
        },
        POST: async (input) => {
            return { success: false, error: true, message: "Method not supported" }
        },
    }
}

interface UploadThingError {
    error: string
}

interface UploadThingListItemsResponse {
    hasMore: boolean
    files: Array<{
        customId: string | null
        key: string
        name: string
        size: number
        uploadedAt: number
    }>
}
