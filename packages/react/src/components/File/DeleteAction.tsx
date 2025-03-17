"use client"

import { FilenestFile } from "@filenest/core"
import { useFileContext } from "./File"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useGlobalContext } from "../Root"
import { useFilesContext } from "../../context/FilesContext"

interface RenderProps {
    trigger: () => void
    isDeleting: boolean
}

export interface DeleteActionProps {
    file?: FilenestFile
    children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const DeleteAction = ({ file: propsFile, children }: DeleteActionProps) => {
    const queryClient = useQueryClient()

    const { isDeleting, isLoading, file: ctxFile } = useFileContext()
    const { files } = useFilesContext()
    const { client } = useGlobalContext()

    const file = propsFile || ctxFile

    const mutation = useMutation({
        mutationKey: ["filenest-deleteFile", file.id],
        mutationFn: async () => {
            return await client.fetchers.files.deleteFiles({
                ids: [file.id],
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
                files.set((prev) => [...prev.filter((f) => f.id !== file.id)])
                queryClient.invalidateQueries({ queryKey: ["filenest-files"] })
            }
        },
    })

    async function trigger() {
        mutation.mutate()
    }

    if (typeof children === "function") {
        return children({ trigger, isDeleting: isDeleting.value })
    } else {
        return children
    }
}
