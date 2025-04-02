"use client"

import React, { useState } from "react"
import { FilenestFile } from "@filenest/core"
import { OnUserInteractionRequired, FilenestClientConfig } from ".."
import { FilesProvider } from "../context/FilesContext"
import { UploadProvider } from "../context/UploadContext"
import { SetterGetter } from "../utils/types"
import { useDebouncedState } from "../utils/hooks"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FoldersProvider } from "../context/FoldersContext"

const queryClient = new QueryClient()

interface GlobalContext {
  client: ReturnType<FilenestClientConfig["client"]>
  selectedFiles: SetterGetter<FilenestFile[]>
  search: SetterGetter<string>
  currentPath: SetterGetter<string>
  onUserInteractionRequired?: OnUserInteractionRequired
}

const GlobalContext = React.createContext<GlobalContext | null>(null)

export function useGlobalContext() {
  const context = React.useContext(GlobalContext)
  if (!context) {
    throw new Error(
      "One of your components uses useGlobalContext, but was not used within Filenest.Root"
    )
  }
  return context
}

export const FilenestRoot = ({
  children,
  config,
}: {
  children: React.ReactNode
  config: FilenestClientConfig
}) => {
  const { endpoint, client, onUserInteractionRequired } = config

  const [selectedFiles, setSelectedFiles] = useState<FilenestFile[]>([])
  const [search, setSearch] = useDebouncedState("", 500)
  const [currentPath, setCurrentPath] = useState("")

  const filenestClient = client({ endpoint })

  const contextValue = {
    client: filenestClient,
    selectedFiles: { value: selectedFiles, set: setSelectedFiles },
    search: { value: search, set: setSearch },
    currentPath: { value: currentPath, set: setCurrentPath },
    onUserInteractionRequired,
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={contextValue}>
        <FilesProvider>
          <FoldersProvider>
            <UploadProvider>{children}</UploadProvider>
          </FoldersProvider>
        </FilesProvider>
      </GlobalContext.Provider>
    </QueryClientProvider>
  )
}
