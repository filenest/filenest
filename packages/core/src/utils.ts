import { FilenestResponse, Provider } from "."

export function getHandlersFromProvider(provider: Provider) {
    return {
        files: provider.files,
        folders: provider.folders,
    }
}

export function getFileExtension(filename: string) {
    return filename.split(".").pop() as string
}
