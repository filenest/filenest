"use client"

import { AssetListProvider, useAssetListContext } from "../context/AssetListContext"

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

interface AssetListProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const AssetList = ({ children }: AssetListProps) => {
    const { assets, isLoading, isLoadingMore } = useAssetListContext()

    if (typeof children === "function") {
        return children({ assets, isLoading, isLoadingMore })
    }

    return children
}

export { AssetListWrapper as AssetList }