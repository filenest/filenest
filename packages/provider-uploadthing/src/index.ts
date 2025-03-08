import { RouteHandlers, type Provider } from "@filenest/core"

interface UploadThingConfig {
    UPLOADTHING_TOKEN: string
}

export class UploadThing implements Provider {
    name = "UploadThing" as const

    private UPLOADTHING_TOKEN: string
    private apiKey: string
    private apiUrlV6 = "https://api.uploadthing.com/v6"
    private apiUrlV7 = "https://api.uploadthing.com/v7"

    constructor(config: UploadThingConfig) {
        this.UPLOADTHING_TOKEN = config.UPLOADTHING_TOKEN
        const { apiKey } = JSON.parse(
            Buffer.from(config.UPLOADTHING_TOKEN, "base64").toString("utf-8")
        )
        this.apiKey = apiKey
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
                const response = await this.defaultFetch(`${this.apiUrlV6}/listFiles`)

                const json = (await response.json()) as
                    | UploadThingListItemsResponse
                    | UploadThingError

                if ("error" in json) {
                    throw new Error(json.error)
                }

                return {
                    success: true,
                    data: json.files.map((file) => ({
                        id: file.key,
                        key: file.key,
                        name: file.name,
                        size: file.size,
                        updatedAt: file.uploadedAt.toString(),
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
            return { success: true, message: "GET folders" }
        },
        POST: async (input) => {
            return { success: true, message: "POST folders" }
        },
    }

    resources: Provider["resources"] = {
        GET: async (input) => {
            return { success: true, message: "GET resources" }
        },
        POST: async (input) => {
            return { success: true, message: "POST resources" }
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

new UploadThing({ UPLOADTHING_TOKEN: "ewewr" }).files.GET({ query: "dnb" })
