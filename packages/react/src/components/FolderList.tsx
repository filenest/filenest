"use client"

import { useGlobalContext } from "../context/GlobalContext"
import type { Folder as FolderType } from "@filenest/handlers"
import { Folder } from "./Folder"

interface RenderProps {
    folders?: FolderType[]
    isLoading?: boolean
}

interface FolderListProps {
    children?: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    classNames?: {
        container?: string
        item?: string
        actionListTrigger?: string
        actionList?: string
        actionListItem?: string
    }
}

export const FolderList = ({ children, classNames }: FolderListProps) => {
    const { resources, resourcesQuery } = useGlobalContext()

    const folders = resources?.resources.folders.data
    const isLoading = resourcesQuery.isFetching

    if (children && typeof children === "function") {
        return children({ folders, isLoading })
    } else if (children) {
        return <>{children}</>
    }

    const folderClassNames = {
        item: classNames?.item,
        actionListTrigger: classNames?.actionListTrigger,
        actionList: classNames?.actionList,
        actionListItem: classNames?.actionListItem,
    }

    if (folders && folders.length >= 1)
        return (
            <div className={classNames?.container}>
                {folders.map((folder) => (
                    <Folder key={folder.path} classNames={folderClassNames} folder={folder}/>
                ))}
            </div>
        )

    return null
}
