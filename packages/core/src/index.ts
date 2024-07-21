import {
    GetResourcesInput,
    type FolderWithResources,
    CreateFolderInput,
    type Folder,
    RenameFolderInput,
    DeleteFolderInput,
    RenameAssetInput,
    DeleteAssetInput,
    type Response,
    GetUploadUrlInput,
} from "./types"

export * from "./types"

/**
 * ### Base for all other providers
 *
 * When adding a new provider, implement this interface and make sure\
 * you map the provider's API responses to the correct types\
 * to ensure a consistent schema across all providers.
 */
export interface Provider {
    /**
     * #### Get all resources (in a specific folder)
     *
     * Includes files and folders directly under the specified folder.\
     */
    getResources(input?: GetResourcesInput): Promise<FolderWithResources>

    /**
     * #### Create an empty folder
     *
     * @returns The new folder.
     */
    createFolder(input: CreateFolderInput): Promise<Folder>

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
     * #### Get a signed upload URL for uploading files from the client
     */
    getUploadUrl(input: GetUploadUrlInput): Promise<string>

    /**
     * #### Rename an asset
     *
     * This might cause the current public URL to change.
     *
     * @returns The updated asset
     */
    renameAsset(input: RenameAssetInput): Promise<Response>

    /**
     * #### Delete an asset
     */
    deleteAsset(input: DeleteAssetInput): Promise<Response>
}
