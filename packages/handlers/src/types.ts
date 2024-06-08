import { Provider } from "."

export type CommonInputOpts = {
    folder: string
    searchQuery?: string
}

export type Folder = {
    id: string
    name: string
    path: string
}

export type AssetType = "image" | "video" | "audio" | "document" | "other"

export type Asset = {
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

export type Resources = {
    folders: Paginated<Folder>
    assets: Paginated<Asset>
}

export type FolderWithResources = {
    folder: string
    resources: Resources
}

export type Paginated<T> = {
    data: T[]
    count: number
    pagination?: {
        itemsPerPage: number
        currentPage: number
    }
}

export type Response = {
    success: boolean
    message?: string
}

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>

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
export type DeleteFolderInput = { path: string; force: boolean }
export type DeleteFolderReturn = Response
export type UploadInput = { files: File[]; folder: string }
export type RenameAssetInput = { id: string; name: string }
export type RenameAssetReturn = Awaited<ReturnType<Provider["renameAsset"]>>
export type DeleteAssetInput = { id: string }
export type DeleteAssetReturn = Awaited<ReturnType<Provider["deleteAsset"]>>
