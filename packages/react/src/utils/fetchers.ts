import {
    CreateFolderInput,
    CreateFolderReturn,
    DeleteAssetInput,
    DeleteAssetReturn,
    DeleteFolderInput,
    DeleteFolderReturn,
    GetResourcesByFolderInput,
    GetResourcesByFolderReturn,
    RenameAssetInput,
    RenameAssetReturn,
    RenameFolderInput,
    RenameFolderReturn,
} from "@filenest/core"

type CreateFetchersOpts = {
    endpoint: string
    endpointIsTRPC: boolean
}

export function createFetchers({ endpoint, endpointIsTRPC }: CreateFetchersOpts) {
    function makeUrl(endpoint: string, path: string, endpointIsTRPC: boolean) {
        if (endpointIsTRPC) {
            return endpoint + "." + path
        }
        return endpoint.replace(/\/+$/, "") + "/" + path
    }

    async function handleFetch(path: string, body?: any) {
        const url = makeUrl(endpoint, path, endpointIsTRPC)
        return fetch(url, { method: "POST", body: JSON.stringify(body) }).then((res) => res.json())
    }

    async function getResourcesByFolder(input: GetResourcesByFolderInput) {
        return (await handleFetch("getResourcesByFolder", input)) as GetResourcesByFolderReturn
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

    return {
        getResourcesByFolder,
        renameFolder,
        deleteFolder,
        createFolder,
        renameAsset,
        deleteAsset,
    }
}
