"use client"

import { useGlobalContext } from "../context/global/GlobalContext"
import type { Folder as FolderType } from "@filenest/core"
import type { WithoutChildren } from "../utils/types"
import { Slot } from "@radix-ui/react-slot"

interface RenderProps {
    folders?: FolderType[]
    isLoading: boolean
}

export interface FolderListProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const FolderList = ({ asChild, children, ...props }: FolderListProps) => {
    const { resources, resourcesQuery, isGlobalSearch } = useGlobalContext()

    if (isGlobalSearch) return null

    const folders = resources?.resources.folders.data
    const isLoading = resourcesQuery.isLoading

    const Comp = asChild ? Slot : "div"

    function getChildren() {
        if (typeof children === "function") {
            return children({ folders, isLoading })
        }

        return children
    }

    return <Comp {...props}>{getChildren()}</Comp>
}
