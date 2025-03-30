import { MakeAdapterClient } from "@filenest/core/adapter"
//import { MakeProviderClientConfig } from "@filenest/core/provider"
import { FilenestRoot } from "./components/Root"
import { FileList } from "./components/FileList"
import { LoadMore } from "./components/LoadMore"
import { Selection } from "./components/Selection"
import { Search } from "./components/Search"
import { Uploader } from "./components/Uploader"
import { Queue } from "./components/Queue"
import { FolderList } from "./components/FolderList"
import { Breadcrumbs } from "./components/Breadcrumbs/Breadcrumbs"

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
    Breadcrumbs,
    FolderList,
    FileList,
    LoadMore,
    Selection,
    Search,
    Uploader,
    Queue,
  }
}
