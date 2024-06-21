"use client"

import { createContext, useContext } from "react"
import { useGlobalContext } from "./GlobalContext"
import type { Asset } from "@filenest/handlers"

export interface AssetListContext {
    assets?: Asset[]
    isLoading: boolean
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

    const assets = resources?.resources.assets.data
    const isLoading = resourcesQuery.isFetching

    const contextValue = {
        assets,
        isLoading,
    }

    return <AssetListContext.Provider value={contextValue}>{children}</AssetListContext.Provider>
}
