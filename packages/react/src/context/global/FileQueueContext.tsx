"use client"

import { createContext, useContext, useState } from "react"
import { useGlobalContext } from "./GlobalContext"

export interface FileQueueContext {
    queue: Queue
    addToQueue: (uploaderName: string, files: QueueFile[]) => void
    clearQueue: (id: string) => void
    upload: (uploaderName: string) => Promise<void>
    setUploader: (uploaderName: string, state: Partial<Omit<Queue[string], "files">>) => void
    getUploader: (id: string) => Queue[string] | undefined
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

    const [queue, setQueue] = useState<Queue>({})

    function getUploader(id: string) {
        if (queue[id]) {
            return queue[id]
        } else {
            return undefined
        }
    }

    function addToQueue(uploaderName: string, files: QueueFile[]) {
        setQueue((curr) => {
            const uploader = getUploader(uploaderName)
            const currentFiles = uploader?.files || []
            const combinedFiles = [...currentFiles, ...files]
            const additionalFiles = new Map<string, QueueFile>(combinedFiles.map((f) => [f.file.name, f]))
            const mergedFiles = Array.from(additionalFiles.values())

            return {
                ...curr,
                [uploaderName]: {
                    files: mergedFiles,
                    progress: 0,
                    isUploading: false,
                },
            }
        })
    }

    function clearQueue(uploaderName: string) {
        const uploader = getUploader(uploaderName)
        if (!uploader) return
        if (uploader.isUploading) return
        setQueue((curr) => {
            const { [uploaderName]: _, ...rest } = curr
            return rest
        })
    }

    function setUploader(uploaderName: string, state: Partial<Omit<Queue[string], "files">>) {
        setQueue((curr) => {
            return {
                ...curr,
                [uploaderName]: {
                    ...curr[uploaderName],
                    ...state,
                },
            }
        })
    }

    async function upload(uploaderName: string) {
        const uploader = getUploader(uploaderName)
        if (!uploader) return

        const files = uploader.files.map(f => f.file)
        if (!files.length) return

        setUploader(uploaderName, { isUploading: true })

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
            setUploader(uploaderName, { isUploading: false })
            clearQueue(uploaderName)
        }
    }

    const contextValue = {
        queue,
        addToQueue,
        clearQueue,
        upload,
        setUploader,
        getUploader,
    }

    return <FileQueueContext.Provider value={contextValue}>{children}</FileQueueContext.Provider>
}

interface Queue {
    [key: string]: {
        files: QueueFile[]
        progress: number
        isUploading: boolean
    }
}

interface QueueFile {
    file: File
    isUploading: boolean
    isSuccess: boolean
    progress: number
}
