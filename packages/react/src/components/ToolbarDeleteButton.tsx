"use client"

import { Slot } from "@radix-ui/react-slot"
import { useAssetDeleteAction } from "../utils/useAssetDeleteAction"
import { useGlobalContext } from "../context/global/GlobalContext"

export interface ToolbarDeleteButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
}

export const ToolbarDeleteButton = ({ asChild, ...props }: ToolbarDeleteButtonProps) => {

    const { selectedFiles, isToolbarBusy } = useGlobalContext()

    const Comp = asChild ? Slot : "button"

    const assetIds = selectedFiles.map((a) => a.assetId)

    const { initDeleteAsset } = useAssetDeleteAction(assetIds, "toolbar")

    return (
        <Comp {...props} onClick={initDeleteAsset} disabled={isToolbarBusy}/>
    )
}