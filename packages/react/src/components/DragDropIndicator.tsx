"use client"

import { Slot } from "@radix-ui/react-slot"
import { useAssetListContext } from "../context/AssetListContext"

interface DragDropIndicatorProps extends React.ComponentPropsWithoutRef<"div"> {
    asChild?: boolean
}

export const DragDropIndicator = ({ asChild, ...props }: DragDropIndicatorProps) => {
    const { dropzone } = useAssetListContext()

    if (!dropzone.isDragActive) return null

    const Comp = asChild ? Slot : "div"

    return (
        <Comp {...props}/>
    )
}