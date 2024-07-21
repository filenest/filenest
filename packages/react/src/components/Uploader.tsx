"use client"

import type { WithoutChildren } from "../utils/types"
import { Slot } from "@radix-ui/react-slot"
import { UploaderProvider, useUploaderContext, type UploaderProviderProps } from "../context/UploaderContext"
import { useGlobalContext } from "../context/GlobalContext"
import { useEffect } from "react"

const UploaderWrapper = ({
    children,
    disabled,
    maxFiles,
    maxSize = 2.5e8, // 250 MB,
    multiple = true,
    noClick,
    noDrop,
    onError,
    onProgress,
    onSuccess,
    onUpload,
    uploadOnDrop,
    ...props
}: UploaderProps & UploaderProviderProps) => {
    const uploaderConfig = {
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
    }

    return (
        <UploaderProvider {...uploaderConfig}>
            <Uploader {...props}>{children}</Uploader>
        </UploaderProvider>
    )
}

export interface UploaderProps
    extends WithoutChildren<Omit<React.ComponentPropsWithoutRef<"div">, "onProgress" | "onError">> {
    asChild?: boolean
    children?: React.ReactNode
    name?: string
}

const Uploader = ({ children, asChild, ...props }: UploaderProps) => {
    const { updateUploader, queue } = useGlobalContext()
    const { dropzone } = useUploaderContext()

    const id = props.id || props.name || "filenest-uploader"

    useEffect(() => {
        const files = dropzone.acceptedFiles.map((item) => ({
            file: item,
            isUploading: false,
            isSuccess: false,
            progress: 0,
        }))
        updateUploader(id, { files })
    }, [dropzone.acceptedFiles])

    const Comp = asChild ? Slot : "div"

    return (
        <Comp {...dropzone.getRootProps({ ...props })}>
            <input {...dropzone.getInputProps()} />
            {children}
        </Comp>
    )
}

export { UploaderWrapper as Uploader }
