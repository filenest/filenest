"use client"

import React from "react"
import { SetState, SetterGetter } from "../utils/types"
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
  isError: boolean
  isDone: boolean
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

  function updateUploadByName(name: string, setUpload: (data: Upload) => Upload) {
    setUploads((current) =>
      current.map((u) => {
        if (u.raw.name === name) {
          return setUpload(u)
        }
        return u
      })
    )
  }

  async function beginUpload() {
    for (const upload of uploads) {
      updateUploadByName(upload.raw.name, (u) => ({
        ...u,
        isUploading: true,
        isError: false,
        isDone: false,
      }))

      // Get signed url for each upload
      const urlResult = await client.fetchers.files.getUploadUrl({
        file: {
          name: upload.raw.name,
          size: upload.raw.size,
        },
        folder: "",
      })

      if ("error" in urlResult) {
        updateUploadByName(upload.raw.name, (u) => ({
          ...u,
          isUploading: false,
          isError: true,
          isDone: true,
        }))
        continue
      }

      const uploadUrl = new URL(urlResult.data.url)
      console.log(uploadUrl)

      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()
          xhr.open("POST", uploadUrl, true)

          xhr.upload.addEventListener("progress", (e) => {
            const percentage = (e.loaded / e.total) * 100
            updateUploadByName(upload.raw.name, (u) => ({
              ...u,
              progress: Number(percentage.toFixed(2)),
            }))
          })

          xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
              const json = JSON.parse(xhr.response)
              resolve(json)
            }
          })

          xhr.upload.addEventListener("error", reject)

          const POSTData = new FormData()
          const POSTBody: Record<string, any> = {}

          const fileParamName = urlResult.data.params.fileParam.name
          const fileParamType = urlResult.data.params.fileParam.type
          const fileParamValue = urlResult.data.params.fileParam.data

          if (fileParamType === "stringOrBlob") {
            POSTData.append(fileParamName, upload.raw)
            xhr.send(POSTData)
          } else if (fileParamType === "object") {
            if (!fileParamValue) {
              throw new Error("No file param data provided for object type")
            }
            POSTBody[fileParamName] = fileParamValue
            xhr.send(JSON.stringify(POSTBody))
          } else if (fileParamType === "objectArray") {
            if (!fileParamValue) {
              throw new Error("No file param data provided for objectArray type")
            }
            POSTBody[fileParamName] = fileParamValue
            xhr.send(JSON.stringify(POSTBody))
          }
        })

        updateUploadByName(upload.raw.name, (u) => ({
          ...u,
          isUploading: false,
          isError: false,
          isDone: true,
        }))
      } catch (error) {
        updateUploadByName(upload.raw.name, (u) => ({
          ...u,
          isUploading: false,
          isError: true,
          isDone: true,
        }))

        let message = `An error occurred while uploading the file ${upload.raw.name}`
        if (error instanceof Error) {
          message = error.message
        }
        console.error(message)
      }
    }
  }

  const contextValue = {
    uploads: { value: uploads, set: setUploads },
    meta: { value: meta, set: setMeta },
    beginUpload,
  }

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>
}
