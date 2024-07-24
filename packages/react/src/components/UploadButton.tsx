"use client"

import { Slot } from "@radix-ui/react-slot"
import type { WithoutChildren } from "../utils/types"
import { useFileQueueContext } from "../context/global/FileQueueContext"

interface RenderProps {
    isUploading: boolean
}

export interface UploadButtonProps extends WithoutChildren<React.ComponentPropsWithoutRef<"button">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    references: string
}

export const UploadButton = ({ asChild, references, children, ...props }: UploadButtonProps) => {
    const { upload, getUploader } = useFileQueueContext()

    const uploader = getUploader(references)
    const files = uploader?.files || []
    const isUploading = uploader?.isUploading || false
    const disabled = isUploading || !files.length

    const Comp = asChild ? Slot : "button"

    async function handleUpload() {
        if (disabled) return
        await upload(references)
    }

    function getChildren() {
        if (typeof children === "function") {
            return children({ isUploading })
        }

        return children
    }

    return (
        <Comp {...props} onClick={handleUpload} disabled={disabled}>
            {getChildren()}
        </Comp>
    )
}
