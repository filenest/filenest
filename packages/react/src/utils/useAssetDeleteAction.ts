"use client"

import { useGlobalContext } from "../context/global/GlobalContext"

export const useAssetDeleteAction = (assetId: string, useSelection = false) => {

    const { alertDialog, updateAsset, fetchers, detailedAsset, setDetailedAsset, removeAssetFromCurrDir } = useGlobalContext()

    function updateLoadingState(value: boolean, dontUpdateDetailedAsset?: boolean) {
        updateAsset(assetId, () => ({ isLoading: value }))
        if (detailedAsset?.assetId === assetId && !dontUpdateDetailedAsset) {
            setDetailedAsset({ ...detailedAsset, isLoading: value })
        }
    }

    const { deleteAsset } = fetchers

    async function deleteActually() {
        try {
            updateLoadingState(true)
            const result = await deleteAsset({ id: assetId })
            if (result.success) {
                removeAssetFromCurrDir(assetId)
                if (detailedAsset?.assetId == assetId) {
                    setDetailedAsset(null)
                }
            } else {
                throw new Error(result.message)
            }
        } catch (error) {
            console.error("[Filenest] Error deleting asset:", error)
        }
        updateLoadingState(false, true)
    }

    const fileWord = useSelection ? "files" : "file"

    async function initDeleteAsset() {
        alertDialog.setContent({
            title: "Are you sure?",
            text: `Your ${fileWord} will be gone forever.`,
            commit: `Delete ${fileWord}`,
            cancel: `Keep ${fileWord}`,
        })
        alertDialog.setAction(() => deleteActually)
        alertDialog.setOpen(true)
    }

    return {
        initDeleteAsset,
    }
}