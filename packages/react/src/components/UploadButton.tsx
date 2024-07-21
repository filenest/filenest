"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"

export interface UploadButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
    references: string
}

export const UploadButton = ({ asChild, references, ...props }: UploadButtonProps) => {
    const { queue, fetchers, currentFolder } = useGlobalContext()

    const uploader = queue.uploaders[references]
    const files = uploader?.files || []
    const disabled = uploader?.isUploading || !files.length

    const Comp = asChild ? Slot : "button"

    async function handleUpload() {
        if (disabled) return

        const params = {
            folder: currentFolder.path,
        }

        for (const file of files) {
            const _url = await fetchers.getUploadUrl({ params })
            const url = new URL(_url)
            const data = new FormData()
            data.append("file", file)
            url.searchParams.sort()
            await fetch(url.toString(), {
                method: "POST",
                body: data
            })
        }
    }

    return <Comp {...props} onClick={handleUpload} disabled={disabled} />
}
