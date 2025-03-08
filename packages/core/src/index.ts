/**
 * Base for all other providers
 */
export interface Provider {
    name: string

    files: RouteHandlers<
        { prefix?: string; delimiter?: string; query?: string },
        { data: FileBase[] },
        any,
        any
    >
    folders: RouteHandlers<any, any, any, any>
    resources: RouteHandlers<any, any, any, any>
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
}
