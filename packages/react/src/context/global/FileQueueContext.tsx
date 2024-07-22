"use client"

import { createContext, useContext, useState } from "react"
import { useGlobalContext } from "./GlobalContext"

export interface FileQueueContext {
    queue: Queue
    updateUploader: (id: string, dropzone: Partial<Queue["uploaders"][0]>, shouldClearFiles?: boolean) => void
    clearQueue: (id: string) => void
    upload: (uploaderName: string) => Promise<void>
}

const FileQueueContext = createContext<FileQueueContext | null>(null)

export const useFileQueueContext = () => {
    const context = useContext(FileQueueContext)
    if (!context) {
        throw new Error("A Filenest component must be used within a Filenest.Root component.")
    }
    return context
}

interface FileQueueProviderProps {
    children: React.ReactNode
}

export const FileQueueProvider = ({ children, ...props }: FileQueueProviderProps) => {
    const { currentFolder, fetchers, resourcesQuery } = useGlobalContext()

    const [queue, setQueue] = useState<Queue>({ totalProgress: 0, uploaders: {} })

    function updateUploader(id: string, dropzone: Partial<Queue["uploaders"][0]>, shouldClearFiles = false) {
        setQueue((curr) => {
            const currentFiles = curr.uploaders[id]?.files || []
            const additionalFiles = dropzone.files ?? []
            let files = [...currentFiles, ...additionalFiles]

            if (shouldClearFiles) {
                files = []
            }

            // Use a map here to skip duplicates
            const newFiles = new Map<string, QueueFile>()
            const defaultOpts = { isUploading: false, isSuccess: false, progress: 0 }
            curr.uploaders[id]?.files.forEach((item) => {
                newFiles.set(item.file.name, { ...defaultOpts, ...item })
            })

            files.forEach((item) => {
                newFiles.set(item.file.name, { ...defaultOpts, ...item })
            })

            const newFilesArray = () => {
                if (files.length === 0) return []
                return Array.from(newFiles.values())
            }

            return {
                ...curr,
                uploaders: {
                    ...curr.uploaders,
                    [id]: {
                        ...dropzone,
                        files: newFilesArray(),
                    },
                },
            }
        })
    }

    function clearQueue(id: string) {
        const uploader = queue.uploaders[id]
        if (uploader.isUploading) return
        updateUploader(id, { files: [], isUploading: false, progress: 0 }, true)
    }

    // Use `overrideFiles` when using `uploadOnDrop` prop with a Filenest.Uploader
    // because when dropping files, the queue state is not immedialety updated
    // and the files wouldn't be available.
    async function upload(uploaderName: string) {
        const uploader = queue.uploaders[uploaderName]
        if (!uploader) return

        const files = uploader.files.map(f => f.file)
        if (!files.length) return

        updateUploader(uploaderName, { isUploading: true })

        for (const file of files) {
            const params = {
                folder: currentFolder.path,
                use_filename: "true",
                unique_filename: "true",
            }
            const _url = await fetchers.getUploadUrl({ params })
            const url = new URL(_url)
            const data = new FormData()
            data.append("file", file)
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
            updateUploader(uploaderName, { isUploading: false }, true)
        }
    }

    const contextValue = {
        queue,
        updateUploader,
        clearQueue,
        upload,
    }

    return <FileQueueContext.Provider value={contextValue}>{children}</FileQueueContext.Provider>
}

interface Queue {
    totalProgress: number
    uploaders: {
        [key: string]: {
            files: QueueFile[]
            progress?: number
            isUploading?: boolean
        }
    }
}

interface QueueFile {
    file: File
    isUploading: boolean
    isSuccess: boolean
    progress: number
}
