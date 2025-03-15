import { FilenestResponse, RouteReturnError } from "."

export class ClientAPICallerREST {
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
                ...options,
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

export class ClientAPICallerTRPC {
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
        
        const finalUrl = () => {
            if (options?.method === "GET") {
                const inputParamData: Record<string, any> = {}
                for (const key of Object.keys(body)) {
                    inputParamData[key] = body[key]
                }
                return `${fetchUrl}?input=${encodeURIComponent(JSON.stringify(inputParamData))}`
            }
            if (options?.method === "POST") {
                return fetchUrl
            }
            return fetchUrl
        }

        try {
            const response = await fetch(finalUrl(), {
                body: bodyInput,
                credentials: "same-origin",
                ...options,
            })

            const { result } = (await response.json()) as {
                result: {
                    data: Awaited<ReturnType<THandler>>
                }
            }

            return result.data
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
