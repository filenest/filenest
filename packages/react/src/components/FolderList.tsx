"use client"

import { useGlobalContext } from "../context/GlobalContext"
import type { Folder as FolderType } from "@filenest/core"

interface RenderProps {
    folders?: FolderType[]
    isLoading: boolean
}

export interface FolderListProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const FolderList = ({ children }: FolderListProps) => {
    const { resources, resourcesQuery, isGlobalSearch } = useGlobalContext()

    if (isGlobalSearch) return null

    const folders = resources?.resources.folders.data
    const isLoading = resourcesQuery.isLoading

    if (children && typeof children === "function") {
        return children({ folders, isLoading })
    }

    return children
}
