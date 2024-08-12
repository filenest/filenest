import { initTRPC, type MiddlewareBuilder } from "@trpc/server"
import { z } from "zod"
import {
    CreateFolderInput,
    DeleteAssetInput,
    DeleteFolderInput,
    GetResourcesInput,
    GetUploadUrlInput,
    RenameAssetInput,
    RenameFolderInput,
    type Provider,
} from "@filenest/core"

const t = initTRPC.create()

const inputSchemas = {
    CreateFolderInput,
    DeleteAssetInput,
    DeleteFolderInput,
    GetResourcesInput,
    GetUploadUrlInput,
    RenameAssetInput,
    RenameFolderInput,
} as const

type Middleware = MiddlewareBuilder<any, any>
type RouteMiddleware = Record<keyof Provider, Middleware[]>

class ProcedureWithMiddleware {
    inputSchema: z.ZodType<unknown> = z.object({}).optional()
    middlewares: Middleware[]

    constructor(middlewares: Middleware[] = []) {
        this.middlewares = middlewares
    }

    public input(schema: z.ZodType<any>) {
        this.inputSchema = schema
        return this
    }

    public execute(action: Provider[keyof Provider]) {
        const procedure = this.middlewares.reduce((procWithMw, mw) => {
            return procWithMw.use(mw)
        }, t.procedure)

        return procedure.input(this.inputSchema).mutation(async ({ input }) => await action(input as any))
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
        const methodNames = Object.keys(this.provider).filter((name) => !name.startsWith("_"))

        const routes = Object.fromEntries(
            methodNames.map((k) => {
                const key = k as keyof Provider
                const schemaName = ((key as string).charAt(0).toUpperCase() + (key as string).slice(1) + "Input") as keyof typeof inputSchemas
                const mw = [...this.middleware, ...(this.routeMiddleware[key] || [])]
                const proc = new ProcedureWithMiddleware(mw).input(inputSchemas[schemaName]).execute(this.provider[key])
                return [key, proc]
            })
        ) as Record<string, any> // TODO: Improve type safety. Just putting this here to remove errors

        return t.router(routes)
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
