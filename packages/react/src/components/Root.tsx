"use client"

import React, { useState } from "react"
import { type FilenestClientConfig } from ".."
import { FilenestFile, FilenestFolder } from "@filenest/core"

interface GlobalContext {
    fetchers: ReturnType<FilenestClientConfig["adapterConfig"]>["fetchers"]
}

const GlobalContext = React.createContext<GlobalContext | null>(null)

export function useGlobalContext() {
    const context = React.useContext(GlobalContext)
    if (!context) {
        throw new Error(
            "This component uses useGlobalContext, but was not used within Filenest.Root"
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
    const { endpoint, adapterConfig, providerConfig } = config

    const [foldersInList, setFoldersInList] = useState<FilenestFolder[]>([])
    const [filesInList, setFilesInList] = useState<FilenestFile[]>([])

    const { supports } = providerConfig()
    const { fetchers } = adapterConfig({ endpoint, providerSupports: supports })

    const contextValue = {
        fetchers,
    }

    return (
        <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
    )
}
