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

type WithEndpoint = {
    endpoint: string
}

async function handleFetch(endpoint: string, path: string, body?: any) {
    return fetch(endpoint + path, { method: "POST", body: JSON.stringify(body) }).then((res) => res.json())
}

export async function getResourcesByFolder({ endpoint, ...input }: GetResourcesByFolderInput & WithEndpoint) {
    return (await handleFetch(endpoint, "/getResourcesByFolder", input)) as GetResourcesByFolderReturn
}

export async function renameFolder({ endpoint, ...input }: RenameFolderInput & WithEndpoint) {
    return (await handleFetch(endpoint, "/renameFolder", input)) as RenameFolderReturn
}

export async function deleteFolder({ endpoint, ...input }: DeleteFolderInput & WithEndpoint) {
    return (await handleFetch(endpoint, "/deleteFolder", input)) as DeleteFolderReturn
}

export async function createFolder({ endpoint, ...input }: CreateFolderInput & WithEndpoint) {
    return (await handleFetch(endpoint, "/createFolder", input)) as CreateFolderReturn
}
