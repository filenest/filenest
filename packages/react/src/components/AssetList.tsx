"use client"

import { Slot } from "@radix-ui/react-slot"
import { AssetListProvider, useAssetListContext } from "../context/local/AssetListContext"
import type { WithoutChildren } from "../utils/types"

const AssetListWrapper = (props: AssetListProps) => {
    return (
        <AssetListProvider>
            <AssetList {...props}/>
        </AssetListProvider>
    )
}

interface RenderProps {
    assets?: ReturnType<typeof useAssetListContext>["assets"]
    isLoading: boolean
    isLoadingMore: boolean
}

export interface AssetListProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    asChild?: boolean
}

const AssetList = ({ children, asChild, ...props }: AssetListProps) => {
    const { assets, isLoading, isLoadingMore } = useAssetListContext()

    const Comp = asChild ? Slot : "div"

    function getChildren() {
        if (typeof children === "function") {
            return children({ assets, isLoading, isLoadingMore })
        }

        return children
    }

    return <Comp {...props}>{getChildren()}</Comp>
}

export { AssetListWrapper as AssetList }