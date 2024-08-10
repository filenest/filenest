"use client"

import type { Folder } from "@filenest/core"
import { createContext, useContext, useState } from "react"
import { useGlobalContext } from "../global/GlobalContext"
import type { SetState } from "../../utils/types"

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

export const FolderContext = createContext<FolderContext | null>(null)

export const useFolderContext = () => {
    const context = useContext(FolderContext)
    if (!context) {
        throw new Error("useFolderContext must be used within a Filenest.Folder component.")
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
        removeFolderFromCurrDir,
        addFolderToCurrDir,
        currentFolder,
        alertDialog,
        _l,
        fetchers,
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

    async function removeFolder(force?: boolean) {
        try {
            setIsLoading(true)
            const result = await fetchers.deleteFolder({ path: folder.path, force })
            if (result.success) {
                removeFolderFromCurrDir(folder.id)
            } else {
                if (result.message === "ERR_FOLDER_NOT_EMPTY") {
                    alertDialog.setContent({
                        title: _l("alert.folderNestedContent.title"),
                        text: _l("alert.folderNestedContent.text"),
                        cancel: _l("alert.folderNestedContent.cancel"),
                        commit: _l("alert.folderNestedContent.commit"),
                    })
                    alertDialog.setAction(() => () => removeFolder(true))
                    alertDialog.setOpen(true)
                }
            }
        } catch (error) {
            console.error("[Filenest] Error deleting folder:", error)
        }
        setIsLoading(false)
    }

    async function renameFolder() {
        if (newName.length < 1) {
            setIsRenaming(true)
            setNewName(folderName)
            return
        }

        setFolderName(newName)
        resetRename()

        try {
            setIsLoading(true)
            const result = await fetchers.renameFolder({
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

    async function createFolder() {
        if (newName.trim().length < 1) return
        setIsLoading(true)
        try {
            const newFolder = await fetchers.createFolder({
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
        navigateTo: () => navigateTo(folder),
        remove: removeFolder,
        rename: renameFolder,
        create: createFolder,
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
