import { ErrorCode, FilenestResponse, RouteReturnError } from "."

export class ClientAPICallerREST {
  private endpoint: string
  private onError?: (error: RouteReturnError) => void

  constructor(endpoint: string, onError?: (error: RouteReturnError) => void) {
    this.endpoint = endpoint
    this.onError = onError
  }

  async call<THandler extends (input: any) => Promise<FilenestResponse<any>>>(
    url: string,
    body: Parameters<THandler>[0],
    options: RequestInit = { method: "GET" }
  ): Promise<ReturnType<THandler>> {
    const baseUrl = this.endpoint + url
    const searchParams = new URLSearchParams()
    const bodyInput = options?.method === "POST" ? JSON.stringify(body) : undefined

    const getFetchUrl = () => {
      if (options?.method === "GET") {
        if (body) {
          for (const key of Object.keys(body)) {
            if (body[key]) searchParams.append(key, body[key] as string)
          }
          if (searchParams.entries().toArray().length > 0) {
            return baseUrl + "?" + searchParams.toString()
          }
        }
      }
      if (options?.method === "POST") {
        return baseUrl
      }
      return baseUrl
    }

    try {
      const response = await fetch(getFetchUrl(), {
        body: bodyInput,
        credentials: "include",
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
      const filenestError = new RouteReturnError(message, { error })
      this.onError?.(filenestError)
      return filenestError as ReturnType<THandler>
    }
  }
}

export class ClientAPICallerTRPC {
  private endpoint: string
  private onError?: (error: RouteReturnError) => void

  constructor(endpoint: string, onError?: (error: RouteReturnError) => void) {
    this.endpoint = endpoint
    this.onError = onError
  }

  async call<THandler extends (input: any) => Promise<FilenestResponse<any>>>(
    url: string,
    body: Parameters<THandler>[0],
    options: RequestInit = { method: "GET" }
  ): Promise<ReturnType<THandler>> {
    const baseUrl = this.endpoint + url
    const bodyInput = options?.method === "POST" ? JSON.stringify(body) : undefined

    const getFetchUrl = () => {
      if (options?.method === "GET") {
        const inputParamData: Record<string, any> = {}
        if (body) {
          for (const key of Object.keys(body)) {
            inputParamData[key] = body[key]
          }
        }
        return `${baseUrl}?input=${encodeURIComponent(JSON.stringify(inputParamData))}`
      }
      if (options?.method === "POST") {
        return baseUrl
      }
      return baseUrl
    }

    try {
      const response = await fetch(getFetchUrl(), {
        body: bodyInput,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        ...options,
      })

      const result = (await response.json()) as
        | {
            result: {
              data: Awaited<ReturnType<THandler>>
            }
          }
        | {
            error: {
              message: string
            }
          }

      // The TRPCError can only hold a custom message.
      // Message will be an ErrorCode and we return a "real" Filenest error.
      if ("error" in result) {
        return new RouteReturnError(result.error.message, {
          code: result.error.message as ErrorCode,
        }) as ReturnType<THandler>
      }

      return result.result.data
    } catch (error: any) {
      let message = "An unknown error occurred in the Filenest client fetcher"
      if ("message" in error) {
        message = `An error occurred in the Filenest client fetcher: ${error.message}`
      }
      const filenestError = new RouteReturnError(message, { error })
      this.onError?.(filenestError)
      return filenestError as ReturnType<THandler>
    }
  }
}
