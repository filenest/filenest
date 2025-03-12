import { RouteReturnError, type Provider } from "@filenest/core"
import { FeatureFlags } from "@filenest/core/provider"

export const featureFlags: FeatureFlags = {
    files: {
        rename: true,
    },
    folders: {
        list: false,
        create: false,
        delete: false,
        rename: false,
    },
}

interface UploadThingConfig {
    UPLOADTHING_TOKEN: string
}

export class UploadThing implements Provider {
    name = "UploadThing" as const

    supports = featureFlags

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
        getFiles: async (input = {}) => {
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
                    data: {
                        files: files.map((file) => ({
                            id: file.key,
                            key: file.key,
                            name: file.name,
                            size: file.size,
                            updatedAt: file.uploadedAt.toString(),
                            url: this.getFileUrl(file.key),
                        })),
                        count: files.length,
                    },
                }
            } catch (error) {
                return new RouteReturnError("Failed to fetch files", { error })
            }
        },
        getRequiredParams: () => {
            return { success: false, error: true, message: "Not implemented" }
        },
        getUploadUrl: async (input) => {
            return { success: false, error: true, message: "Not implemented" }
        },
        deleteFiles: async (input) => {
            return { success: false, error: true, message: "Not implemented" }
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
