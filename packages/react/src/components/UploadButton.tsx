"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"
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
    const { queue, fetchers, currentFolder, resourcesQuery, updateUploader } = useGlobalContext()

    const uploader = queue.uploaders[references]
    const files = uploader?.files || []
    const isUploading = uploader?.isUploading || false
    const disabled = isUploading || !files.length

    const Comp = asChild ? Slot : "button"

    async function handleUpload() {
        if (disabled) return

        updateUploader(references, { isUploading: true })

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
                body: data,
            })
        }

        // For some reason only after some time we get new data from Cloudinary
        // TODO: Find a better way to handle this
        setTimeout(onSuccess, 2000)

        async function onSuccess() {
            await resourcesQuery.refetch() // TODO: Better: add assets to state directly
            updateUploader(references, { isUploading: false }, true)
        }
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
