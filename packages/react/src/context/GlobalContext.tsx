"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"
import type { Folder, FolderWithResources, GetResourcesByFolderReturn } from "@filenest/handlers"
import type { RenderMode, SetState } from "../utils/types"
import { getResourcesByFolder } from "../utils/fetchers"

export interface GlobalContext {
    currentFolder: Folder
    endpoint: string
    navigation: Folder[]
    navigateTo: (folder: Folder) => void
    renderMode: RenderMode
    resources?: FolderWithResources | undefined
    setResources: SetState<FolderWithResources | undefined>
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

    const [navigation, setNavigation] = useState<Folder[]>([{ id: "home", path: "", name: "Home" }])

    function navigateTo(folder: Folder) {
        if (folder.path === currentFolder.path) return
        setCurrentFolder(folder)
        setNavigation((curr) => {
            const index = curr.findIndex((f) => f.path === folder.path)
            return index === -1 ? [...curr, folder] : curr.slice(0, index + 1)
        })
    }

    const resourcesQuery = useQuery({
        queryKey: ["folderWithResources", currentFolder],
        queryFn: () => getResourcesByFolder({ endpoint, folder: currentFolder.path }),
    })

    const [data, setData] = useState<FolderWithResources>()

    useEffect(() => {
        if (resourcesQuery.data) {
            setData({
                ...resourcesQuery.data,
                resources: {
                    ...resourcesQuery.data.resources,
                    folders: {
                        ...resourcesQuery.data.resources.folders,
                        data: resourcesQuery.data.resources.folders.data.map((f) => ({
                            ...f,
                            // This is a bit fucked up. We need a way to define some initial state for folders.
                            // When creating a new folder it should initially have the isRenaming state,
                            // so that an input is shown to let you enter a folder name.
                            // See `FolderListContext.tsx`
                            isLoading: false,
                            isRenaming: false,
                        })),
                    },
                },
            })
        }
    }, [resourcesQuery.data])

    const contextValue = {
        currentFolder,
        endpoint,
        navigation,
        navigateTo,
        renderMode,
        resources: data,
        setResources: setData,
        resourcesQuery,
        uploadMultiple: uploadMultiple || false,
        dialogTrigger,
    }

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}
