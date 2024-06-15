"use client"

import { useGlobalContext } from "../context/GlobalContext"
import type { Folder as FolderType } from "@filenest/handlers"

interface RenderProps {
    folders?: FolderType[]
    isLoading: boolean
}

interface FolderListProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const FolderList = ({ children }: FolderListProps) => {
    const { resources, resourcesQuery } = useGlobalContext()

    const folders = resources?.resources.folders.data
    const isLoading = resourcesQuery.isFetching

    if (children && typeof children === "function") {
        return children({ folders, isLoading })
    }

    return children
}
