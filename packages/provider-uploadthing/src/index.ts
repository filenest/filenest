import { ErrorCode, RouteReturnError, type Provider } from "@filenest/core"
import { getFileExtension } from "@filenest/core/utils"

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
  private LIMIT = 30

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

  files = {
    getFiles: async (input = {}) => {
      try {
        const body: Record<string, any> = {}
        body.limit = Number(input.limit || this.LIMIT)
        if (input.skip) body.offset = Number(input.skip)

        let files: UploadThingListItemsResponse["files"] = []

        // Uploadthing doesn't support filering as of writing this.
        // So let's fetch many files and filter them in memory.
        // Might be bad practice, but I want filtering. Can change later.
        if (input.query) {
          body.limit = this.LIMIT * 10
          let hasMore = false

          // Fetch many files and try to return 50 search results
          do {
            const response = await this.defaultFetch(`${this.apiUrlV6}/listFiles`, {
              body: JSON.stringify(body),
            })

            const json = (await response.json()) as
              | UploadThingListItemsResponse
              | UploadThingError

            if ("error" in json) {
              throw new Error(json.error)
            }

            files.push(
              ...json.files.filter((file) =>
                file.name.toLowerCase().includes(input.query!.toLowerCase())
              )
            )

            if (json.hasMore) {
              hasMore = true
              // Increase offset to fetch more files after we've
              // searched through the current batch
              body.offset ||= 0
              body.offset += this.LIMIT
            } else {
              hasMore = false
            }
          } while (files.length < 50 && hasMore)

          return {
            success: true,
            data: {
              files: files.map((file) => ({
                id: file.key,
                key: file.key,
                name: file.name,
                size: file.size,
                extension: getFileExtension(file.name),
                updatedAt: file.uploadedAt.toString(),
                url: this.getFileUrl(file.key),
              })),
              count: files.length,
              ...(hasMore && {
                nextSkip: body.offset,
              }),
            },
          }
        }

        const response = await this.defaultFetch(`${this.apiUrlV6}/listFiles`, {
          body: JSON.stringify(body),
        })

        const json = (await response.json()) as
          | UploadThingListItemsResponse
          | UploadThingError

        if ("error" in json) {
          throw new Error(json.error)
        }

        files = json.files

        return {
          success: true,
          data: {
            files: files.map((file) => ({
              id: file.key,
              key: file.key,
              name: file.name,
              size: file.size,
              extension: getFileExtension(file.name),
              updatedAt: file.uploadedAt.toString(),
              url: this.getFileUrl(file.key),
            })),
            count: files.length,
            ...(json.hasMore && {
              nextSkip: Number(input.skip || 0) + Number(input.limit || this.LIMIT),
            }),
          },
        }
      } catch (error) {
        return new RouteReturnError("Failed to fetch files", { error })
      }
    },
    getUploadUrl: async (input) => {
      const { file, folder } = input
      if (!file || (!file && !folder)) {
        return new RouteReturnError("No file or folder provided")
      }

      const signingParams = {
        fileName: file.name,
        fileSize: file.size,
      }

      try {
        const preparation = await this.defaultFetch(`${this.apiUrlV7}/prepareUpload`, {
          body: JSON.stringify(signingParams),
        })

        const preparationData = (await preparation.json()) as
          | UploadThingPrepareUploadResponse
          | UploadThingError

        if ("error" in preparationData) {
          throw new Error(preparationData.error)
        }

        return {
          success: true,
          data: {
            ...preparationData,
            params: {
              fileParam: {
                name: "file",
                type: "stringOrBlob",
              },
              otherUploadParams: {},
            },
            method: "PUT",
          },
        }
      } catch (error) {
        return new RouteReturnError("Failed to get upload URL", { error })
      }
    },
    deleteFiles: async (input) => {
      const body = {
        fileKeys: input.ids,
      }

      try {
        const response = await this.defaultFetch(`${this.apiUrlV6}/deleteFiles`, {
          body: JSON.stringify(body),
        })

        const json = (await response.json()) as
          | UploadThingDeleteItemsResponse
          | UploadThingError

        if ("error" in json) {
          throw new Error(json.error)
        }

        return {
          success: true,
          data: {
            count: json.deletedCount,
          },
        }
      } catch (error) {
        return new RouteReturnError("Failed to delete files", { error })
      }
    },
    updateFile: async () => {
      return new RouteReturnError("Not supported", {
        code: ErrorCode.FILENEST_ERR_FEATURE_NOT_SUPPORTED,
      })
    },
  } satisfies Provider["files"]

  folders = {
    getFolders: async () => {
      return new RouteReturnError("Not supported", {
        code: ErrorCode.FILENEST_ERR_FEATURE_NOT_SUPPORTED,
      })
    },
    createFolder: async () => {
      return new RouteReturnError("Not supported", {
        code: ErrorCode.FILENEST_ERR_FEATURE_NOT_SUPPORTED,
      })
    },
    deleteFolder: async () => {
      return new RouteReturnError("Not supported", {
        code: ErrorCode.FILENEST_ERR_FEATURE_NOT_SUPPORTED,
      })
    },
    updateFolder: async () => {
      return new RouteReturnError("Not supported", {
        code: ErrorCode.FILENEST_ERR_FEATURE_NOT_SUPPORTED,
      })
    },
  } satisfies Provider["folders"]
}

interface UploadThingError {
  error: string
  data: Array<Record<string, any>>
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

interface UploadThingDeleteItemsResponse {
  success: boolean
  deletedCount: number
}

interface UploadThingPrepareUploadResponse {
  key: string
  url: string
}
