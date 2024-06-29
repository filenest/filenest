"use client"

import { useContext, useEffect, useRef } from "react"
import { useGlobalContext } from "../context/GlobalContext"
import { FolderContext } from "../context/FolderContext"
import { AssetContext } from "../context/AssetContext"
import { useClickOutside } from "./useClickOutside"
import { useMergedRef } from "./useMergedRef"
import type { SetState } from "./types"

export const useResourceName = () => {
    const { removeFolderFromCurrDir } = useGlobalContext()
    const folderCtx = useContext(FolderContext)
    const assetCtx = useContext(AssetContext)

    let contextType: "folder" | "asset"
    let _name: string = ""
    let _newName: string = ""
    let _setNewName: SetState<string>
    let _isLoading: boolean = false
    let _isRenaming: boolean = false
    let _resetRename: () => void

    if (folderCtx && !assetCtx) {
        contextType = "folder"
        _name = folderCtx.folder.name
        _newName = folderCtx._internal._newName
        _setNewName = folderCtx._internal._setNewName
        _isLoading = folderCtx.isLoading
        _isRenaming = folderCtx.isRenaming
        _resetRename = folderCtx._internal._resetRename
    } else if (assetCtx && !folderCtx) {
        contextType = "asset"
        _name = assetCtx.asset.name
    } else {
        throw new Error("Filenest.ResourceName must be used within a Filenest.Folder or Filenest.Asset component")
    }

    const isTemporary = folderCtx?.folder.id.includes("__filenest-temporary")
    const isValidName = _newName.trim().length >= 1

    const inputRef = useRef<HTMLInputElement>(null)
    const clickOutsideRef = useClickOutside(() => {
        if (_isRenaming && isValidName) {
            if (contextType === "folder") {
                if (isTemporary) {
                    folderCtx!.create()
                } else {
                    folderCtx!.rename()
                }
            }
        } else {
            _resetRename()
            removeIfTemporary()
        }
    })

    function removeIfTemporary() {
        if (isTemporary  && contextType === "folder") {
            removeFolderFromCurrDir(folderCtx!.folder.id)
        }
    }

    const ref = useMergedRef(inputRef, clickOutsideRef)

    useEffect(() => {
        if (_isRenaming && inputRef.current) {
            inputRef.current.focus()
        }
    }, [_isRenaming])

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
        } else if (e.key === "Escape") {
            _resetRename()
            removeIfTemporary()
        }
    }

    return {
        ref,
        name: _name,
        newName: _newName,
        setNewName: _setNewName!,
        isLoading: _isLoading,
        isRenaming: _isRenaming,
        handleKeyDown
    }
}