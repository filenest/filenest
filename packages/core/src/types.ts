import { z } from "zod"

const Folder = z.object({
    id: z.string(),
    name: z.string(),
    path: z.string(),
})

export type Folder = z.infer<typeof Folder>

const AssetType = z.union([
    z.literal("image"),
    z.literal("video"),
    z.literal("audio"),
    z.literal("document"),
    z.literal("other"),
])

export type AssetType = z.infer<typeof AssetType>

const Asset = z.object({
    assetId: z.string(),
    publicId: z.string(),
    type: AssetType,
    format: z.string(),
    url: z.string(),
    folder: z.string(),
    name: z.string(),
    bytes: z.number(),
    width: z.number(),
    height: z.number(),
    tags: z.array(z.string()),
    modifiedAt: z.number(),
})

export type Asset = z.infer<typeof Asset>

const Paginated = <T extends z.ZodType<any>>(type: T) => {
    return z.object({
        data: z.array(type),
        count: z.number(),
        nextCursor: z.string().optional(),
    })
}

export type Paginated<T> = {
    data: T[]
    count: number
    nextCursor?: string
}

const Resources = z.object({
    folders: Paginated(Folder),
    assets: Paginated(Asset),
})

type Resources = z.infer<typeof Resources>

const FolderWithResources = z.object({
    folder: z.string(),
    resources: Resources,
})

export type FolderWithResources = z.infer<typeof FolderWithResources>

const Response = z.object({
    success: z.boolean(),
    message: z.string().optional(),
})

export type Response = z.infer<typeof Response>

export const GetResourcesInput = z.object({
    folder: z.string().optional(),
    global: z.boolean().optional(),
    searchQuery: z.string().optional(),
    nextCursor: z.string().optional(),
})
export type GetResourcesInput = z.infer<typeof GetResourcesInput>

export const GetResourcesReturn = FolderWithResources
export type GetResourcesReturn = z.infer<typeof GetResourcesReturn>

export const CreateFolderInput = z.object({
    path: z.string(),
})
export type CreateFolderInput = z.infer<typeof CreateFolderInput>

export const CreateFolderReturn = Folder
export type CreateFolderReturn = z.infer<typeof CreateFolderReturn>

export const RenameFolderInput = z.object({
    path: z.string(),
    newPath: z.string(),
})
export type RenameFolderInput = z.infer<typeof RenameFolderInput>

export const RenameFolderReturn = Folder
export type RenameFolderReturn = z.infer<typeof RenameFolderReturn>

export const DeleteFolderInput = z.object({
    path: z.string(),
    force: z.boolean().optional(),
})
export type DeleteFolderInput = z.infer<typeof DeleteFolderInput>

export const DeleteFolderReturn = Response
export type DeleteFolderReturn = z.infer<typeof DeleteFolderReturn>

export const UploadInput = z.object({
    files: z.array(z.instanceof(File)),
    folder: z.string().optional(),
})
export type UploadInput = z.infer<typeof UploadInput>

export const GetUploadUrlInput = z.record(z.string())
export type GetUploadUrlInput = z.infer<typeof GetUploadUrlInput>

export const GetUploadUrlReturn = z.object({
    timestamp: z.string(),
    signature: z.string(),
})
export type GetUploadUrlReturn = z.infer<typeof GetUploadUrlReturn>

export const UploadReturn = z.array(Asset)
export type UploadReturn = z.infer<typeof UploadReturn>

export const RenameAssetInput = z.object({
    id: z.string(),
    name: z.string(),
    updateDeliveryUrl: z.boolean().optional(),
})
export type RenameAssetInput = z.infer<typeof RenameAssetInput>

export const RenameAssetReturn = Response
export type RenameAssetReturn = z.infer<typeof RenameAssetReturn>

export const DeleteAssetInput = z.object({
    id: z.string(),
})
export type DeleteAssetInput = z.infer<typeof DeleteAssetInput>

export const DeleteAssetReturn = Response
export type DeleteAssetReturn = z.infer<typeof DeleteAssetReturn>
