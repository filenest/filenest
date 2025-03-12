import { Provider } from "@filenest/core";

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
    return
}
