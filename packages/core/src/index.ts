type AvailableHandlers = "files" | "folders" | "resources"

type RequestMethods = "GET" | "POST" | "PUT"

type ExpandRecursively<T> = T extends object
    ? T extends infer O
        ? { [K in keyof O]: ExpandRecursively<O[K]> }
        : never
    : T

type SupportsMethods = {
    [key in RequestMethods]: boolean
}

type SupportsHandlers = {
    [key in AvailableHandlers]: boolean | ExpandRecursively<SupportsMethods>
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

type RouteHandlersWithIO = {
    [key in RequestMethods]: (
        input?: AnyRouteInput
    ) => Promise<(AnyRouteReturn & RouteReturnSuccess) | RouteReturnError>
}

type BuiltRouteHandlers<TSupports extends SupportsHandlers> = {
    [handler in AvailableHandlers as TSupports[handler] extends false
        ? never
        : handler]: TSupports[handler] extends true
        ? { [key in keyof RouteHandlersWithIO]: RouteHandlersWithIO[key] }
        : TSupports[handler] extends SupportsMethods
        ? {
              [method in RequestMethods as TSupports[handler][method] extends true
                  ? method
                  : never]: RouteHandlersWithIO[method]
          }
        : never
}

type ProviderBase = {
    name: string
}

/**
 * The provider config ensures a providers type safety
 */
export type ProviderConfig = {
    supports: SupportsHandlers
}

/**
 * The base interface for a provider
 */
export type Provider<TConfig extends ProviderConfig> = ProviderBase &
    BuiltRouteHandlers<TConfig["supports"]>

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
