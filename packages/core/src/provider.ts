export interface ProviderClientConfig {
    supports: FeatureFlags
}

export interface FeatureFlags {
    files: {
        rename: boolean
    }
    folders: {
        list: boolean | "virtual"
        create: boolean
        delete: boolean
        rename: boolean
    }
}

export type MakeProviderClientConfig = () => ProviderClientConfig
