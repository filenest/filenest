import {
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

    return {
        getResources,
        renameFolder,
        deleteFolder,
        createFolder,
        renameAsset,
        deleteAsset,
    }
}
