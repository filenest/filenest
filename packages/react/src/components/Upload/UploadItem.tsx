"use client"

import React from "react"
import { Upload, useUploadContext } from "../../context/UploadContext"

interface UploadContext {
  upload: Upload
}

const UploadContext = React.createContext<UploadContext | null>(null)

export function useFileContext() {
  const context = React.useContext(UploadContext)
  if (!context) {
    throw new Error(
      "One of your components uses useFileContext, but was not used within File.Root"
    )
  }
  return context
}

interface RenderProps {
  upload: Upload
  removeFromQueue: () => void
}

export interface UploadProps {
  upload?: Upload
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const UploadItem = ({ upload, children }: UploadProps) => {
  const { uploads } = useUploadContext()

  if (!upload) {
    throw new Error(
      [
        "`upload` prop wasn't automatically passed to Upload.Root.",
        "Ensure your setup is correct.",
      ].join(" ")
    )
  }

  const removeFromQueue = () => {
    uploads.set((current) => current.filter((u) => u.raw.name !== upload.raw.name))
  }

  const contextValue = {
    upload,
  }

  if (typeof children === "function") {
    return (
      <UploadContext.Provider value={contextValue}>
        {children({ upload, removeFromQueue })}
      </UploadContext.Provider>
    )
  } else {
    return (
      <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>
    )
  }
}
