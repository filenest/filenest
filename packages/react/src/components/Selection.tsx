"use client"

import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useGlobalContext } from "./Root"
import { FilenestFile } from "@filenest/core"
import { useFilesContext } from "../context/FilesContext"

interface RenderProps {
  count: number
  bulkDelete: () => void
}

export interface SelectionProps {
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const Selection = ({ children }: SelectionProps) => {
  const queryClient = useQueryClient()

  const { files } = useFilesContext()
  const { client, selectedFiles } = useGlobalContext()

  const mutation = useMutation({
    mutationKey: ["filenest-files"],
    mutationFn: async (files: FilenestFile[]) => {
      return await client.fetchers.files.deleteFiles({
        ids: files.map((f) => f.id),
      })
    },
    onMutate: () => {
      files.set((old) => old.filter((f) => !selectedFiles.value.includes(f)))
      selectedFiles.set([])
    },
    onSettled: () => {},
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["filenest-files"] })
    },
  })

  const bulkDelete = () => {
    mutation.mutate(selectedFiles.value)
  }

  if (selectedFiles.value.length === 0) return null

  if (typeof children === "function") {
    return children({
      count: selectedFiles.value.length,
      bulkDelete,
    })
  } else {
    return children
  }
}
