"use client"

import type { Asset as AssetType } from "@filenest/core"
import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/global/GlobalContext"
import { AssetProvider, useAssetContext, type AssetProviderProps } from "../context/local/AssetContext"
import type { WithoutChildren } from "../utils/types"

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

interface RenderProps {
    isLoading: boolean
    isSelected: boolean
}

export interface AssetProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asset: AssetType
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const Asset = ({ asset, asChild, children, ...props }: AssetProps) => {
    const { setDetailedAsset, setSelectedFiles, updateAsset } = useGlobalContext()
    const { isLoading, isSelected } = useAssetContext()

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

    function onClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.ctrlKey || e.metaKey) {
            toggleSelected()
            return
        }
        // TODO: handle shift key
        setDetailedAsset(asset)
    }

    const getChildren = () => {
        if (typeof children === "function") {
            return children({ isLoading, isSelected })
        }

        return children
    }

    return (
        <Comp {...props} onClick={onClick}>
            {getChildren()}
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
