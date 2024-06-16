"use client"

import type { Folder } from "@filenest/handlers"
import { createContext, useContext, useState } from "react"
import { useGlobalContext } from "./GlobalContext"

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
    const { navigateTo } = useGlobalContext()

    const [folderName, setFolderName] = useState(folder.name)

    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState("")

    const actions = {
        async delete() {},
        async rename() {
            if (newName.length < 1) {
                setIsRenaming(true)
                setNewName(folderName)
                return
            }
            setFolderName(newName)
            setNewName("")
            setIsRenaming(false)
        },
        navigateTo: () => navigateTo(folder),
    }

    const state = {
        isRenaming,
        isLoading: false,
    }

    const _internal = {
        _newName: newName,
        _setNewName: setNewName,
        _setIsRenaming: setIsRenaming,
        _setFolderName: setFolderName,
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
