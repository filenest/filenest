"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"
import { type WithoutChildren } from "../utils/types"

interface RenderProps {
    files: File[]
    clearQueue: () => void
}

export interface QueueProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    references: string
}

export const Queue = ({ asChild, references, children, ...props }: QueueProps) => {
    const { queue, clearQueue } = useGlobalContext()

    const uploader = queue.uploaders[references]
    const files = uploader?.files.map(f => f.file) || []

    if (!files.length) return null

    const Comp = asChild ? Slot : "div"

    function cq() {
        clearQueue(references)
    }

    function getChildren() {
        if (typeof children === "function") {
            return children({ files, clearQueue: cq })
        }

        return children
    }

    return <Comp {...props}>{getChildren()}</Comp>
}