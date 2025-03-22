"use client"

import React from "react"
import { SetterGetter } from "../utils/types"
import { useGlobalContext } from "../components/Root"

interface UploadContext {
  uploads: SetterGetter<Upload[]>
  meta: SetterGetter<Meta>
  beginUpload: () => void
}

const UploadContext = React.createContext<UploadContext | null>(null)

export function useUploadContext() {
  const context = React.useContext(UploadContext)
  if (!context) {
    throw new Error(
      "This component uses useUploadContext, but was not used within Filenest.Root"
    )
  }
  return context
}

export interface Upload {
  raw: File
  progress: number
  isUploading: boolean
  done: boolean
}

interface Meta {
  totalProgress: number
  isBusy: boolean
}

const defaultMeta: Meta = {
  totalProgress: 0,
  isBusy: false,
}

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
  const { client } = useGlobalContext()

  const [uploads, setUploads] = React.useState<Upload[]>([])
  const [meta, setMeta] = React.useState<Meta>(defaultMeta)

  async function beginUpload() {}

  const contextValue = {
    uploads: { value: uploads, set: setUploads },
    meta: { value: meta, set: setMeta },
    beginUpload,
  }

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>
}
