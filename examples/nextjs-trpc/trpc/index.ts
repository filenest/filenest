import { initTRPC } from "@trpc/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { initTRPCAdapter } from "@filenest/adapter-trpc"
import { UploadThing } from "@filenest/provider-uploadthing"

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
const provider = new UploadThing({
  UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN!,
})

const filenestRouter = initTRPCAdapter(provider).create()

export const trpcRouter = t.router({
  filenest: filenestRouter,
})

export type AppRouter = typeof trpcRouter
