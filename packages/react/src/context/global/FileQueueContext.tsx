"use client"

import { createContext, useCallback, useContext, useRef, useState } from "react"
import { useGlobalContext } from "./GlobalContext"

export interface FileQueueContext {
    uploaders: UploaderState
    files: QueueFile[]
    addToQueue: (files: QueueFile[]) => void
    removeFromQueue: (uploaderName: string, fileName: string) => void
    clearQueue: (id: string) => void
    upload: (uploaderName: string) => Promise<void>
    setUploader: (uploaderName: string, state: Partial<UploaderState[string]>) => void
    getUploader: (id: string) => UploaderState[string] | undefined
    getUploaderFiles: (id: string) => QueueFile[]
    uploaderListeners: React.MutableRefObject<Record<string, UploaderListener | undefined>>
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

export const FileQueueProvider = ({ children }: FileQueueProviderProps) => {
    const { currentFolder, fetchers, resourcesQuery } = useGlobalContext()

    const [uploaders, setUploaders] = useState<UploaderState>({})
    const uploaderListeners = useRef<Record<string, UploaderListener | undefined>>({})
    const [files, setFiles] = useState<QueueFile[]>([])

    const getUploader = useCallback((id: string) => {
        if (uploaders[id]) {
            return uploaders[id]
        } else {
            return undefined
        }
    }, [uploaders])

    const addToQueue = useCallback((files: QueueFile[]) => {
        setFiles((curr) => {
            const newFiles: QueueFile[] = []

            for (const file of files) {
                const uploader = getUploader(file.uploaderName)
                if (!uploader) {
                    setUploaders((curr) => {
                        return {
                            ...curr,
                            [file.uploaderName]: {
                                progress: 0,
                                isUploading: false,
                            },
                        }
                    })
                }
                if (curr.find((f) => f.file.name === file.file.name && f.uploaderName === file.uploaderName)) continue
                newFiles.push(file)
            }

            return [...curr, ...newFiles]
        })
    }, [files])

    function setQueueFile(uploaderName: string, fileName: string, state: Partial<QueueFile>) {
        setFiles((curr) => {
            const uploader = getUploader(uploaderName)
            if (!uploader) return curr

            const newFiles = curr.map((f) => {
                if (f.file.name === fileName && f.uploaderName === uploaderName) {
                    return {
                        ...f,
                        ...state,
                    }
                }
                return f
            })

            // Also update total progress of uploader
            if (state.progress) {
                const totalProgress = curr
                    .filter((f) => f.uploaderName === uploaderName)
                    .reduce((acc, curr) => {
                        return acc + curr.progress
                    }, 0)
                const uploaderProgress = Number((totalProgress / curr.length).toFixed(2))
                setUploader(uploaderName, { progress: uploaderProgress })
            }

            return newFiles
        })
    }

    function getUploaderFiles(uploaderName: string) {
        return files.filter((f) => f.uploaderName === uploaderName)
    }

    function clearQueue(uploaderName: string) {
        const uploader = getUploader(uploaderName)
        if (!uploader) return
        if (uploader.isUploading) return
        setFiles((curr) => {
            return curr.filter((f) => f.uploaderName !== uploaderName)
        })
    }

    function removeFromQueue(uploaderName: string, fileName: string) {
        setFiles((curr) => {
            return curr.filter((f) => f.file.name !== fileName && f.uploaderName == uploaderName)
        })
    }

    function setUploader(uploaderName: string, state: Partial<UploaderState[string]>) {
        setUploaders((curr) => {
            return {
                ...curr,
                [uploaderName]: {
                    ...curr[uploaderName],
                    ...state,
                },
            }
        })
    }

    const upload = useCallback(async (uploaderName: string) => {
        const uploader = getUploader(uploaderName)
        if (!uploader) return

        const events = uploaderListeners.current[uploaderName]

        const filesToUpload = files.filter(f => f.uploaderName === uploaderName).map(f => f.file)
        if (!filesToUpload.length) return

        setUploader(uploaderName, { isUploading: true })

        const uploadedFiles: unknown[] = []

        for (const file of filesToUpload) {
            setQueueFile(uploaderName, file.name, { isUploading: true })

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

            try {
                const result = await new Promise((resolve, reject) => {
                    const xhr = new XMLHttpRequest()
                    xhr.open("POST", url.toString(), true)
                    xhr.upload.addEventListener("progress", (e) => {
                        const percentage = (e.loaded / e.total) * 100
                        setQueueFile(uploaderName, file.name, { progress: Number(percentage.toFixed(2))})
                        events?.onProgress?.(percentage)
                    })
                    xhr.addEventListener("readystatechange", () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            const json = JSON.parse(xhr.response)
                            resolve(json)
                        }
                    })
                    xhr.upload.addEventListener("error", reject)
                    xhr.send(data)
                })
                uploadedFiles.push(result)
                setQueueFile(uploaderName, file.name, { isUploading: false, isSuccess: true })
                events?.onUpload?.(result)
            } catch (error) {
                setQueueFile(uploaderName, file.name, { isUploading: false, isSuccess: false })
                let message = `An error occurred while uploading the file ${file.name}`
                if (error instanceof Error) {
                    message = error.message
                }
                events?.onError?.(message)
            }
        }

        // For some reason only after some time we get new data from Cloudinary
        // TODO: Find a better way to handle this
        setTimeout(onSuccess, 2000)

        async function onSuccess() {
            await resourcesQuery.refetch() // TODO: Better: add assets to state directly
            setUploader(uploaderName, { isUploading: false })
            clearQueue(uploaderName)
            events?.onSuccess?.(uploadedFiles)
        }
    }, [files, currentFolder])

    const contextValue = {
        uploaders,
        files,
        addToQueue,
        removeFromQueue,
        clearQueue,
        upload,
        setUploader,
        getUploader,
        getUploaderFiles,
        uploaderListeners
    }

    return <FileQueueContext.Provider value={contextValue}>{children}</FileQueueContext.Provider>
}

interface UploaderState {
    [key: string]: {
        progress: number
        isUploading: boolean
    }
}

export interface QueueFile {
    uploaderName: string
    file: File
    isUploading: boolean
    isSuccess: boolean
    progress: number
}


interface UploaderListener {
    onProgress?: (progress: number) => void
    onUpload?: (file: unknown) => void
    onSuccess?: (files: unknown[]) => void
    onError?: (message: string) => void
}