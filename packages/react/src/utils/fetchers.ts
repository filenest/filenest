import { GetResourcesByFolderInput, GetResourcesByFolderReturn } from "@filenest/handlers"

type WithEndpoint = {
    endpoint: string
}

async function handleFetch(endpoint: string, path: string, body?: any) {
    return fetch(endpoint + path, { method: "POST", body: JSON.stringify(body) }).then((res) => res.json())
}

export async function getResourcesByFolder({ endpoint, ...input }: GetResourcesByFolderInput & WithEndpoint) {
    return await handleFetch(endpoint, "/getResourcesByFolder", input) as GetResourcesByFolderReturn
}
