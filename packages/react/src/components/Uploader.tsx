"use client"

import { DropzoneInputProps, DropzoneRootProps, useDropzone } from "react-dropzone"
import { uploadObjectFromFile } from "../utils/uploads"
import { Upload, useUploadContext } from "../context/UploadContext"

interface RenderProps {
  rootProps: DropzoneRootProps
  inputProps: DropzoneInputProps
  isDragActive: boolean
  uploads: Upload[]
  upload: () => void
}

export interface UploaderProps {
  allowDrop?: boolean
  allowClick?: boolean
  autoUpload?: boolean
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
  multiple?: boolean
  onUpload?: (result: unknown) => void
  uploadPath?: string
}

export const Uploader = ({ children, ...props }: UploaderProps) => {
  const {
    allowClick = true,
    allowDrop = true,
    autoUpload = false,
    multiple = true,
    onUpload,
    uploadPath,
  } = props

  const { uploads, beginUpload, defaultPath, onUpload: eventOnUpload } = useUploadContext()

  if (uploadPath) {
    defaultPath.current = uploadPath
  }

  if (onUpload) {
    eventOnUpload.current = onUpload
  }

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: !allowClick,
    noDrag: !allowDrop,
    multiple,
    noDragEventsBubbling: true,
    onDrop: (files: File[]) => {
      const processedFiles = files.map((file) => uploadObjectFromFile(file))

      const map = new Map<string, Upload>()

      uploads.value.forEach((u) => {
        map.set(u.raw.name, u)
      })

      processedFiles.forEach((u) => {
        map.set(u.raw.name, u)
      })

      uploads.set(Array.from(map.values()))

      if (autoUpload) {
        beginUpload()
      }
    },
  })

  if (typeof children === "function") {
    return children({
      rootProps: getRootProps(),
      inputProps: getInputProps(),
      isDragActive,
      uploads: uploads.value,
      upload: beginUpload,
    })
  } else {
    return children
  }
}
