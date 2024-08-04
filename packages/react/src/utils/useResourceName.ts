"use client"

import { useContext, useEffect, useRef } from "react"
import { useGlobalContext } from "../context/global/GlobalContext"
import { FolderContext } from "../context/local/FolderContext"
import { AssetContext } from "../context/local/AssetContext"
import { useClickOutside } from "./useClickOutside"
import { useMergedRef } from "./useMergedRef"
import type { SetState } from "./types"

export const useResourceName = () => {
    const { removeFolderFromCurrDir } = useGlobalContext()
    const folderCtx = useContext(FolderContext)
    const assetCtx = useContext(AssetContext)

    let contextType: "folder" | "asset"

    let name: string
    let newName: string
    let isRenaming: boolean
    let isTemporary: boolean
    let isLoading: boolean
    let setNewName: SetState<string>
    let resetRename: () => void

    if (folderCtx && !assetCtx) {
        contextType = "folder"
        name = folderCtx.folder.name
        newName = folderCtx._internal._newName
        setNewName = folderCtx._internal._setNewName
        isLoading = folderCtx.isLoading
        isRenaming = folderCtx.isRenaming
        resetRename = folderCtx._internal._resetRename
        isTemporary = folderCtx.folder.id.includes("__filenest-temporary")
    } else if (assetCtx && !folderCtx) {
        contextType = "asset"
        name = assetCtx.asset.name
        newName = assetCtx._internal._newName
        setNewName = assetCtx._internal._setNewName
        isLoading = assetCtx.isLoading
        isRenaming = assetCtx.isRenaming
        resetRename = assetCtx._internal._resetRename
        isTemporary = false
    } else {
        throw new Error("Filenest.ResourceName must be used within a Filenest.Folder or Filenest.Asset component")
    }

    const isValidName = newName.trim().length >= 1

    const inputRef = useRef<HTMLInputElement>(null)
    const clickOutsideRef = useClickOutside(() => {
        if (isRenaming && isValidName && newName !== name) {
            if (contextType === "folder") {
                if (isTemporary) {
                    folderCtx!.create()
                } else {
                    folderCtx!.rename()
                }
            }
            if (contextType === "asset") {
                assetCtx!.rename()
            }
        } else {
            resetRename()
            removeIfTemporary()
        }
    })

    function removeIfTemporary() {
        if (isTemporary && contextType === "folder") {
            removeFolderFromCurrDir(folderCtx!.folder.id)
        }
    }

    const ref = useMergedRef(inputRef, clickOutsideRef)

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isRenaming])

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            if (!isValidName) return
            if (contextType === "folder") {
                if (isTemporary) {
                    folderCtx!.create()
                } else {
                    folderCtx!.rename()
                }
            }
            if (contextType === "asset") {
                assetCtx!.rename()
            }
        } else if (e.key === "Escape") {
            resetRename()
            removeIfTemporary()
        }
    }

    return {
        ref,
        name,
        newName,
        setNewName,
        isRenaming,
        isLoading,
        resetRename,
        handleKeyDown
    }
}