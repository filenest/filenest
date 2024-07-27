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
    const { upload, getUploader, getUploaderFiles } = useFileQueueContext()

    const uploader = getUploader(references)
    const files = getUploaderFiles(references)
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
