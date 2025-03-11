import { type Provider, getHandlersFromProvider } from "@filenest/core"
import { NextRequest, NextResponse } from "next/server"

type Middleware = (req: NextRequest) => void | NextResponse | Promise<void | NextResponse>

class FilenestNextjsHandler {
    private provider: Provider
    private middleware?: Middleware

    constructor(provider: Provider) {
        this.provider = provider
    }

    private handleRequest = async (req: NextRequest) => {
        if (this.middleware) {
            const result = await this.middleware(req)
            if (result instanceof NextResponse && !result.ok) {
                return result
            }
        }

        const { pathname } = new URL(req.url)
        const handlers = getHandlersFromProvider(this.provider)
        const handlerName = pathname.split("/").at(-1) as keyof typeof handlers
        const requestMethod = req.method as unknown as keyof {
            [k in keyof typeof handlers as keyof (typeof handlers)[k]]: string
        }

        if (!handlerName) {
            return new NextResponse(
                [
                    "Missing handler name.",
                    "Your API route should end with one of the following:",
                    Object.keys(handlers).join(", "),
                ].join(" "),
                { status: 400 }
            )
        }

        if (!this.provider[handlerName]) {
            return new NextResponse(
                [
                    `Invalid handler name "${handlerName}".`,
                    "It should be one of the following:",
                    Object.keys(handlers).join(", "),
                ].join(" "),
                { status: 400 }
            )
        }

        const handler = this.provider[handlerName]

        if (!(handler as any)[requestMethod]) {
            return new NextResponse(
                `Invalid request method "${requestMethod}" for handler name "${handlerName}".`,
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

        try {
            const result = await (handler as any)[requestMethod](body)
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
            PUT: this.handleRequest,
            DELETE: this.handleRequest,
        }
    }
}

/**
 * Initializes and returns a FilenestNextjsHandler instance
 *
 * @example
 * // app/api/filenest/[handler]/route.ts
 * const provider = new Provider({ ... });
 * export const { GET, POST, PUT, DELETE } = initNextjsAdapter(provider).create();
 *
 * @example
 * // With middleware:
 * export const { GET, POST, PUT, DELETE } = initNextjsAdapter(provider)
 *     .use((req) => {
 *        // You can do auth here. Execution will stop if you return an error.
 *        // return new NextResponse("Unauthorized", { status: 401 });
 *
 *        // Execution will continue if you either return nothing
 *        // or a NextResponse with a status of 200-299.
 *     })
 *     .create();
 */
export function initNextjsAdapter(provider: Provider) {
    return new FilenestNextjsHandler(provider)
}
