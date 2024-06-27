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

    const { renderMode, resources, alertDialog } = useGlobalContext()

    if (renderMode === "bundle" && action === "select") {
        return null
    }

    function deleteActually() {
        alert("delete")
    }

    const actions = {
        remove: () => {
            alertDialog.setContent({
                title: "Are you sure?",
                text: "Your file will be gone forever.",
                commit: "Delete file",
                cancel: "Keep file"
            })
            alertDialog.setAction(() => deleteActually)
            alertDialog.setOpen(true)
        },
        rename: () => {
            resources.renameAsset()
        },
        select: () => {
            resources.selectAsset()
        },
    }

    function onClick(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        actions[action]()
    }

    const Comp = asChild ? Slot : "button"

    return (
        <Comp {...props} onClick={onClick}/>
    )
}