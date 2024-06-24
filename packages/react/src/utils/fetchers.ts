import {
    CreateFolderInput,
    CreateFolderReturn,
    DeleteFolderInput,
    DeleteFolderReturn,
    GetResourcesByFolderInput,
    GetResourcesByFolderReturn,
    RenameFolderInput,
    RenameFolderReturn,
} from "@filenest/handlers"

type CreateFetchersOpts = {
    endpoint: string
    trpcMode: boolean
}

export function createFetchers({ endpoint, trpcMode }: CreateFetchersOpts) {

    function makeUrl(endpoint: string, path: string, trpcMode: boolean) {
        if (trpcMode) {
            return endpoint + "." + path
        }
        return endpoint + "/" + path
    }

    async function handleFetch(path: string, body?: any) {
        const url = makeUrl(endpoint, path, trpcMode)
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

    return {
        getResourcesByFolder,
        renameFolder,
        deleteFolder,
        createFolder,
    }
}
