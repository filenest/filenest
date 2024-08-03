"use client"

import type { Asset } from "@filenest/core"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { useGlobalContext } from "../global/GlobalContext"
import type { AssetExtraProps, SetState } from "../../utils/types"
import { useAssetDeleteAction } from "../../utils/useAssetDeleteAction"

export interface AssetContext {
    asset: Asset
    noRename?: boolean
    noRemove?: boolean
    noSelect?: boolean
    rename: () => void
    remove: () => void
    select: () => void
    isLoading: boolean
    isRenaming: boolean
    isSelected: boolean
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
        throw new Error("useAssetContext must be used within a Filenest.Asset component.")
    }
    return context
}

export interface AssetProviderProps {
    asset: Asset & AssetExtraProps
    children: React.ReactNode
    noRename?: boolean
    noRemove?: boolean
    noSelect?: boolean
}

export const AssetProvider = ({ asset, children, noRemove, noRename, noSelect }: AssetProviderProps) => {
    const { alertDialog, updateAsset, _l, fetchers, onAssetSelect, selectedFiles } = useGlobalContext()

    const [assetName, setAssetName] = useState(asset.name)

    useEffect(() => {
        setAssetName(asset.name)

        if (asset.isLoading !== isLoading) {
            setIsLoading(asset.isLoading)
        }
    }, [asset])

    const [isLoading, setIsLoading] = useState(asset.isLoading)
    const isSelected = useMemo(() => selectedFiles.some((a) => a.assetId === asset.assetId), [selectedFiles, asset])
    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState("")

    function resetRename() {
        setNewName("")
        setIsRenaming(false)
    }

    async function renameAsset(updateDeliveryUrl?: boolean) {
        alertDialog.setCancel(undefined)
        if (newName.length < 1) {
            setIsRenaming(true)
            setNewName(assetName)
            return
        }

        setAssetName(newName)
        resetRename()

        try {
            updateAsset(asset.assetId, (curr) => ({ ...curr, isLoading: true }))
            const result = await fetchers.renameAsset({
                id: asset.assetId,
                name: newName,
                updateDeliveryUrl,
            })
            if (result.success) {
                updateAsset(asset.assetId, (curr) => ({ ...curr, name: newName, isLoading: false }))
            } else {
                if (result.message === "ERR_DELIVERY_URL_WILL_CHANGE") {
                    alertDialog.setContent({
                        title: _l("alert.deliveryUrlChange.title"),
                        text: _l("alert.deliveryUrlChange.text"),
                        commit: _l("alert.deliveryUrlChange.commit"),
                        cancel: _l("alert.deliveryUrlChange.cancel"),
                    })
                    alertDialog.setAction(() => () => renameAsset(true))
                    alertDialog.setCancel(() => () => renameAsset(false))
                    alertDialog.setOpen(true)
                }
                if (result.message === "ERR_UPDATE_DELIVERY_URL_REQUIRED") {
                    alertDialog.setContent({
                        title: _l("alert.deliveryUrlRequired.title"),
                        text: _l("alert.deliveryUrlRequired.text"),
                        commit: _l("alert.deliveryUrlRequired.commit"),
                        cancel: _l("alert.deliveryUrlRequired.cancel"),
                    })
                    alertDialog.setAction(() => () => renameAsset(true))
                    alertDialog.setCancel(() => () => renameAsset(false))
                    alertDialog.setOpen(true)
                }
            }
        } catch (error) {
            console.error("[Filenest] Error renaming asset:", error)
        }

        updateAsset(asset.assetId, (curr) => ({ ...curr, isLoading: false }))
    }

    function selectAsset() {
        onAssetSelect?.(asset)
    }

    const { initDeleteAsset } = useAssetDeleteAction([asset.assetId])

    const _internal = {
        _newName: newName,
        _setNewName: setNewName,
        _resetRename: resetRename,
    }

    const contextValue = {
        noRename,
        noRemove,
        noSelect: !onAssetSelect || noSelect,
        rename: renameAsset,
        remove: initDeleteAsset,
        select: selectAsset,
        isSelected,
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
