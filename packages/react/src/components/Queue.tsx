"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"
import { type WithoutChildren } from "../utils/types"

interface RenderProps {
    assets: File[]
}

export interface QueueProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    references: string
}

export const Queue = ({ asChild, references, children, ...props }: QueueProps) => {
    const { fileMappers } = useGlobalContext()

    const files = fileMappers[references] || []

    if (!files.length) return null

    const Comp = asChild ? Slot : "div"

    function getChildren() {
        if (typeof children === "function") {
            return children({ assets: files })
        }

        return children
    }

    return <Comp {...props}>{getChildren()}</Comp>
}