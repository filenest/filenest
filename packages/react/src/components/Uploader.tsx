"use client"

import type { WithoutChildren } from "../utils/types"
import { Slot } from "@radix-ui/react-slot"
import { UploaderProvider, useUploaderContext, type UploaderProviderProps } from "../context/local/UploaderContext"
import { useEffect } from "react"
import { useFileQueueContext } from "../context/global/FileQueueContext"

const UploaderWrapper = ({
    accept,
    children,
    disabled,
    hideIfMaxFilesReached,
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
        accept,
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
        name: props.name,
    }

    const uploaderProps = {
        hideIfMaxFilesReached,
        multiple,
        maxFiles,
        children,
        ...props
    }

    return (
        <UploaderProvider {...uploaderConfig}>
            <Uploader {...uploaderProps}/>
        </UploaderProvider>
    )
}

interface RenderProps {
    isDragActive: boolean
}

export interface UploaderProps
    extends WithoutChildren<Omit<React.ComponentPropsWithoutRef<"div">, "onProgress" | "onError">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    name: string
    multiple?: boolean
    hideIfMaxFilesReached?: boolean
    maxFiles?: number
}

const Uploader = ({ children, asChild, multiple, hideIfMaxFilesReached, maxFiles, ...props }: UploaderProps) => {
    const { addToQueue, clearQueue, getUploaderFiles } = useFileQueueContext()
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

    const isHidden = (hideIfMaxFilesReached && maxFiles && getUploaderFiles(id).length >= maxFiles)
        || (hideIfMaxFilesReached && !multiple && getUploaderFiles(id).length > 0)

    if (isHidden) {
        return null
    }

    const getChildren = () => {
        if (typeof children === "function") {
            return children({ isDragActive: dropzone.isDragActive })
        }

        return children
    }

    return (
        <Comp {...dropzone.getRootProps({ ...props })}>
            <input {...dropzone.getInputProps()} />
            {getChildren()}
        </Comp>
    )
}

export { UploaderWrapper as Uploader }
