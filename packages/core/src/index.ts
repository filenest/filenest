/**
 * Base for all other providers
 */
export interface Provider {
    name: string

    files: RouteHandlers<
        {
            prefix?: string
            delimiter?: string
            query?: string
            limit?: number
            skip?: number
            cursor?: string | number
        },
        { data: FileBase[] },
        any,
        any
    >
    folders: RouteHandlers<
        {
            path?: string
        },
        { data: FolderBase[] },
        {
            key: string
            path: string
            displayName?: string
        },
        { data: FolderBase }
    >
    resources: RouteHandlers<
        {
            path: string
        },
        {
            data: {
                files: FileBase[]
                folders: FolderBase[]
            }
        },
        never,
        never
    >
}

export interface RouteHandlers<
    TGETInput extends AnyRouteInput,
    TGETReturn extends AnyRouteReturn,
    TPOSTInput extends AnyRouteInput,
    TPOSTReturn extends AnyRouteReturn
> {
    GET: (
        input?: TGETInput
    ) => Promise<(TGETReturn & RouteReturnSuccess) | RouteReturnError>
    POST: (
        input?: TPOSTInput
    ) => Promise<(TPOSTReturn & RouteReturnSuccess) | RouteReturnError>
}

type AnyRouteInput = Record<string, string | number | boolean>

type AnyRouteReturn = {
    data: any
}

type RouteReturnSuccess = {
    success: true
    message?: string
}

type RouteReturnError = {
    success: false
    error: unknown
    message?: string
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
