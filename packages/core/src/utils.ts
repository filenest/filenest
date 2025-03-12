import { Provider } from "."

export function getHandlersFromProvider(provider: Provider) {
    return {
        files: provider.files,
        folders: provider.folders,
    }
}
