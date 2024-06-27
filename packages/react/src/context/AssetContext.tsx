"use client"

import type { Asset } from "@filenest/handlers"
import { createContext, useContext, useState } from "react"
import { useGlobalContext } from "./GlobalContext"
import { createFetchers } from "../utils/fetchers"

export interface AssetContext {
    asset: Asset
    rename: () => void
    remove: () => void
    select: () => void
    isLoading: boolean
}

const AssetContext = createContext<AssetContext | null>(null)

export const useAssetContext = () => {
    const context = useContext(AssetContext)
    if (!context) {
        throw new Error("A Filenest.Asset* must be used within a Filenest.Asset component.")
    }
    return context
}

interface AssetProviderProps {
    asset: Asset
    children: React.ReactNode
}

export const AssetProvider = ({ asset, children }: AssetProviderProps) => {
    const { endpoint, trpcMode, alertDialog, updateAsset, removeAssetFromCurrDir } = useGlobalContext()

    const [assetName, setAssetName] = useState(asset.name)

    const [isLoading, setIsLoading] = useState(false)

    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState("")

    function resetRename() {
        setNewName("")
        setIsRenaming(false)
    }

    const { renameAsset, deleteAsset } = createFetchers({
        endpoint,
        trpcMode,
    })

    async function deleteActually() {
        try {
            setIsLoading(true)
            const result = await deleteAsset({ id: asset.assetId })
            if (result.success) {
                removeAssetFromCurrDir(asset.assetId)
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.error("[Filenest] Error deleting asset:", error)
        }
        setIsLoading(false)
    }

    async function public_removeAsset() {
        alertDialog.setContent({
            title: "Are you sure?",
            text: "Your file will be gone forever.",
            commit: "Delete file",
            cancel: "Keep file"
        })
        alertDialog.setAction(() => deleteActually)
        alertDialog.setOpen(true)
    }

    async function public_renameAsset() {
        if (newName.length < 1) {
            setIsRenaming(true)
            setNewName(assetName)
            return
        }

        setAssetName(newName)
        resetRename()

        try {
            setIsLoading(true)
            const result = await renameAsset({
                id: asset.assetId,
                name: newName,
            })
            if (result.success) {
                updateAsset(asset.assetId, { name: newName })
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.error("[Filenest] Error renaming asset:", error)
        }

        setIsLoading(false)
    }

    function public_selectAsset() {
        alert("TODO: not implemented")
    }

    const contextValue = {
        rename: public_renameAsset,
        remove: public_removeAsset,
        select: public_selectAsset,
        isLoading,
        asset,
    }

    return <AssetContext.Provider value={contextValue}>{children}</AssetContext.Provider>
}
