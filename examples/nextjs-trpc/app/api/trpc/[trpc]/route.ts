import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { initTRPC } from "@trpc/server"
import { initTRPCAdapter } from "@filenest/adapter-trpc"
import { Cloudinary } from "@filenest/provider-cloudinary"

const provider = new Cloudinary({
    API_KEY: process.env.CLOUDINARY_API_KEY!,
    API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
})

const mediaRouter = initTRPCAdapter(provider).create()

const t = initTRPC.create()

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


/* (property) media: BuiltRouter<{
    ctx: object;
    meta: object;
    errorShape: DefaultErrorShape;
    transformer: false;
}, {
    getResources: MutationProcedure<{
        input: void;
        output: string;
    }>;
}> */