import { initTRPC, type MiddlewareBuilder } from "@trpc/server"
import { z } from "zod"
import {
    CreateFolderInput,
    DeleteAssetInput,
    DeleteFolderInput,
    GetAssetInput,
    GetAssetsInput,
    RenameAssetInput,
    RenameFolderInput,
    type Provider,
} from ".."

const t = initTRPC.create()

const inputSchemas = {
    GetAssetInput,
    GetAssetsInput,
    DeleteAssetInput,
    RenameAssetInput,
    CreateFolderInput,
    DeleteFolderInput,
    RenameFolderInput,
} as const

type Middleware = MiddlewareBuilder<any, any>
type RouteMiddleware = Record<keyof Provider, Middleware[]>

class ProcedureWithMiddleware {
    inputSchema: z.ZodType<unknown> = z.object({}).optional()
    provider: any
    middlewares: Middleware[]

    constructor(middlewares: Middleware[]) {
        this.middlewares = middlewares
    }

    public input(schema: z.ZodType<any>) {
        this.inputSchema = schema
        return this
    }

    public query(action: Provider[keyof Provider]) {
        const procedure = this.middlewares.reduce((procWithMw, mw) => {
            return procWithMw.use(mw)
        }, t.procedure)

        return procedure
            .input(this.inputSchema)
            .query(async ({ input }) => await action(input as any))
    }
}

class FilenestTRPCRouter {
    private middleware: Middleware[] = []
    private routeMiddleware: Partial<RouteMiddleware> = {}
    private provider: Provider

    constructor(provider: Provider) {
        this.provider = provider
    }

    public use(globalMiddleware: Middleware[], routeMiddleware?: Partial<RouteMiddleware>) {
        this.middleware.push(...globalMiddleware)
        this.routeMiddleware = { ...this.routeMiddleware, ...routeMiddleware }
        return this
    }

    public create() {
        const router = t.router

        const routes = Object.fromEntries(
            Object.keys(this.provider).map((k) => {
                const key = k as keyof Provider
                const schemaName = (key.charAt(0).toUpperCase() + key.slice(1) + "Input") as keyof typeof inputSchemas
                const mw = this.routeMiddleware[key] || []
                const proc = new ProcedureWithMiddleware(mw)
                    .input(inputSchemas[schemaName])
                    .query(this.provider[key])
                return [key, proc]
            })
        )

        return router(routes)
    }
}

/**
 * Initializes and returns a FilenestTRPCRouter instance
 * 
 * @example
 * const provider = new Cloudinary({ ... });
 * 
 * const mediaRouter = initTRPCAdapter(provider).create();
 * 
 * const appRouter = t.router({
 *   media: mediaRouter,
 * });
 * 
 * export type AppRouter = typeof appRouter;
 */
export function initTRPCAdapter(provider: Provider) {
    return new FilenestTRPCRouter(provider)
}