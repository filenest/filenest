import { MakeAdapterClientConfig } from "@filenest/core/adapter"
import { MakeProviderClientConfig } from "@filenest/core/provider"
import { FilenestRoot } from "./components/Root"

export interface FilenestClientConfig {
    endpoint: string
    adapterConfig: MakeAdapterClientConfig
    providerConfig: MakeProviderClientConfig
}

export function createFilenestComponents(config: FilenestClientConfig) {
    return {
        Root: ({ children }: { children: React.ReactNode }) => (
            <FilenestRoot config={config} children={children} />
        ),
    }
}
