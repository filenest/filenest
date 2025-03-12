import { getHandlersFromProvider } from "./utils"

export interface AdapterClientConfig {
    fetchers: ReturnType<typeof getHandlersFromProvider>
}

export type MakeAdapterClientConfig = (endpoint: string) => AdapterClientConfig
