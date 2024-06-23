"use client"

import type { Asset as AssetType } from "@filenest/handlers"
import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"

export interface AssetProps extends React.ComponentPropsWithoutRef<"div"> {
    asset: AssetType
    asChild?: boolean
}

export const Asset = ({ asset, asChild, ...props }: AssetProps) => {
    const { setDetailledAsset } = useGlobalContext()

    const Comp = asChild ? Slot : "div"

    function onClick() {
        setDetailledAsset(asset)
    }

    return <Comp {...props} onClick={onClick}/>
}

interface AssetActionTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
    action: "remove" | "rename" | "select"
    asChild?: boolean
}

export const AssetActionTrigger = ({ action, asChild, ...props }: AssetActionTriggerProps) => {

    const { renderMode } = useGlobalContext()

    if (renderMode === "bundle" && action === "select") {
        return null
    }

    function onClick(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
    }

    const Comp = asChild ? Slot : "button"

    return (
        <Comp {...props} onClick={onClick}/>
    )
}