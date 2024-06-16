"use client"

import type { Folder } from "@filenest/handlers"
import { createContext, useContext, useState } from "react"
import { useGlobalContext } from "./GlobalContext"
import { renameFolder } from "../utils/fetchers"

export interface FolderInternals {
    actions: {
        delete: () => void
        rename: () => void
        navigateTo: () => void
    }
    state: {
        isRenaming: boolean
        isLoading: boolean
    }
    _internal: {
        _setNewName: (name: string) => void
        _newName: string
        _setIsRenaming: (isRenaming: boolean) => void
        _setFolderName: (name: string) => void
        _resetRename: () => void
    }
}

export interface FolderContext extends FolderInternals {
    folder: Folder
}

const FolderContext = createContext<FolderContext | null>(null)

export const useFolderContext = () => {
    const context = useContext(FolderContext)
    if (!context) {
        throw new Error("A Filenest.Folder* must be used within a Filenest.Folder component.")
    }
    return context
}

interface FolderProviderProps {
    children: React.ReactNode
    folder: Folder
}

export const FolderProvider = ({ children, folder }: FolderProviderProps) => {
    const { navigateTo, endpoint, setResources } = useGlobalContext()

    const [folderName, setFolderName] = useState(folder.name)

    const [isLoading, setIsLoading] = useState(false)

    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState("")

    function resetRename() {
        setNewName("")
        setIsRenaming(false)
    }

    const actions = {
        async delete() {},

        async rename() {
            if (newName.length < 1) {
                setIsRenaming(true)
                setNewName(folderName)
                return
            }

            setFolderName(newName)
            resetRename()

            try {
                setIsLoading(true)
                const result = await renameFolder({
                    endpoint,
                    path: folder.path,
                    newPath: folder.path.replace(folder.name, newName),
                })

                setResources((prev) => {
                    if (!prev) return prev
                    const currentFolders = prev?.resources.folders.data
                    const newFolders = [...currentFolders, result]
                        .filter((f) => f.id !== folder.id)
                        .sort((a, b) => a.name.localeCompare(b.name))
                    
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
            } catch (error) {
                console.error("[Filenest] Error renaming folder:", error)
            }
            setIsLoading(false)
        },

        navigateTo: () => navigateTo(folder),
    }

    const state = {
        isRenaming,
        isLoading,
    }

    const _internal = {
        _newName: newName,
        _setNewName: setNewName,
        _setIsRenaming: setIsRenaming,
        _setFolderName: setFolderName,
        _resetRename: resetRename,
    }

    const contextValue = {
        actions,
        folder: {
            ...folder,
            name: folderName,
        },
        state,
        _internal,
    }

    return <FolderContext.Provider value={contextValue}>{children}</FolderContext.Provider>
}
