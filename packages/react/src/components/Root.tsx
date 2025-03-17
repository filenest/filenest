"use client"

import React, { useState } from "react"
import { type FilenestClientConfig } from ".."
import { FilenestFolder } from "@filenest/core"
import { SetState } from "../utils/types"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { FilesProvider } from "../context/FilesContext"

const queryClient = new QueryClient()

interface GlobalContext {
    client: ReturnType<FilenestClientConfig["client"]>
    folders: {
        value: FilenestFolder[]
        set: SetState<FilenestFolder[]>
    }
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

    const [foldersInList, setFoldersInList] = useState<FilenestFolder[]>([])

    const filenestClient = client({ endpoint })

    const contextValue = {
        client: filenestClient,
        folders: {
            value: foldersInList,
            set: setFoldersInList,
        },
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GlobalContext.Provider value={contextValue}>
                <FilesProvider>{children}</FilesProvider>
            </GlobalContext.Provider>
        </QueryClientProvider>
    )
}
