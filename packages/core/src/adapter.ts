import { Provider } from "."
import { getHandlersFromProvider } from "./utils"
import { ClientAPICallerREST, ClientAPICallerTRPC } from "./client"

export interface AdapterClientConfig {
    fetchers: ReturnType<typeof getHandlersFromProvider>
}

interface AdapterClientOptions {
    endpoint: string
    onError?: (message: string) => void
}

export type MakeAdapterClient = (options: AdapterClientOptions) => AdapterClientConfig

export const RESTClient: MakeAdapterClient = (options) => {
    const { endpoint, onError } = options

    const caller = new ClientAPICallerREST(endpoint, onError)

    return {
        fetchers: {
            files: {
                async getFiles(input) {
                    return await caller.call("/files/getFiles", input)
                },
                async deleteFiles(input) {
                    return await caller.call("/files/deleteFiles", input, {
                        method: "POST",
                    })
                },
                async getUploadUrl(input) {
                    return await caller.call("/files/getUploadUrl", input)
                },
                async getRequiredParams() {
                    return await caller.call("/files/getRequiredParams", undefined)
                },
                async updateFile(input) {
                    return await caller.call("/files/updateFile", input, {
                        method: "POST",
                    })
                },
            } satisfies Provider["files"],
            folders: {
                async getFolders(input) {
                    return await caller.call("/folders/getFolders", input)
                },
                async createFolder(input) {
                    return await caller.call("/folders/createFolder", input, {
                        method: "POST",
                    })
                },
                async deleteFolder(input) {
                    return await caller.call("/folders/deleteFolder", input, {
                        method: "POST",
                    })
                },
                async updateFolder(input) {
                    return await caller.call("/folders/updateFolder", input, {
                        method: "POST",
                    })
                },
            } satisfies Provider["folders"],
        },
    }
}

export const TRPCClient: MakeAdapterClient = (options) => {
    const { endpoint, onError } = options

    const caller = new ClientAPICallerTRPC(endpoint, onError)

    return {
        fetchers: {
            files: {
                async getFiles(input) {
                    return await caller.call(".files.getFiles", input)
                },
                async deleteFiles(input) {
                    return await caller.call(".files.deleteFiles", input, {
                        method: "POST",
                    })
                },
                async getUploadUrl(input) {
                    return await caller.call(".files.getUploadUrl", input)
                },
                async getRequiredParams() {
                    return await caller.call(".files.getRequiredParams", undefined)
                },
                async updateFile(input) {
                    return await caller.call(".files.updateFile", input, {
                        method: "POST",
                    })
                },
            } satisfies Provider["files"],
            folders: {
                async getFolders(input) {
                    return await caller.call(".folders.getFolders", input)
                },
                async createFolder(input) {
                    return await caller.call(".folders.createFolder", input, {
                        method: "POST",
                    })
                },
                async deleteFolder(input) {
                    return await caller.call(".folders.deleteFolder", input, {
                        method: "POST",
                    })
                },
                async updateFolder(input) {
                    return await caller.call(".folders.updateFolder", input, {
                        method: "POST",
                    })
                },
            } satisfies Provider["folders"],
        },
    }
}
