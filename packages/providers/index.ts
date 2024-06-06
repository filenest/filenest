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
     * #### Get a single asset by its ID
     *
     * Use this to get details on a specific image or any other file.
     */
    getAsset: (input: GetAssetInput) => Promise<Asset>

    /**
     * #### Get all assets, regardless of which folder they are in
     *
     * Includes pagination data, if available.
     */
    getAssets: (input?: GetAssetsInput) => Promise<Paginated<Asset>>

    /**
     * #### Get all resources in a specific folder
     *
     * Includes files and folders directly under the specified folder.\
     * If no folder is specified, resources in the root folder are returned.
     */
    getResourcesByFolder: (input?: GetResourcesByFolderInput) => Promise<FolderWithResources>

    /**
     * #### Create an empty folder
     * 
     * @returns The new folder.
     */
    createFolder: (input: CreateFolderInput) => Promise<Folder>

    /**
     * #### Rename a folder
     *
     * Might not be supported in some cases (e.g. Cloudinary fixed folder environment).
     * 
     * @returns The new folder.
     */
    renameFolder(input: RenameFolderInput): Promise<Folder>

    /**
     * #### Delete a folder
     *
     * Only deletes the folder if it is empty. If the folder is not empty,\
     * you can force delete it, which will also delete all files and folders inside.
     */
    deleteFolder(input: DeleteFolderInput): Promise<Response>

    /**
     * #### Upload a file to the provider
     * 
     * Can be a single or multiple files of any type, respectively.
     * 
     * @returns The uploaded assets.
     */
    upload: (input: UploadInput) => Promise<Asset[]>

    /**
     * #### Rename an asset
     * 
     * This might cause the current public URL to change.
     * 
     * @returns The updated asset
     */
    renameAsset(input: RenameAssetInput): Promise<Asset>

    /**
     * #### Delete an asset
     */
    deleteAsset(input: DeleteAssetInput): Promise<Response>
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

export type AssetType = "image" | "video" | "audio" | "document" | "other"

type Asset = {
    assetId: string
    publicId: string
    type: AssetType
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

type Response = {
    success: boolean
    message?: string
}

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

export type GetAssetInput = { id: string }
export type GetAssetReturn = Awaited<ReturnType<Provider["getAsset"]>>
export type GetAssetsInput = Pick<CommonInputOpts, "searchQuery">
export type GetAssetsReturn = Awaited<ReturnType<Provider["getAssets"]>>
export type GetResourcesByFolderInput = Optional<CommonInputOpts, "searchQuery">
export type GetResourcesByFolderReturn = Awaited<ReturnType<Provider["getResourcesByFolder"]>>
export type CreateFolderInput = { path: string }
export type CreateFolderReturn = Awaited<ReturnType<Provider["createFolder"]>>
export type RenameFolderInput = { path: string; newPath: string }
export type RenameFolderReturn = Awaited<ReturnType<Provider["renameFolder"]>>
export type DeleteFolderInput = { path: string }
export type DeleteFolderReturn = Response
export type UploadInput = { files: File[]; folder: string }
export type RenameAssetInput = { id: string; name: string }
export type RenameAssetReturn = Awaited<ReturnType<Provider["renameAsset"]>>
export type DeleteAssetInput = { id: string }
export type DeleteAssetReturn = Awaited<ReturnType<Provider["deleteAsset"]>>