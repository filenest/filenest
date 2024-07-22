"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/global/GlobalContext"
import type { WithoutChildren } from "../utils/types"

interface RenderProps {
    isUploading: boolean
}

export interface UploadButtonProps extends WithoutChildren<React.ComponentPropsWithoutRef<"button">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    references: string
}

export const UploadButton = ({ asChild, references, children, ...props }: UploadButtonProps) => {
    const { queue, upload } = useGlobalContext()

    const uploader = queue.uploaders[references]
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
