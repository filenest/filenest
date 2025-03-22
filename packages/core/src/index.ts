/**
 * Base for all other providers
 */
export interface Provider {
  name: string

  files: {
    /**
     * Get files matching the input params
     */
    getFiles: (input?: {
      prefix?: string
      delimiter?: string
      query?: string
      limit?: number
      skip?: number | null
      cursor?: string | number | null
    }) => Promise<
      FilenestResponse<{
        files: FilenestFile[]
        nextCursor?: string | null
        nextSkip?: number | null
        count?: number
      }>
    >

    /**
     * Get presigned upload URL
     */
    getUploadUrl: <TData>(input: {
      file?: {
        name: string
        size: number
      }
      folder?: string
    }) => Promise<
      FilenestResponse<{
        url: string
        key?: string
        params: {
          fileParam: {
            name: string
            type: "stringOrBlob" | "object" | "objectArray"
            data?: Record<string, any> | Array<Record<string, any>>
          }
          otherUploadParams: Record<string, any>
        }
      }>
    >

    /**
     * Update details of a file
     */
    updateFile?: (input: any) => Promise<FilenestResponse<AnyRouteReturn>>

    /**
     * Delete files
     */
    deleteFiles: (input: {
      ids?: string[]
      prefix?: string
    }) => Promise<FilenestResponse<AnyRouteReturn>>
  }

  folders: {
    /**
     * Get all folders in a path
     */
    getFolders: (input: { path: string }) => Promise<
      FilenestResponse<{
        folders: FilenestFolder[]
        nextCursor?: string | null
        count?: number
      }>
    >

    /**
     * Create a new folder
     */
    createFolder: (input: {
      key: string
      path: string
      displayName?: string
    }) => Promise<FilenestResponse<FilenestFolder>>

    /**
     * Update details of a folder
     */
    updateFolder: (input: {
      path: string
      newPath?: string
      displayName?: string
    }) => Promise<FilenestResponse<FilenestFolder>>

    /**
     * Delete a folder (and its contents)
     */
    deleteFolder: (input: {
      path: string
      ignoreNotEmpty?: boolean
    }) => Promise<FilenestResponse<AnyRouteReturn>>
  }
}

export type AnyRouteReturn = string | number | boolean | Record<string, any>

export type RouteReturnSuccess<T> = {
  success: true
  data: T
  message?: string
}

export class RouteReturnError {
  success = false
  error: unknown
  message: string
  code?: ErrorCode

  constructor(message: string, opts: { error?: unknown; code?: ErrorCode } = {}) {
    this.message = message
    this.error = opts.error
    this.code = opts.code
  }
}

export type FilenestResponse<TReturn extends AnyRouteReturn> =
  | RouteReturnSuccess<TReturn>
  | RouteReturnError

export interface FilenestFile {
  /**
   * Unique identifier for the file.
   * Will be = `key` in case of S3 compatible provider.
   */
  id: string

  /**
   * Key of object in a bucket.
   * Will be `id` if provider is not S3 compatible.
   */
  key: string

  /**
   * Name of the file
   */
  name: string | undefined

  /**
   * Size of the file in bytes
   */
  size: number

  /**
   * File extension
   */
  extension: string

  /**
   * Timestamp of last modification
   */
  updatedAt: string

  /**
   * URL to view the file
   */
  url: string
}

export interface FilenestFolder {
  /**
   * Unique identifier for the folder.
   * Will be = `key` in case of S3 compatible provider.
   */
  id: string

  /**
   * The folder ID, but practically it's a common prefix of files
   */
  key: string

  /**
   * Display name of the folder, if supported
   */
  displayName?: string
}

export const ErrorCode = {
  FOLDER_NOT_EMPTY: 1000,
  FEATURE_NOT_SUPPORTED: 1001,
} as const

type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]
