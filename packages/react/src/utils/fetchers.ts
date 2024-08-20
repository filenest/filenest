import {
    type GetUploadUrlInput,
    type GetUploadUrlReturn,
    type CreateFolderInput,
    type CreateFolderReturn,
    type DeleteAssetInput,
    type DeleteAssetReturn,
    type DeleteFolderInput,
    type DeleteFolderReturn,
    type GetResourcesInput,
    type GetResourcesReturn,
    type RenameAssetInput,
    type RenameAssetReturn,
    type RenameFolderInput,
    type RenameFolderReturn,
} from "@filenest/core"

type CreateFetchersOpts = {
    endpoint: string
    endpointIsTRPC: boolean
    onError?: (message: string) => void
}

export function createFetchers({ endpoint, endpointIsTRPC, onError }: CreateFetchersOpts) {
    const errorMessage = "Filenest: An unknown error occurred"

    function makeUrl(endpoint: string, path: string, endpointIsTRPC: boolean) {
        if (endpointIsTRPC) {
            return endpoint + "." + path
        }
        return endpoint.replace(/\/+$/, "") + "/" + path
    }

    async function handleFetch(path: string, body?: any) {
        const url = makeUrl(endpoint, path, endpointIsTRPC)

        try {
            const result = await fetch(url, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async (res) => {
                if (!res.ok) {
                    const message = await res.json().then((data) => data.message || errorMessage)
                    throw new Error(message)
                }
                return res.json()
            })
            
            if (endpointIsTRPC) {
                if (result.error) {
                    onError?.(result.error.message)
                    return {
                        success: false,
                        message: result.error.message,
                    }
                }
    
                return result.result.data
            }
            
            return result
        } catch (error) {
            let message = errorMessage
            if (error instanceof Error) {
                message = error.message
            }
            onError?.(message)
        }
    }

    async function getResources(input: GetResourcesInput) {
        return (await handleFetch("getResources", input)) as GetResourcesReturn
    }

    async function renameFolder(input: RenameFolderInput) {
        return (await handleFetch("renameFolder", input)) as RenameFolderReturn
    }

    async function deleteFolder(input: DeleteFolderInput) {
        return (await handleFetch("deleteFolder", input)) as DeleteFolderReturn
    }

    async function createFolder(input: CreateFolderInput) {
        return (await handleFetch("createFolder", input)) as CreateFolderReturn
    }

    async function renameAsset(input: RenameAssetInput) {
        return (await handleFetch("renameAsset", input)) as RenameAssetReturn
    }

    async function deleteAsset(input: DeleteAssetInput) {
        return (await handleFetch("deleteAsset", input)) as DeleteAssetReturn
    }

    async function getUploadUrl(input: GetUploadUrlInput) {
        return (await handleFetch("getUploadUrl", input)) as GetUploadUrlReturn
    }

    return {
        getResources,
        renameFolder,
        deleteFolder,
        createFolder,
        renameAsset,
        deleteAsset,
        getUploadUrl,
    }
}
