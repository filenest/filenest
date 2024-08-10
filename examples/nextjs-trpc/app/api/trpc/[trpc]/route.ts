import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { initTRPC } from "@trpc/server"
import { initTRPCAdapter } from "@filenest/adapter-trpc"
import { Cloudinary } from "@filenest/provider-cloudinary"

const provider = new Cloudinary({
    API_KEY: process.env.CLOUDINARY_API_KEY!,
    API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
})

const t = initTRPC.create()

const helloMiddleware = t.middleware(({ ctx, next }) => {
    console.log("hello from middleware. this runs on each request")
    return next()
})

const folderMiddleware = t.middleware(({ ctx, next }) => {
    console.log("this middleware runs when a folder is created")
    return next()
})

const mediaRouter = initTRPCAdapter(provider)
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
    })
export { handler as GET, handler as POST }
