"use client"

import { FilenestFolder } from "@filenest/core"
import { useFolderContext } from "./Folder"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useGlobalContext } from "../Root"
import { useFoldersContext } from "../../context/FoldersContext"

interface RenderProps {
  trigger: () => void
  isDeleting: boolean
}

export interface DeleteActionProps {
  folder?: FilenestFolder
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const DeleteAction = ({ folder: propsFolder, children }: DeleteActionProps) => {
  const queryClient = useQueryClient()

  const { isDeleting, isLoading, folder: ctxFolder } = useFolderContext()
  const { folders } = useFoldersContext()
  const { client, onUserInteractionRequired } = useGlobalContext()

  const folder = propsFolder || ctxFolder

  const mutation = useMutation({
    mutationKey: ["filenest-deleteFolder", folder.id],
    mutationFn: async (opts?: { ignoreNotEmpty?: boolean }) => {
      return await client.fetchers.folders.deleteFolder({
        path: folder.key,
        ignoreNotEmpty: opts?.ignoreNotEmpty,
      })
    },
    onMutate: () => {
      isDeleting.set(true)
      isLoading.set(true)
    },
    onSettled: () => {
      isDeleting.set(false)
      isLoading.set(false)
    },
    onSuccess: (data) => {
      if (data.success) {
        folders.set((prev) => [...prev.filter((f) => f.id !== folder.id)])
        queryClient.invalidateQueries({ queryKey: ["filenest-folders"] })
        return
      } else {
        if (data.code === "FILENEST_ERR_FOLDER_NOT_EMPTY") {
          onUserInteractionRequired?.({
            message: `The folder ${
              folder.displayName || folder.key
            } is not empty. Deleting this folder will delete all files and folders inside. Are you sure?`,
            confirmAction: () => {
              mutation.mutate({ ignoreNotEmpty: true })
            },
          })
        }
      }
    },
  })

  async function trigger() {
    mutation.mutate({})
  }

  if (typeof children === "function") {
    return children({ trigger, isDeleting: isDeleting.value })
  } else {
    return children
  }
}
