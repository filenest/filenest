"use client"

import type { Asset as AssetType } from "@filenest/core"
import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"
import { AssetProvider, useAssetContext } from "../context/AssetContext"
import type { WithoutChildren } from "../utils/types"

const AssetWrapper = ({ asset, ...props }: AssetProps) => {
    return (
        <AssetProvider asset={asset}>
            <Asset asset={asset} {...props} />
        </AssetProvider>
    )
}

interface RenderProps {
    isLoading: boolean
}

export interface AssetProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asset: AssetType
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const Asset = ({ asset, asChild, children, ...props }: AssetProps) => {
    const { setDetailledAsset } = useGlobalContext()
    const { isLoading } = useAssetContext()

    const Comp = asChild ? Slot : "div"

    function onClick() {
        setDetailledAsset(asset)
    }

    const getChildren = () => {
        if (typeof children === "function") {
            return children({ isLoading })
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
    const { remove, rename, select } = useAssetContext()

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

    const Comp = asChild ? Slot : "button"

    return <Comp {...props} onClick={onClick} />
}
