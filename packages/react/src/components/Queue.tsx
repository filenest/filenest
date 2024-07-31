"use client"

import { Slot } from "@radix-ui/react-slot"
import { type WithoutChildren } from "../utils/types"
import { useFileQueueContext, type QueueFile } from "../context/global/FileQueueContext"
import { QueueProvider } from "../context/local/QueueContext"

interface RenderProps {
    files: QueueFile[]
    clearQueue: () => void
    progress: number
    isUploading: boolean
}

export interface QueueProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    references: string
}

const QueueWrapper = ({ asChild, references, children, ...props }: QueueProps) => {
    return (
        <QueueProvider references={references}>
            <Queue asChild={asChild} references={references} {...props}>
                {children}
            </Queue>
        </QueueProvider>
    )
}

const Queue = ({ asChild, references, children, ...props }: QueueProps) => {
    const { clearQueue, getUploaderFiles, getUploader } = useFileQueueContext()

    const files = getUploaderFiles(references)
    const uploader = getUploader(references)

    if (!files.length) return null

    const Comp = asChild ? Slot : "div"

    function cq() {
        clearQueue(references)
    }

    function getChildren() {
        if (typeof children === "function") {
            return children({ files, clearQueue: cq, progress: uploader!.progress, isUploading: uploader!.isUploading })
        }

        return children
    }

    return <Comp {...props}>{getChildren()}</Comp>
}

export { QueueWrapper as Queue }