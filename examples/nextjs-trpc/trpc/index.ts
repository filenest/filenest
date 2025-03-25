import { initTRPC } from "@trpc/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { initTRPCAdapter } from "@filenest/adapter-trpc"
import { Cloudinary } from "@filenest/provider-cloudinary"

// Your usual TRPC setup
export const createContext = ({ req, resHeaders }: FetchCreateContextFnOptions) => {
  return {
    req,
    resHeaders,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

export const t = initTRPC.context<Context>().create()

// Add Filenest router
const provider = new Cloudinary({
  CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
  API_KEY: process.env.CLOUDINARY_API_KEY!,
  API_SECRET: process.env.CLOUDINARY_API_SECRET!,
})

const filenestRouter = initTRPCAdapter(provider).create()

export const trpcRouter = t.router({
  filenest: filenestRouter,
})

export type AppRouter = typeof trpcRouter
