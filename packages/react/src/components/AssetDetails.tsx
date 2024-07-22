"use client"

import type { Asset } from "@filenest/core"
import { useGlobalContext } from "../context/global/GlobalContext"
import type { AssetExtraProps } from "../utils/types"

interface RenderProps {
    asset: (Asset & AssetExtraProps) | null
}

export interface AssetDetailsProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const AssetDetails = ({ children }: AssetDetailsProps) => {
    const { detailedAsset } = useGlobalContext()

    if (typeof children === "function") {
        return children({ asset: detailedAsset as any })
    }

    return children
}
