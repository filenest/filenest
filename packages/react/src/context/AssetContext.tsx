"use client"

import type { Asset } from "@filenest/core"
import { createContext, useContext, useEffect, useState } from "react"
import { useGlobalContext } from "./GlobalContext"
import type { SetState } from "../utils/types"

export interface AssetContext {
    asset: Asset
    noRename?: boolean
    rename: () => void
    noRemove?: boolean
    remove: () => void
    noSelect?: boolean
    select: () => void
    isLoading: boolean
    isRenaming: boolean
    _internal: {
        _setNewName: SetState<string>
        _newName: string
        _resetRename: () => void
    }
}

export const AssetContext = createContext<AssetContext | null>(null)

export const useAssetContext = () => {
    const context = useContext(AssetContext)
    if (!context) {
        throw new Error("A Filenest.Asset* must be used within a Filenest.Asset component.")
    }
    return context
}

export interface AssetProviderProps {
    asset: Asset
    children: React.ReactNode
    noRename?: boolean
    noRemove?: boolean
    noSelect?: boolean
}

export const AssetProvider = ({ asset, children, noRemove, noRename, noSelect }: AssetProviderProps) => {
    const { alertDialog, updateAsset, removeAssetFromCurrDir, _l, fetchers, detailledAsset, setDetailledAsset } = useGlobalContext()

    const [assetName, setAssetName] = useState(asset.name)

    useEffect(() => {
        setAssetName(asset.name)
    }, [asset])

    const [isLoading, setIsLoading] = useState(false)

    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState("")

    function resetRename() {
        setNewName("")
        setIsRenaming(false)
    }

    function updateLoadingState(value: boolean, dontUpdateDetailledAsset?: boolean) {
        updateAsset(asset.assetId, { isLoading: value })
        if (detailledAsset?.assetId === asset.assetId && !dontUpdateDetailledAsset) {
            setDetailledAsset({ ...detailledAsset, isLoading: value })
        }
    }

    const { renameAsset, deleteAsset } = fetchers

    async function deleteActually() {
        try {
            updateLoadingState(true)
            const result = await deleteAsset({ id: asset.assetId })
            if (result.success) {
                removeAssetFromCurrDir(asset.assetId)
                if (detailledAsset?.assetId == asset.assetId) {
                    setDetailledAsset(null)
                }
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.error("[Filenest] Error deleting asset:", error)
        }
        updateLoadingState(false, true)
    }

    async function public_removeAsset() {
        alertDialog.setContent({
            title: "Are you sure?",
            text: "Your file will be gone forever.",
            commit: "Delete file",
            cancel: "Keep file",
        })
        alertDialog.setAction(() => deleteActually)
        alertDialog.setOpen(true)
    }

    async function public_renameAsset(updateDeliveryUrl?: boolean) {
        alertDialog.setCancel(undefined)
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
                updateDeliveryUrl,
            })
            if (result.success) {
                updateAsset(asset.assetId, { name: newName })
            } else {
                if (result.message === "ERR_DELIVERY_URL_WILL_CHANGE") {
                    alertDialog.setContent({
                        title: _l("alert.deliveryUrlChange.title"),
                        text: _l("alert.deliveryUrlChange.text"),
                        commit: _l("alert.deliveryUrlChange.commit"),
                        cancel: _l("alert.deliveryUrlChange.cancel"),
                    })
                    alertDialog.setAction(() => () => public_renameAsset(true))
                    alertDialog.setCancel(() => () => public_renameAsset(false))
                    alertDialog.setOpen(true)
                }
                if (result.message === "ERR_UPDATE_DELIVERY_URL_REQUIRED") {
                    alertDialog.setContent({
                        title: _l("alert.deliveryUrlRequired.title"),
                        text: _l("alert.deliveryUrlRequired.text"),
                        commit: _l("alert.deliveryUrlRequired.commit"),
                        cancel: _l("alert.deliveryUrlRequired.cancel"),
                    })
                    alertDialog.setAction(() => () => public_renameAsset(true))
                    alertDialog.setCancel(() => () => public_renameAsset(false))
                    alertDialog.setOpen(true)
                }
            }
        } catch (error) {
            console.error("[Filenest] Error renaming asset:", error)
        }

        setIsLoading(false)
    }

    function public_selectAsset() {
        alert("TODO: not implemented")
    }

    const _internal = {
        _newName: newName,
        _setNewName: setNewName,
        _resetRename: resetRename,
    }

    const contextValue = {
        noRename,
        rename: public_renameAsset,
        noRemove,
        remove: public_removeAsset,
        noSelect,
        select: public_selectAsset,
        asset: {
            ...asset,
            name: assetName,
        },
        isLoading,
        isRenaming,
        _internal,
    }

    return <AssetContext.Provider value={contextValue}>{children}</AssetContext.Provider>
}
