import { FilenestResponse, Provider, RouteReturnError } from "."

export function getHandlersFromProvider(provider: Provider) {
    return {
        files: provider.files,
        folders: provider.folders,
    }
}

export function getFileExtension(filename: string) {
    return filename.split(".").pop() as string
}

export class ClientAPICaller {
    private endpoint: string
    private onError?: (message: string) => void

    constructor(endpoint: string, onError?: (message: string) => void) {
        this.endpoint = endpoint
        this.onError = onError
    }

    async call<THandler extends (input: any) => Promise<FilenestResponse<any>>>(
        url: string,
        body: Parameters<THandler>[0],
        options?: RequestInit
    ): Promise<ReturnType<THandler>> {
        const fetchUrl = new URL(this.endpoint + url)
        const bodyInput = options?.method === "POST" ? JSON.stringify(body) : undefined
        if (options?.method === "GET") {
            for (const key of Object.keys(body)) {
                fetchUrl.searchParams.append(key, body[key] as string)
            }
        }

        try {
            const response = await fetch(fetchUrl, {
                body: bodyInput,
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
            })

            const result = (await response.json()) as Awaited<ReturnType<THandler>>

            return result
        } catch (error: any) {
            let message = "An unknown error occurred in the Filenest client fetcher"
            if ("message" in error) {
                message = `An error occurred in the Filenest client fetcher: ${error.message}`
            }
            this.onError?.(message)
            return new RouteReturnError(message, { error }) as ReturnType<THandler>
        }
    }
}
