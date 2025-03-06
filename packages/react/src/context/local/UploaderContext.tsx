"use client"

import { createContext, useContext } from "react"
import { Accept, useDropzone } from "react-dropzone"
import { useFileQueueContext } from "../global/FileQueueContext"

export interface UploaderContext {
    dropzone: ReturnType<typeof useDropzone>
    uploadPath?: string
}

const UploaderContext = createContext<UploaderContext | null>(null)

export const useUploaderContext = () => {
    const context = useContext(UploaderContext)
    if (!context) {
        throw new Error("useUploaderContext must be used within a Filenest.Uploader component.")
    }
    return context
}

interface RenderProps {
    isDragActive: boolean
}

export interface UploaderProviderProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    name: string
    accept?: Accept
    noDrop?: boolean
    noClick?: boolean
    multiple?: boolean
    uploadOnDrop?: boolean
    uploadPath?: string
    onUpload?: (file: unknown) => void
    onProgress?: (progress: number) => void
    onSuccess?: (files: unknown[]) => void
    onError?: (message: string) => void
    disabled?: boolean
    maxFiles?: number
    maxSize?: number
}

export const UploaderProvider = ({
    accept,
    children,
    disabled,
    maxFiles,
    maxSize,
    multiple,
    noClick,
    noDrop,
    onError,
    onProgress,
    onSuccess,
    onUpload,
    uploadPath,
    name,
}: UploaderProviderProps) => {
    const { uploaderListeners } = useFileQueueContext()

    uploaderListeners.current[name] = {
        onError,
        onProgress,
        onSuccess,
        onUpload,
    }

    const dropzone = useDropzone({
        accept,
        maxSize,
        maxFiles,
        multiple,
        noClick,
        noDrag: noDrop,
        onError: (err) => {
            onError?.(err.message)
        },
        disabled,
        onDragEnter: (e) => {
            e.stopPropagation()
        },
        onDragLeave: (e) => {
            e.stopPropagation()
        },
        onDragOver: (e) => {
            e.stopPropagation()
        },
        onDrop: (_, __, e) => {
            if (!Array.isArray(e)) {
                e.stopPropagation()
            }
        },
        onDropAccepted: (_, e) => {
            if (!Array.isArray(e)) {
                e.stopPropagation()
            }
        },
        onDropRejected: (_, e) => {
            if (!Array.isArray(e)) {
                e.stopPropagation()
            }
        },
    })

    const contextValue = {
        dropzone,
        uploadPath,
    }

    const getChildren = () => {
        if (typeof children === "function") {
            return children({ isDragActive: dropzone.isDragActive })
        }

        return children
    }

    return <UploaderContext.Provider value={contextValue}>{getChildren()}</UploaderContext.Provider>
}
