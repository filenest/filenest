export { Cloudinary } from "./Cloudinary"

/**
 * ### Base for all other providers
 *
 * When adding a new provider, implement this interface and make sure\
 * you map the provider's API responses to the correct types\
 * to ensure a consistent schema across all providers.
 */
export interface Provider {
    /**
     * Get all resources, regardless of which folder they are in
     *
     * This includes only files, not folders
     */
    getResources: (input?: GetResourcesInput) => Promise<Paginated<Asset>>

    /**
     * Get all resources in a specific folder
     *
     * Includes both files and nested folders
     */
    getResourcesByFolder: (input?: GetResourcesByFolderInput) => Promise<FolderWithResources>
}

type CommonInputOpts = {
    folder: string
    searchQuery?: string
}

type Folder = {
    id: string
    name: string
    path: string
}

type Asset = {
    assetId: string
    publicId: string
    type: "image" | "video" | "audio" | "document" | "other"
    format: string
    url: string
    folder: string
    name: string
    bytes: number
    width: number
    height: number
    tags: string[]
    modifiedAt: number
}

type Resources = {
    folders: Paginated<Folder>
    assets: Paginated<Asset>
}

type FolderWithResources = {
    folder: string
    resources: Resources
}

type Paginated<T> = {
    data: T[]
    count: number
    pagination?: {
        itemsPerPage: number
        currentPage: number
    }
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type GetResourcesInput = Pick<CommonInputOpts, "searchQuery">
export type GetResourcesReturn = Awaited<ReturnType<Provider["getResources"]>>
export type GetResourcesByFolderInput = Optional<CommonInputOpts, "searchQuery">
export type GetResourcesByFolderReturn = Awaited<ReturnType<Provider["getResourcesByFolder"]>>
