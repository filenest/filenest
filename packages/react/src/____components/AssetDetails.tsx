"use client"

import type { Asset } from "@filenest/core"
import { useGlobalContext } from "../____context/global/GlobalContext"
import type { AssetExtraProps, WithoutChildren } from "../____utils/types"
import { Slot } from "@radix-ui/react-slot"

interface RenderProps {
    asset: (Asset & AssetExtraProps) | null
}

export interface AssetDetailsProps
    extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const AssetDetails = ({ asChild, children, ...props }: AssetDetailsProps) => {
    const { detailedAsset } = useGlobalContext()

    const Comp = asChild ? Slot : "div"

    function getChildren() {
        if (typeof children === "function") {
            return children({ asset: detailedAsset })
        }

        return children
    }

    return <Comp {...props}>{getChildren()}</Comp>
}
