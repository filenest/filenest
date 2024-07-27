"use client"

import { useGlobalContext } from "../context/global/GlobalContext"

export const useAssetDeleteAction = (assetIds: string[], caller?: "toolbar") => {
    const {
        alertDialog,
        updateAsset,
        fetchers,
        detailedAsset,
        setDetailedAsset,
        removeAssetFromCurrDir,
        setIsToolbarBusy,
        isToolbarBusy,
        setSelectedFiles
    } = useGlobalContext()

    function updateLoadingState(assetId: string, value: boolean, dontUpdateDetailedAsset?: boolean) {
        updateAsset(assetId, () => ({ isLoading: value }))
        if (detailedAsset?.assetId === assetId && !dontUpdateDetailedAsset) {
            setDetailedAsset({ ...detailedAsset, isLoading: value })
        }
    }

    const { deleteAsset } = fetchers

    async function deleteActually() {
        if (caller === "toolbar") {
            if (isToolbarBusy) return
            setIsToolbarBusy(true)
        }
        for (const assetId of assetIds) {
            try {
                updateLoadingState(assetId, true)
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
                console.error("[Filenest] Error deleting asset(s):", error)
            }
            updateLoadingState(assetId, false, true)
        }
        if (caller === "toolbar") {
            setIsToolbarBusy(false)
            setSelectedFiles([])
        }
    }

    const fileWord = assetIds.length > 1 ? "files" : "file"

    function initDeleteAsset() {
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
