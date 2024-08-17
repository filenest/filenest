import { FetchCreateContextFnOptions, fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { initTRPC } from "@trpc/server"
import { initTRPCAdapter } from "@filenest/adapter-trpc"
import { Cloudinary } from "@filenest/provider-cloudinary"

const provider = new Cloudinary({
    API_KEY: process.env.CLOUDINARY_API_KEY!,
    API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
})

const createContext = ({ req }: FetchCreateContextFnOptions) => ({ req })
export type Context = Awaited<ReturnType<typeof createContext>>

const t = initTRPC.context<Context>().create()

const helloMiddleware = t.middleware(({ ctx, next }) => {
    console.log("hello from middleware. this runs on each request")
    return next()
})

const folderMiddleware = t.middleware(({ ctx, next }) => {
    console.log("this middleware runs when a folder is created")
    return next()
})

const adminProcedure = t.procedure.use(t.middleware(({ ctx, next }) => {
    console.log("in most cases, your filenest media routes should be protected by authentication")
    return next()
}))

const mediaRouter = initTRPCAdapter(provider)
    .procedure(adminProcedure)
    .use(
        [helloMiddleware],
        {
            createFolder: [folderMiddleware],
        }
    )
    .create()

const trpcRouter = t.router({
    media: mediaRouter,
})

const handler = (req: Request) =>
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req,
        router: trpcRouter,
        createContext
    })
export { handler as GET, handler as POST }
