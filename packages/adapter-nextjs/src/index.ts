import { FilenestHandlers, type Provider } from "@filenest/core"
import { MakeAdapterClientConfig } from "@filenest/core/adapter"
import { ClientAPICaller, getHandlersFromProvider } from "@filenest/core/utils"
import { NextRequest, NextResponse } from "next/server"

type Middleware = (req: NextRequest) => void | NextResponse | Promise<void | NextResponse>

class FilenestNextjsHandler {
    private provider: Provider
    private middleware?: Middleware

    constructor(provider: Provider) {
        this.provider = provider
    }

    private handleRequest = async (
        req: NextRequest,
        { params }: { params: Promise<{ handler: string[] }> }
    ) => {
        if (this.middleware) {
            const result = await this.middleware(req)
            if (result instanceof NextResponse && !result.ok) {
                return result
            }
        }

        const routeParams = await params
        const handlers = getHandlersFromProvider(this.provider)
        const handlerName = routeParams.handler[0] as keyof typeof handlers
        const handlerAction = routeParams.handler[1] as keyof {
            [k in keyof typeof handlers as keyof (typeof handlers)[k]]: string
        }
        const requestParams = req.nextUrl.searchParams

        if (!handlerName) {
            return NextResponse.json(
                [
                    "Missing handler name.",
                    "Your API route should end with one of the following:",
                    Object.keys(handlers).join(", "),
                ].join(" "),
                { status: 400 }
            )
        }

        if (!this.provider[handlerName]) {
            return NextResponse.json(
                [
                    `Invalid handler name "${handlerName}".`,
                    "It should be one of the following:",
                    Object.keys(handlers).join(", "),
                ].join(" "),
                { status: 400 }
            )
        }

        const handler = this.provider[handlerName]

        if (!(handler as any)[handlerAction]) {
            return NextResponse.json(
                `Invalid request method "${handlerAction}" for handler name "${handlerName}".`,
                { status: 400 }
            )
        }

        // Prevents errors when there is no body
        let body
        try {
            body = await req.json()
        } catch (error) {
            body = {}
        }

        // Add query params to the body
        for (const [key, value] of requestParams.entries()) {
            body[key] = value
        }

        try {
            const result = await (handler as any)[handlerAction](body)
            return NextResponse.json(result)
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "An unknown error occurred"
            return NextResponse.json({ success: false, message }, { status: 500 })
        }
    }

    public use(middleware: Middleware) {
        this.middleware = middleware
        return this
    }

    public create() {
        return {
            GET: this.handleRequest,
            POST: this.handleRequest,
        }
    }
}

/**
 * Initializes and returns a FilenestNextjsHandler instance
 *
 * @example
 * // app/api/filenest/[...handler]/route.ts
 * const provider = new Provider({ ... });
 * export const { GET, POST } = initNextjsAdapter(provider).create();
 *
 * @example
 * // With middleware:
 * export const { GET, POST } = initNextjsAdapter(provider)
 *     .use((req) => {
 *        // You can do auth here. Execution will stop if you return an error.
 *        // return NextResponse.json("Unauthorized", { status: 401 });
 *
 *        // Execution will continue if you either return nothing
 *        // or a NextResponse with a status of 200-299.
 *     })
 *     .create();
 */
export function initNextjsAdapter(provider: Provider) {
    return new FilenestNextjsHandler(provider)
}

export const adapterConfig: MakeAdapterClientConfig = (options) => {
    const { providerSupports, endpoint, onError } = options

    const caller = new ClientAPICaller(endpoint, onError)

    const fetchers = {
        files: {
            async getFiles(input) {
                return await caller.call("/files/getFiles", input)
            },
            async deleteFiles(input) {
                return await caller.call("/files/deleteFiles", input)
            },
            async getUploadUrl(input) {
                return await caller.call("/files/getUploadUrl", input)
            },
            async getRequiredParams() {
                return await caller.call("/files/getRequiredParams", undefined)
            },
        },
        folders: {},
    }

    return {
        fetchers,
    }
}
