"use client"

import type { Asset } from "@filenest/core"
import { useGlobalContext } from "../context/GlobalContext"
import type { AssetExtraProps } from "../utils/types"

interface RenderProps {
    asset: (Asset & AssetExtraProps) | null
}

interface AssetDetailsProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const AssetDetails = ({ children }: AssetDetailsProps) => {
    const { detailledAsset } = useGlobalContext()

    if (typeof children === "function") {
        return children({ asset: detailledAsset as any })
    }

    return children
}
