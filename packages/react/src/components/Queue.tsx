"use client"

import { UploadMeta, useUploadContext } from "../context/UploadContext"
import { UploadItem, UploadProps } from "./Upload/UploadItem"

interface RenderProps {
  uploads: Array<{
    Root: React.FC<UploadProps>
  }>
  upload: () => void
  meta: UploadMeta
}

export interface QueueProps {
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const Queue = ({ children }: QueueProps) => {
  const { uploads, beginUpload, meta } = useUploadContext()

  if (uploads.value.length === 0) return null

  if (typeof children === "function") {
    return children({
      uploads: uploads.value.map((upload) => ({
        Root: (props: UploadProps) => <UploadItem {...props} upload={upload} />,
      })),
      upload: beginUpload,
      meta: meta.value,
    })
  } else {
    return children
  }
}
