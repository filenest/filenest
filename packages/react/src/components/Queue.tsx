"use client"

import { useUploadContext } from "../context/UploadContext"
import { UploadItem, UploadProps } from "./Upload/UploadItem"

interface RenderProps {
  uploads: Array<{
    Root: React.FC<UploadProps>
  }>
  upload: () => void
}

export interface QueueProps {
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const Queue = ({ children }: QueueProps) => {
  const { uploads, beginUpload } = useUploadContext()

  if (uploads.value.length === 0) return null

  if (typeof children === "function") {
    return children({
      uploads: uploads.value.map((upload) => ({
        Root: (props: UploadProps) => <UploadItem {...props} upload={upload} />,
      })),
      upload: beginUpload,
    })
  } else {
    return children
  }
}
