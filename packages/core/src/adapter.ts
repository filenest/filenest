import { Provider } from "."
import { getHandlersFromProvider } from "./utils"
import { ClientAPICallerREST, ClientAPICallerTRPC } from "./client"

export interface AdapterClient {
  fetchers: ReturnType<typeof getHandlersFromProvider>
}

interface AdapterClientOptions {
  endpoint: string
  onError?: (message: string) => void
}

export type MakeAdapterClient = (options: AdapterClientOptions) => AdapterClient

const prepareClient = (
  APICaller: typeof ClientAPICallerREST | typeof ClientAPICallerTRPC,
  s: string
): MakeAdapterClient => {
  return (options: AdapterClientOptions) => {
    const { endpoint, onError } = options

    const caller = new APICaller(endpoint, onError)

    return {
      fetchers: {
        files: {
          async getFiles(input) {
            return await caller.call(`${s}files${s}getFiles`, input)
          },
          async deleteFiles(input) {
            return await caller.call(`${s}files${s}deleteFiles`, input, {
              method: "POST",
            })
          },
          async getUploadUrl(input) {
            return await caller.call(`${s}files${s}getUploadUrl`, input)
          },
          async getRequiredParams() {
            return await caller.call(`${s}files${s}getRequiredParams`, undefined)
          },
          async updateFile(input) {
            return await caller.call(`${s}files${s}updateFile`, input, {
              method: "POST",
            })
          },
        } satisfies Provider["files"],
        folders: {
          async getFolders(input) {
            return await caller.call(`${s}folders${s}getFolders`, input)
          },
          async createFolder(input) {
            return await caller.call(`${s}folders${s}createFolder`, input, {
              method: "POST",
            })
          },
          async deleteFolder(input) {
            return await caller.call(`${s}folders${s}deleteFolder`, input, {
              method: "POST",
            })
          },
          async updateFolder(input) {
            return await caller.call(`${s}folders${s}updateFolder`, input, {
              method: "POST",
            })
          },
        } satisfies Provider["folders"],
      },
    }
  }
}

export const RESTClient = prepareClient(ClientAPICallerREST, "/")
export const TRPCClient = prepareClient(ClientAPICallerTRPC, ".")
