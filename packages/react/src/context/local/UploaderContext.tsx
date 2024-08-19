"use client"

import { createContext, useContext } from "react"
import { useDropzone } from "react-dropzone"
import { useFileQueueContext } from "../global/FileQueueContext"

export interface UploaderContext {
    dropzone: ReturnType<typeof useDropzone>
}

const UploaderContext = createContext<UploaderContext | null>(null)

export const useUploaderContext = () => {
    const context = useContext(UploaderContext)
    if (!context) {
        throw new Error("useUploaderContext must be used within a Filenest.Uploader component.")
    }
    return context
}

export interface UploaderProviderProps {
    children: React.ReactNode
    name: string
    noDrop?: boolean
    noClick?: boolean
    multiple?: boolean
    uploadOnDrop?: boolean
    onUpload?: (file: File) => void
    onProgress?: (progress: number) => void
    onSuccess?: () => void
    onError?: (message: string) => void
    disabled?: boolean
    maxFiles?: number
    maxSize?: number
}

export const UploaderProvider = ({
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
    name
}: UploaderProviderProps) => {
    const { uploaderListeners } = useFileQueueContext()

    uploaderListeners.current[name] = {
        onError,
        onProgress,
        onSuccess,
        onUpload
    }

    const dropzone = useDropzone({
        maxSize,
        maxFiles,
        multiple,
        noClick,
        noDrag: noDrop,
        onError: (err) => {
            onError?.(err.message)
        },
        disabled
    })

    const contextValue = {
        dropzone
    }

    return <UploaderContext.Provider value={contextValue}>{children}</UploaderContext.Provider>
}
