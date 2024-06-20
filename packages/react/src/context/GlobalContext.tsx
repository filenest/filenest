"use client"

import { useQuery, type UseQueryResult } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState } from "react"
import type { Folder, FolderWithResources, GetResourcesByFolderReturn } from "@filenest/handlers"
import type { RenderMode, SetState } from "../utils/types"
import { getResourcesByFolder } from "../utils/fetchers"
import { labels } from "../utils/labels"

export interface GlobalContext {
    currentFolder: Folder
    endpoint: string
    navigation: Folder[]
    navigateTo: (folder: Folder) => void
    renderMode: RenderMode
    resources?: FolderWithResources | undefined
    addFolderToCurrDir: (
        folder: Folder,
        initialState?: { isLoading?: boolean; isRenaming?: boolean },
        shouldSort?: boolean
    ) => void
    removeFolderFromCurrDir: (id: string, shouldSort?: boolean) => void
    resourcesQuery: UseQueryResult<GetResourcesByFolderReturn, Error>
    uploadMultiple: boolean
    dialogTrigger: React.ReactNode
    _l: (label: keyof typeof labels) => string
    alertDialogOpen: boolean
    setAlertDialogOpen: SetState<boolean>
    alertDialogContent: Partial<AlertDialogContent>
    setAlertDialogContent: (content: Partial<AlertDialogContent>) => void
    alertDialogAction: () => void
    setAlertDialogAction: SetState<() => void>
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
        labels?: Partial<typeof labels>
    }
}

export const GlobalProvider = ({ children, config }: GlobalProviderProps) => {
    const { endpoint, renderMode, uploadMultiple, dialogTrigger } = config

    const _labels = { ...labels, ...config.labels }
    function _l(label: keyof typeof labels): string {
        return _labels[label]
    }

    const DEFAULT_FOLDER = { id: "home", path: "", name: "Home" }
    const [currentFolder, setCurrentFolder] = useState<Folder>(DEFAULT_FOLDER)
    const [navigation, setNavigation] = useState<Folder[]>([DEFAULT_FOLDER])

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

    function addFolderToCurrDir(
        folder: Folder,
        initialState?: { isLoading?: boolean; isRenaming?: boolean },
        shouldSort?: boolean
    ) {
        setData((curr) => {
            if (!curr) return curr
            let folders = [...curr.resources.folders.data, { ...folder, ...initialState }]
            if (shouldSort) {
                folders = folders.sort((a, b) => a.name.localeCompare(b.name))
            }
            return {
                ...curr,
                resources: {
                    ...curr.resources,
                    folders: {
                        ...curr.resources.folders,
                        data: folders,
                    },
                },
            }
        })
    }

    function removeFolderFromCurrDir(id: string, shouldSort?: boolean) {
        setData((prev) => {
            if (!prev) return prev
            const currentFolders = prev.resources.folders.data
            let newFolders = currentFolders.filter((f) => f.id !== id)
            if (shouldSort) {
                newFolders = newFolders.sort((a, b) => a.name.localeCompare(b.name))
            }
            return {
                ...prev,
                resources: {
                    ...prev.resources,
                    folders: {
                        ...prev.resources.folders,
                        data: newFolders,
                    },
                },
            }
        })
    }

    const [alertDialogOpen, setAlertDialogOpen] = useState(false)
    const [alertDialogAction, setAlertDialogAction] = useState<() => void>(() => () => {})
    const [alertDialogContent, _setAlertDialogContent] = useState<Partial<AlertDialogContent>>({
        title: "",
        text: "",
        cancel: _l("alert.folderNestedContent.cancel"),
        commit: _l("alert.folderNestedContent.commit"),
    })
    function setAlertDialogContent(content: Partial<AlertDialogContent>) {
        _setAlertDialogContent((prev) => ({ ...prev, ...content }))
    }

    const contextValue = {
        currentFolder,
        endpoint,
        navigation,
        navigateTo,
        renderMode,
        resources: data,
        addFolderToCurrDir,
        removeFolderFromCurrDir,
        resourcesQuery,
        uploadMultiple: uploadMultiple || false,
        dialogTrigger,
        _l,
        alertDialogOpen,
        setAlertDialogOpen,
        alertDialogContent,
        setAlertDialogContent,
        alertDialogAction,
        setAlertDialogAction,
    }

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

type AlertDialogContent = { title: string; text: string, cancel: string, commit: string}