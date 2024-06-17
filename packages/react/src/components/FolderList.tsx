"use client"

import { FolderListProvider, useFolderListContext } from "../context/FolderListContext"
import { useGlobalContext } from "../context/GlobalContext"
import type { Folder as FolderType } from "@filenest/handlers"

interface RenderProps {
    folders?: FolderType[]
    isLoading: boolean
    createFolder: () => void
}

interface FolderListProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const FolderListWrapper = ({ children }: FolderListProps) => {
    return (
        <FolderListProvider>
            <FolderList>{children}</FolderList>
        </FolderListProvider>
    )
}

const FolderList = ({ children }: FolderListProps) => {
    const { resources, resourcesQuery } = useGlobalContext()
    const { createFolder } = useFolderListContext()

    const folders = resources?.resources.folders.data
    const isLoading = resourcesQuery.isFetching

    if (children && typeof children === "function") {
        return children({ folders, isLoading, createFolder })
    }

    return children
}

export { FolderListWrapper as FolderList }
