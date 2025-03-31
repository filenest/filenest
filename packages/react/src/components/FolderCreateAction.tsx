"use client"

import React from "react"
import slugify from "slugify"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useGlobalContext } from "./Root"
import { useFoldersContext } from "../context/FoldersContext"
import { SetState } from "../utils/types"

interface RenderProps {
  trigger: () => void
  name: string
  setName: SetState<string>
  isCreating: boolean
}

export interface FolderCreateActionProps {
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const FolderCreateAction = ({ children }: FolderCreateActionProps) => {
  const queryClient = useQueryClient()

  const { folders } = useFoldersContext()
  const { client, currentPath } = useGlobalContext()

  const [name, setName] = React.useState<string>("")
  const [isCreating, setIsCreating] = React.useState(false)

  const mutation = useMutation({
    mutationKey: ["filenest-createFolder", name],
    mutationFn: async () => {
      return await client.fetchers.folders.createFolder({
        key: `${currentPath.value}/${slugify(name, { lower: true })}`,
        path: `${currentPath.value}/${slugify(name, { lower: true })}`,
        displayName: name,
      })
    },
    onMutate: () => {
      setIsCreating(true)
    },
    onSettled: () => {
      setIsCreating(false)
    },
    onSuccess: (data) => {
      if (data.success && "data" in data) {
        setName("")
        folders.set((prev) => [...prev, data.data])
        queryClient.invalidateQueries({ queryKey: ["filenest-folders"] })
      }
    },
  })

  async function trigger() {
    mutation.mutate()
  }

  if (typeof children === "function") {
    return children({ trigger, isCreating, name, setName })
  } else {
    return children
  }
}
