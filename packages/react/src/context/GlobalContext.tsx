"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { createContext, useContext, useState } from "react"
import type { Folder, GetResourcesByFolderReturn } from "@filenest/handlers"
import type { RenderMode } from "../utils/types"
import { getResourcesByFolder } from "../utils/fetchers"

export interface GlobalContext {
    currentFolder: Folder
    endpoint: string
    navigateTo: (folder: Folder) => void
    renderMode: RenderMode
    resources?: GetResourcesByFolderReturn | undefined
    resourcesQuery: UseQueryResult<GetResourcesByFolderReturn, Error>
    uploadMultiple: boolean
    dialogTrigger: React.ReactNode
}

const GlobalContext = createContext<GlobalContext | null>(null)

export const useGlobalContext = () => {
    const context = useContext(GlobalContext)
    if (!context) {
        throw new Error("A Filenest component must be used within a Filenest.Root component.")
    }
    return context
}

interface GlobalProviderProps {
    children: React.ReactNode
    config: {
        endpoint: string
        renderMode: RenderMode
        uploadMultiple?: boolean
        dialogTrigger?: React.ReactNode
    }
}

export const GlobalProvider = ({ children, config }: GlobalProviderProps) => {
    const { endpoint, renderMode, uploadMultiple, dialogTrigger } = config

    const [currentFolder, setCurrentFolder] = useState<Folder>({ id: "home", path: "", name: "Home" })

    function navigateTo(folder: Folder) {
        setCurrentFolder(folder)
    }

    const resourcesQuery = useQuery({
        queryKey: ["folderWithResources", currentFolder],
        queryFn: () => getResourcesByFolder({ endpoint, folder: currentFolder.path }),
    })

    const contextValue = {
        currentFolder,
        endpoint,
        navigateTo,
        renderMode,
        resources: resourcesQuery.data,
        resourcesQuery,
        uploadMultiple: uploadMultiple || false,
        dialogTrigger,
    }

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}
