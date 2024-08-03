"use client"

import type { Asset as AssetType } from "@filenest/core"
import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/global/GlobalContext"
import { AssetProvider, useAssetContext, type AssetProviderProps } from "../context/local/AssetContext"

const AssetWrapper = ({ asset, noRemove, noRename, noSelect, ...props }: AssetProps & AssetProviderProps) => {
    const assetConfig = {
        asset,
        noRemove,
        noRename,
        noSelect,
    }

    return (
        <AssetProvider {...assetConfig}>
            <Asset asset={asset} {...props} />
        </AssetProvider>
    )
}

export interface AssetProps extends React.ComponentPropsWithoutRef<"div"> {
    asset: AssetType
    asChild?: boolean
}

const Asset = ({ asset, asChild, children, ...props }: AssetProps) => {
    const { setDetailedAsset, selectedFiles, setSelectedFiles, updateAsset, resources } = useGlobalContext()

    const Comp = asChild ? Slot : "div"

    function toggleSelected() {
        updateAsset(asset.assetId, (curr) => ({ isSelected: !curr.isSelected }))
        setSelectedFiles((curr) => {
            if (curr.some((a) => a.assetId === asset.assetId)) {
                return curr.filter((a) => a.assetId !== asset.assetId)
            }
            return [...curr, asset]
        })
    }

    function clearSelected() {
        setSelectedFiles(curr => {
            curr.forEach(file => {
                updateAsset(file.assetId, () => ({ isSelected: false }))
            })
            return []
        })
    }

    function onClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.ctrlKey || e.metaKey) {
            toggleSelected()
            return
        } else if (e.shiftKey) {
            toggleSelected()
            const firstSelectedFile = selectedFiles.at(0)
            if (!firstSelectedFile || !resources) return
            const data = resources.resources.assets.data
            const firstSelectedIndex = data.findIndex((a) => a.assetId === firstSelectedFile.assetId)
            const newlySelectedIndex = data.findIndex((a) => a.assetId === asset.assetId)
            const min = Math.min(firstSelectedIndex, newlySelectedIndex)
            const max = Math.max(firstSelectedIndex, newlySelectedIndex)
            const assetsToSelect = data.slice(min, max + 1)

            clearSelected()
            setSelectedFiles(curr => {
                const selected = assetsToSelect.map(file => {
                    updateAsset(file.assetId, () => ({ isSelected: true }))
                    return file
                })
                return [...curr, ...selected]
            })
            return
        }

        setDetailedAsset(asset)
        clearSelected()
    }

    return (
        <Comp {...props} onClick={onClick}>
            {children}
        </Comp>
    )
}

export { AssetWrapper as Asset }

export interface AssetActionTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
    action: "remove" | "rename" | "select"
    asChild?: boolean
}

export const AssetActionTrigger = ({ action, asChild, ...props }: AssetActionTriggerProps) => {
    const { remove, rename, select, noRemove, noRename, noSelect, isLoading, isRenaming } = useAssetContext()

    function shouldRender() {
        switch (action) {
            case "remove":
                return !noRemove
            case "rename":
                return !noRename
            case "select":
                return !noSelect
        }
    }

    if (!shouldRender()) return null

    const actions = {
        remove,
        rename,
        select,
    }

    function onClick(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        actions[action]()
    }

    const disabled = isLoading || isRenaming

    const Comp = asChild ? Slot : "button"

    return <Comp {...props} onClick={onClick} disabled={disabled} />
}
