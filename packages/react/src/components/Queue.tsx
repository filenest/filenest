"use client"

import { Slot } from "@radix-ui/react-slot"
import { type WithoutChildren } from "../utils/types"
import { useFileQueueContext, type QueueFile } from "../context/global/FileQueueContext"

interface RenderProps {
    files: QueueFile[]
    clearQueue: () => void
}

export interface QueueProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    references: string
}

export const Queue = ({ asChild, references, children, ...props }: QueueProps) => {
    const { clearQueue, getUploaderFiles } = useFileQueueContext()

    const files = getUploaderFiles(references)

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