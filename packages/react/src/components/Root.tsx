"use client"

import React, { useState } from "react"
import { type FilenestClientConfig } from ".."
import { FilenestFile } from "@filenest/core"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilesProvider } from "../context/FilesContext"
import { SetterGetter } from "../utils/types"
import { useDebouncedState } from "../utils/hooks"

const queryClient = new QueryClient()

interface GlobalContext {
  client: ReturnType<FilenestClientConfig["client"]>
  selectedFiles: SetterGetter<FilenestFile[]>
  search: SetterGetter<string>
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
  const { endpoint, client } = config

  const [selectedFiles, setSelectedFiles] = useState<FilenestFile[]>([])
  const [search, setSearch] = useDebouncedState("", 500)

  const filenestClient = client({ endpoint })

  const contextValue = {
    client: filenestClient,
    selectedFiles: { value: selectedFiles, set: setSelectedFiles },
    search: { value: search, set: setSearch },
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContext.Provider value={contextValue}>
        <FilesProvider>{children}</FilesProvider>
      </GlobalContext.Provider>
    </QueryClientProvider>
  )
}
