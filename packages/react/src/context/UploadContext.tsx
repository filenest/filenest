"use client"

import React from "react"
import { SetterGetter } from "../utils/types"
import { useGlobalContext } from "../components/Root"
import { useQueryClient } from "@tanstack/react-query"

interface UploadContext {
  uploads: SetterGetter<Upload[]>
  meta: SetterGetter<UploadMeta>
  beginUpload: () => void
  defaultPath: React.RefObject<string>
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

export interface UploadMeta {
  totalProgress: number
  isLoading: boolean
}

const defaultMeta: UploadMeta = {
  totalProgress: 0,
  isLoading: false,
}

export const UploadProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()
  const { client, currentPath } = useGlobalContext()
  const defaultPath = React.useRef<string>("")

  const [uploads, setUploads] = React.useState<Upload[]>([])
  const [meta, setMeta] = React.useState<UploadMeta>(defaultMeta)

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

  // This is where the client-side upload happens
  async function beginUpload() {
    setMeta((m) => ({
      ...m,
      isLoading: true,
    }))

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
        folder: defaultPath.current || currentPath.value,
      })

      if ("error" in urlResult) {
        updateUploadByName(upload.raw.name, (u) => ({
          ...u,
          isUploading: false,
          isError: true,
        }))
        continue
      }

      const uploadUrl = new URL(urlResult.data.url)

      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest()

          const method = urlResult.data.method || "POST"
          xhr.open(method, uploadUrl, true)

          xhr.upload.addEventListener("progress", (e) => {
            // Advance file upload progress
            const percentage = (e.loaded / e.total) * 100
            updateUploadByName(upload.raw.name, (u) => ({
              ...u,
              progress: Number(percentage.toFixed(2)),
            }))

            // Also calculate new total progress.
            // Must be calced here because we need to know the most
            // recent state of `uploads`. Due to how state updates work,
            // calcing it outside of `setUploads` won't work.
            setUploads((uploads) => {
              if (percentage) {
                const accumulated = uploads.reduce((acc, curr) => {
                  return acc + curr.progress
                }, 0)
                const queueProgress = Number((accumulated / uploads.length).toFixed(2))
                setMeta((m) => ({
                  ...m,
                  totalProgress: queueProgress,
                }))
              }
              return uploads
            })
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
        }))

        let message = `An error occurred while uploading the file ${upload.raw.name}`
        if (error instanceof Error) {
          message = error.message
        }
        console.error("[Filenest]: " + message)
      }
    }

    setMeta((m) => ({
      ...m,
      isLoading: false,
    }))

    setUploads([])

    queryClient.invalidateQueries({ queryKey: ["filenest-files"] })
  }

  const contextValue = {
    uploads: { value: uploads, set: setUploads },
    meta: { value: meta, set: setMeta },
    beginUpload,
    defaultPath,
  }

  return <UploadContext.Provider value={contextValue}>{children}</UploadContext.Provider>
}
