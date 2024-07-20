"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"

export interface UploadButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
    references: string
}

export const UploadButton = ({ asChild, references, ...props }: UploadButtonProps) => {
    const { queue } = useGlobalContext()

    const uploader = queue.uploaders[references]
    const files = uploader?.files || []
    const disabled = uploader?.isUploading || !files.length

    const Comp = asChild ? Slot : "button"

    function handleUpload() {
        if (disabled) return
        alert("Uploading files...")
    }

    return (
        <Comp {...props} onClick={handleUpload} disabled={disabled}/>
    )
}