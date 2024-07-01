"use client"

import { createContext, useContext } from "react"
import { useGlobalContext } from "./GlobalContext"
import type { Asset } from "@filenest/core"
import type { AssetExtraProps } from "../utils/types"
import { useDropzone } from "react-dropzone"

export interface AssetListContext {
    assets?: Array<Asset & AssetExtraProps>
    isLoading: boolean
    isLoadingMore: boolean
    dropzone: ReturnType<typeof useDropzone>
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
    const { resources, resourcesQuery, uploadMultiple } = useGlobalContext()

    const assets: any = resources?.resources.assets.data
    const isLoading = resourcesQuery.isLoading
    const isLoadingMore = resourcesQuery.isFetchingNextPage
    
    const dropzone = useDropzone({
        maxSize: 2.5e+8, // 250 MB
        multiple: uploadMultiple,
        noClick: true,
        onDrop(acceptedFiles) {
            // upload
        },
    })

    const contextValue = {
        assets,
        isLoading,
        isLoadingMore,
        dropzone
    }

    return <AssetListContext.Provider value={contextValue}>{children}</AssetListContext.Provider>
}
