"use client"

import { createContext, useContext } from "react"
import { useGlobalContext } from "./GlobalContext"
import type { Asset } from "@filenest/handlers"
import type { AssetExtraProps } from "../utils/types"

export interface AssetListContext {
    assets?: Array<Asset & AssetExtraProps>
    isLoading: boolean
    isLoadingMore: boolean
}

const AssetListContext = createContext<AssetListContext | null>(null)

export const useAssetListContext = () => {
    const context = useContext(AssetListContext)
    if (!context) {
        throw new Error("A Filenest.Asset* must be used within a Filenest.AssetList component.")
    }
    return context
}

interface AssetListProviderProps {
    children: React.ReactNode
}

export const AssetListProvider = ({ children }: AssetListProviderProps) => {
    const { resources, resourcesQuery } = useGlobalContext()

    const assets: any = resources?.resources.assets.data
    const isLoading = resourcesQuery.isLoading
    const isLoadingMore = resourcesQuery.isFetchingNextPage

    const contextValue = {
        assets,
        isLoading,
        isLoadingMore,
    }

    return <AssetListContext.Provider value={contextValue}>{children}</AssetListContext.Provider>
}
