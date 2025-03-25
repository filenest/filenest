import { AnyRouteReturn, FilenestResponse, Provider } from "@filenest/core"
import { initTRPC, TRPCError } from "@trpc/server"
import {
  MiddlewareBuilder,
  ProcedureBuilder,
  unsetMarker,
} from "@trpc/server/unstable-core-do-not-import"
import z from "zod"

type Middleware = MiddlewareBuilder<object, object, object, unknown>
type Procedure = ProcedureBuilder<
  object,
  object,
  object,
  typeof unsetMarker,
  typeof unsetMarker,
  typeof unsetMarker,
  typeof unsetMarker,
  false
>

const t = initTRPC.create()

class FilenestTRPCRouter {
  private provider: Provider
  private middleware: Middleware = t.middleware(({ next }) => next())
  private proc: Procedure = t.procedure

  constructor(provider: Provider) {
    this.provider = provider
  }

  public procedure(procedure: Procedure) {
    this.proc = procedure
    return this
  }

  public use(middleware: Middleware) {
    this.middleware = middleware
    return this
  }

  create() {
    return t.router({
      files: t.router({
        getFiles: this.proc
          .use(this.middleware)
          .input(
            z
              .object({
                prefix: z.string().optional(),
                delimiter: z.string().optional(),
                query: z.string().optional(),
                limit: z.number().optional(),
                skip: z.number().nullish(),
                cursor: z.union([z.string(), z.number()]).nullish(),
              })
              .optional()
          )
          .query(async ({ input }) => {
            const result = await this.provider.files.getFiles(input)
            return returnOrThrow(result)
          }),
        getUploadUrl: this.proc
          .use(this.middleware)
          .input(
            z.object({
              file: z
                .object({
                  name: z.string(),
                  size: z.number(),
                })
                .optional(),
              folder: z.string().optional(),
            })
          )
          .mutation(async ({ input }) => {
            const result = await this.provider.files.getUploadUrl(input)
            return returnOrThrow(result)
          }),
        updateFile: this.proc
          .use(this.middleware)
          .input(z.any())
          .mutation(async ({ input }) => {
            const result = await this.provider.files.updateFile(input)
            return returnOrThrow(result)
          }),
        deleteFiles: this.proc
          .use(this.middleware)
          .input(
            z.object({
              ids: z.array(z.string()).optional(),
              prefix: z.string().optional(),
            })
          )
          .mutation(async ({ input }) => {
            const result = await this.provider.files.deleteFiles(input)
            return returnOrThrow(result)
          }),
      }),
      folders: t.router({
        getFolders: this.proc
          .use(this.middleware)
          .input(
            z.object({
              path: z.string(),
            })
          )
          .query(async ({ input }) => {
            const result = await this.provider.folders.getFolders(input)
            return returnOrThrow(result)
          }),
        createFolder: this.proc
          .use(this.middleware)
          .input(
            z.object({
              key: z.string(),
              path: z.string(),
              displayName: z.string().optional(),
            })
          )
          .mutation(async ({ input }) => {
            const result = await this.provider.folders.createFolder(input)
            return returnOrThrow(result)
          }),
        updateFolder: this.proc
          .use(this.middleware)
          .input(
            z.object({
              path: z.string(),
              newPath: z.string().optional(),
              displayName: z.string().optional(),
            })
          )
          .mutation(async ({ input }) => {
            const result = await this.provider.folders.updateFolder(input)
            return returnOrThrow(result)
          }),
        deleteFolder: this.proc
          .use(this.middleware)
          .input(
            z.object({
              path: z.string(),
              ignoreNotEmpty: z.boolean().optional(),
            })
          )
          .mutation(async ({ input }) => {
            const result = await this.provider.folders.deleteFolder(input)
            return returnOrThrow(result)
          }),
      }),
    })
  }
}

function returnOrThrow(result: FilenestResponse<AnyRouteReturn>) {
  if ("error" in result) {
    switch (result.code) {
      case "FILENEST_ERR_BAD_REQUEST":
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.message,
          cause: result.error,
        })
      case "FILENEST_ERR_FETCH":
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.message,
          cause: result.error,
        })
      default:
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: result.message,
          cause: result.error,
        })
    }
  }
  return result
}

/**
 * Initializes and returns a FilenestTRPCRouter instance
 *
 * @example
 * const provider = new Provider({ ... });
 *
 * const filenestRouter = initTRPCAdapter(provider).create();
 *
 * const appRouter = t.router({
 *   filenest: filenestRouter,
 * });
 *
 * export type AppRouter = typeof appRouter;
 */
export function initTRPCAdapter(provider: Provider) {
  return new FilenestTRPCRouter(provider)
}
