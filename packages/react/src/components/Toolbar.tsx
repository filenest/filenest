"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/global/GlobalContext"
import type { WithoutChildren } from "../utils/types"

interface RenderProps {
    selectedFilesCount: number
}

export interface ToolbarProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const Toolbar = ({ asChild, children, ...props }: ToolbarProps) => {
    const { selectedFiles } = useGlobalContext()

    if (!selectedFiles.length) {
        return null
    }

    const Comp = asChild ? Slot : "div"

    const selectedFilesCount = selectedFiles.length

    const getChildren = () => {
        if (typeof children === "function") {
            return children({ selectedFilesCount })
        }

        return children
    }

    return <Comp {...props}>{getChildren()}</Comp>
}
