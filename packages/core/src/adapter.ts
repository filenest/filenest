import { FeatureFlags } from "./provider"
import { getHandlersFromProvider } from "./utils"

export interface AdapterClientConfig {
    fetchers: ReturnType<typeof getHandlersFromProvider>
}

interface AdapterConfigOptions {
    endpoint: string
    providerSupports: FeatureFlags
    onError?: (message: string) => void
}

export type MakeAdapterClientConfig = (
    options: AdapterConfigOptions
) => AdapterClientConfig
