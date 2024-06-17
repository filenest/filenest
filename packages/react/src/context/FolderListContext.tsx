"use client"

import { createContext, useContext } from "react"
import { useGlobalContext } from "./GlobalContext"

export interface FolderListContext {
    createFolder: () => void
}

const FolderListContext = createContext<FolderListContext | null>(null)

export const useFolderListContext = () => {
    const context = useContext(FolderListContext)
    if (!context) {
        throw new Error("A Filenest.Folder* must be used within a Filenest.FolderList component.")
    }
    return context
}

interface FolderListProviderProps {
    children: React.ReactNode
}

export const FolderListProvider = ({ children }: FolderListProviderProps) => {
    const { setResources } = useGlobalContext()

    const contextValue = {
        createFolder: () => {
            setResources((curr) => {
                if (!curr) return curr
                const folders = curr?.resources.folders.data.filter((f) => !f.id.includes("__filenest-temporary")) || []
                const newFolder = {
                    id: `__filenest-temporary-${Date.now()}`,
                    name: "",
                    path: "",
                    // This is a bit fucked up. We need a way to define some initial state for folders.
                    // When creating a new folder it should initially have the isRenaming state,
                    // so that an input is shown to let you enter a folder name.
                    // See `GlobalContext.tsx`
                    isRenaming: true,
                    isLoading: false,
                }
                return {
                    ...curr,
                    resources: {
                        ...curr.resources,
                        folders: {
                            ...curr.resources.folders,
                            data: [...folders, newFolder],
                        },
                    },
                }
            })
        },
    }

    return <FolderListContext.Provider value={contextValue}>{children}</FolderListContext.Provider>
}
