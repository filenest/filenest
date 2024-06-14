"use client"

import { useGlobalContext } from "../context/GlobalContext"
import type { Folder as FolderType } from "@filenest/handlers"
import { Folder } from "./Folder"

interface FolderListProps {
    children?: (({ folders }: { folders?: FolderType[] }) => React.ReactNode) | React.ReactNode
    classNames?: {
        container?: string
        item?: string
    }
}

export const FolderList = ({ children, classNames }: FolderListProps) => {
    const { resources } = useGlobalContext()

    const folders = resources?.resources.folders.data

    if (children && typeof children === "function") {
        return children({ folders })
    } else if (children) {
        return <>{children}</>
    }

    if (folders && folders.length >= 1)
        return (
            <div className={classNames?.container}>
                {folders.map((folder) => (
                    <Folder key={folder.path} className={classNames?.item} folder={folder}>
                        {folder.name}
                        <div>&equiv;</div>
                    </Folder>
                ))}
            </div>
        )

    return null
}
