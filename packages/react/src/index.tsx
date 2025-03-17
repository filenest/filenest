import { MakeAdapterClient } from "@filenest/core/adapter"
//import { MakeProviderClientConfig } from "@filenest/core/provider"
import { FilenestRoot } from "./components/Root"
import { FileList } from "./components/FileList"
import { LoadMore } from "./components/LoadMore"

export interface FilenestClientConfig {
  endpoint: string
  client: MakeAdapterClient
  //providerConfig: MakeProviderClientConfig
}

export function createFilenestComponents(config: FilenestClientConfig) {
  return {
    Root: ({ children }: { children: React.ReactNode }) => (
      <FilenestRoot config={config} children={children} />
    ),
    FileList,
    LoadMore,
  }
}
