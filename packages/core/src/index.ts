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
            skip?: number
            cursor?: string | number | null
        }) => Promise<
            | RouteReturnSuccess<{
                  files: FileBase[]
                  cursor?: string | null
                  count?: number
              }>
            | RouteReturnError
        >

        /**
         * Get the parameter names required for uploading a file
         */
        getRequiredParams: () =>
            | RouteReturnSuccess<
                  | {
                        requiredParams: {
                            fileParam: string
                            folderParam: string
                        }
                        defaultParams: Record<string, any>
                    }
                  | string
              >
            | RouteReturnError

        /**
         * Get presigned upload URL
         */
        getUploadUrl: (input: {
            signingParams: Record<string, string>
        }) => Promise<RouteReturnSuccess<string> | RouteReturnError>

        /**
         * Update details of a file
         */
        updateFile?: (
            input: AnyRouteInput
        ) => Promise<RouteReturnSuccess<AnyRouteReturn> | RouteReturnError>

        /**
         * Delete files
         */
        deleteFiles: (input: {
            ids?: string[]
            prefix?: string
        }) => Promise<RouteReturnSuccess<AnyRouteReturn> | RouteReturnError>
    }

    folders?: {
        /**
         * Get all folders in a path
         */
        getFolders: (input: { path: string }) => Promise<
            | RouteReturnSuccess<{
                  folders: FolderBase[]
                  cursor?: string | null
                  count?: number
              }>
            | RouteReturnError
        >

        /**
         * Create a new folder
         */
        createFolder?: (input: {
            key: string
            path: string
            displayName?: string
        }) => Promise<RouteReturnSuccess<FolderBase> | RouteReturnError>

        /**
         * Update details of a folder
         */
        updateFolder?: (input: {
            path: string
            newPath?: string
            displayName?: string
        }) => Promise<RouteReturnSuccess<FolderBase> | RouteReturnError>

        /**
         * Delete a folder (and its contents)
         */
        deleteFolder?: (input: {
            path: string
            ignoreNotEmpty?: boolean
        }) => Promise<RouteReturnSuccess<AnyRouteReturn> | RouteReturnError>
    }
}

type AnyRouteInput = Record<string, string | number | boolean>

type AnyRouteReturn = string | number | boolean | Record<string, any>

type RouteReturnSuccess<T> = {
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

export interface FileBase {
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
     * Timestamp of last modification
     */
    updatedAt: string

    /**
     * URL to view the file
     */
    url: string
}

export interface FolderBase {
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
} as const

type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode]
