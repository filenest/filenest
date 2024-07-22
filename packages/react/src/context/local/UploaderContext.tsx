"use client"

import { createContext, useContext } from "react"
import { useDropzone } from "react-dropzone"
import { useGlobalContext } from "../global/GlobalContext"

export interface UploaderContext {
    dropzone: ReturnType<typeof useDropzone>
}

const UploaderContext = createContext<UploaderContext | null>(null)

export const useUploaderContext = () => {
    const context = useContext(UploaderContext)
    if (!context) {
        throw new Error("useUploaderContext must be used within a Filenest.Uploader component")
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
    onUpload?: (files: File[]) => void
    onProgress?: (progress: number) => void
    onSuccess?: () => void
    onError?: (error: Error) => void
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
    uploadOnDrop,
    name
}: UploaderProviderProps) => {
    const { upload } = useGlobalContext()

    const dropzone = useDropzone({
        maxSize,
        maxFiles,
        multiple,
        noClick,
        noDrag: noDrop,
        onDrop: async (acceptedFiles) => {
            if (uploadOnDrop) {
                onUpload?.(acceptedFiles)
                // Currently doesnt work, because upload function uses state from GlobalContext
                // and at this point the state does not include the new acceptedFiles
                
                // await upload(name)
            }
        },
        onError: (err) => {
            onError?.(err)
        },
        disabled
    })

    const contextValue = {
        dropzone
    }

    return <UploaderContext.Provider value={contextValue}>{children}</UploaderContext.Provider>
}
