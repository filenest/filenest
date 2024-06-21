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
    isLoadingNextPage: boolean
}

interface AssetListProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const AssetList = ({ children }: AssetListProps) => {
    const { assets, isLoading, isLoadingNextPage } = useAssetListContext()

    if (typeof children === "function") {
        return children({ assets, isLoading, isLoadingNextPage })
    }

    return children
}

export { AssetListWrapper as AssetList }