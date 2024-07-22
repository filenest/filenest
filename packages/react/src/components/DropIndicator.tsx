"use client"

import { Slot } from "@radix-ui/react-slot"
import { useUploaderContext } from "../context/local/UploaderContext"

export interface DropIndicatorProps extends React.ComponentPropsWithoutRef<"div"> {
    asChild?: boolean
}

export const DropIndicator = ({ asChild, ...props }: DropIndicatorProps) => {
    const { dropzone } = useUploaderContext()

    if (!dropzone.isDragActive) return null

    const Comp = asChild ? Slot : "div"

    return <Comp {...props} />
}
