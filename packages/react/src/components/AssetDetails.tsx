"use client"

import type { Asset } from "@filenest/handlers"
import { useGlobalContext } from "../context/GlobalContext"

interface RenderProps {
    asset: Asset | null
}

interface AssetDetailsProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const AssetDetails = ({ children }: AssetDetailsProps) => {
    const { detailledAsset } = useGlobalContext()

    if (typeof children === "function") {
        return children({ asset: detailledAsset })
    }

    return children
}