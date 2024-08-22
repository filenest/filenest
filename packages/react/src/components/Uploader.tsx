"use client"

import type { WithoutChildren } from "../utils/types"
import { Slot } from "@radix-ui/react-slot"
import { UploaderProvider, useUploaderContext, type UploaderProviderProps } from "../context/local/UploaderContext"
import { useEffect } from "react"
import { useFileQueueContext } from "../context/global/FileQueueContext"

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
        name: props.name
    }

    return (
        <UploaderProvider {...uploaderConfig}>
            <Uploader {...props} multiple={multiple}>{children}</Uploader>
        </UploaderProvider>
    )
}

export interface UploaderProps
    extends WithoutChildren<Omit<React.ComponentPropsWithoutRef<"div">, "onProgress" | "onError">> {
    asChild?: boolean
    children?: React.ReactNode
    name: string
    multiple?: boolean
}

const Uploader = ({ children, asChild, multiple, ...props }: UploaderProps) => {
    const { addToQueue, clearQueue } = useFileQueueContext()
    const { dropzone } = useUploaderContext()

    const id = props.name || "filenest-uploader"

    useEffect(() => {
        const files = dropzone.acceptedFiles.map((item) => ({
            uploaderName: id,
            file: item,
            isUploading: false,
            isSuccess: false,
            progress: 0,
        }))
        if (!multiple) {
            clearQueue(id)
        }
        addToQueue(files)
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
