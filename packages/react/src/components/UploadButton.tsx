"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"
import { useQueryClient } from "@tanstack/react-query"

export interface UploadButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
    references: string
}

export const UploadButton = ({ asChild, references, ...props }: UploadButtonProps) => {
    const { queue, fetchers, currentFolder, resourcesQuery } = useGlobalContext()
    const queryClient = useQueryClient()

    const uploader = queue.uploaders[references]
    const files = uploader?.files || []
    const disabled = uploader?.isUploading || !files.length

    const Comp = asChild ? Slot : "button"

    async function handleUpload() {
        if (disabled) return

        for (const item of files) {
            const params = {
                folder: currentFolder.path,
                use_filename: "true",
                unique_filename: "true",
            }    
            const _url = await fetchers.getUploadUrl({ params })
            const url = new URL(_url)
            const data = new FormData()
            data.append("file", item.file)
            url.searchParams.sort()
            await fetch(url.toString(), {
                method: "POST",
                body: data
            })
        }

        setTimeout(() => {
            resourcesQuery.refetch()
        }, 2000)
    }

    return <Comp {...props} onClick={handleUpload} disabled={disabled} />
}
