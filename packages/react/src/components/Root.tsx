"use client"

import React, { useState } from "react"
import { type FilenestClientConfig } from ".."
import { FileBase, FolderBase } from "@filenest/core"

interface GlobalContext {}

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
    const [foldersInList, setFoldersInList] = useState<FolderBase[]>([])
    const [filesInList, setFilesInList] = useState<FileBase[]>([])

    const contextValue = {}

    return (
        <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
    )
}
