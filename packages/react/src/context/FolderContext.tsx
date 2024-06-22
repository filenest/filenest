"use client"

import type { Folder } from "@filenest/handlers"
import { createContext, useContext, useState } from "react"
import { useGlobalContext } from "./GlobalContext"
import { createFolder, deleteFolder, renameFolder } from "../utils/fetchers"
import type { SetState } from "../utils/types"

export interface FolderInternals {
    remove: () => void
    rename: () => void
    navigateTo: () => void
    isRenaming: boolean
    isLoading: boolean
    _internal: {
        _setNewName: SetState<string>
        _newName: string
        _resetRename: () => void
    }
}

export interface FolderContext extends FolderInternals {
    folder: Folder
    create: () => void
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
    const {
        navigateTo,
        endpoint,
        removeFolderFromCurrDir,
        addFolderToCurrDir,
        currentFolder,
        setAlertDialogContent,
        setAlertDialogOpen,
        setAlertDialogAction,
        _l
    } = useGlobalContext()
    const _folder = folder as Folder & { isRenaming?: boolean; isLoading?: boolean }

    const [folderName, setFolderName] = useState(folder.name)

    const [isLoading, setIsLoading] = useState(_folder.isLoading || false)

    const [isRenaming, setIsRenaming] = useState(_folder.isRenaming || false)
    const [newName, setNewName] = useState("")

    function resetRename() {
        setNewName("")
        setIsRenaming(false)
    }

    async function public_removeFolder(force?: boolean) {
        try {
            setIsLoading(true)
            const result = await deleteFolder({ endpoint, path: folder.path, force })
            if (result.success) {
                removeFolderFromCurrDir(folder.id)
            } else {
                if (result.message === "ERR_FOLDER_NOT_EMPTY") {
                    setAlertDialogContent({
                        title: _l("alert.folderNestedContent.title"),
                        text: _l("alert.folderNestedContent.text"),
                    })
                    setAlertDialogAction(() => () => public_removeFolder(true))
                    setAlertDialogOpen(true)
                }
            }
        } catch (error) {
            console.error("[Filenest] Error deleting folder:", error)
        }
        setIsLoading(false)
    }

    async function public_renameFolder() {
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

            removeFolderFromCurrDir(folder.id)
            addFolderToCurrDir(result, {}, true)
        } catch (error) {
            console.error("[Filenest] Error renaming folder:", error)
        }

        setIsLoading(false)
    }

    const public_navigateToFolder = () => navigateTo(folder)

    async function create() {
        if (newName.trim().length < 1) return
        setIsLoading(true)
        try {
            const newFolder = await createFolder({
                endpoint,
                path: currentFolder.path + "/" + newName,
            })
            removeFolderFromCurrDir(folder.id)
            addFolderToCurrDir(newFolder, {}, true)
        } catch (error) {
            console.error("[Filenest] Error creating folder:", error)
        }
        setIsLoading(false)
    }

    const _internal = {
        _newName: newName,
        _setNewName: setNewName,
        _resetRename: resetRename,
    }

    const contextValue = {
        navigateTo: public_navigateToFolder,
        remove: public_removeFolder,
        rename: public_renameFolder,
        create,
        folder: {
            ...folder,
            name: folderName,
        },
        isRenaming,
        isLoading,
        _internal,
    }

    return <FolderContext.Provider value={contextValue}>{children}</FolderContext.Provider>
}
