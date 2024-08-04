"use client"

import type { Folder as FolderType } from "@filenest/core"
import { FolderProvider, useFolderContext, type FolderInternals } from "../context/local/FolderContext"
import { useGlobalContext } from "../context/global/GlobalContext"
import { Slot } from "@radix-ui/react-slot"
import type { WithoutChildren } from "../utils/types"

interface RenderProps {
    isLoading: boolean
    isRenaming: boolean
    stopPropagate: {
        onClick: (e: React.MouseEvent) => void
    }
}

export interface FolderProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    folder: FolderType
    asChild?: boolean
}

const FolderWrapper = ({ children, folder, ...props }: FolderProps) => {
    return (
        <FolderProvider folder={folder}>
            <Folder children={children} {...props}/>
        </FolderProvider>
    )
}

const Folder = ({ children, asChild, ...props }: Omit<FolderProps, "folder">) => {
    const { navigateTo, isLoading, isRenaming } = useFolderContext()

    const stopPropagate = {
        onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
        },
    }

    const Comp = asChild ? Slot : "div"

    function getChildren() {
        if (typeof children === "function") {
            return children({ isLoading, isRenaming, stopPropagate })
        }

        return children
    }

    return <Comp {...props} onClick={navigateTo}>{getChildren()}</Comp>
}

export interface FolderActionTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
    action: "remove" | "rename" | "navigateTo"
    asChild?: boolean
}

const FolderActionTrigger = ({ action, asChild, ...props }: FolderActionTriggerProps) => {
    const { remove, rename, navigateTo, isLoading, isRenaming } = useFolderContext()

    const actions = {
        remove,
        rename,
        navigateTo,
    }

    function onClick(e: React.MouseEvent) {
        e.stopPropagation()
        e.preventDefault()
        actions[action]()
    }

    const disabled = isLoading ||  isRenaming

    const Comp = asChild ? Slot : "button"

    return <Comp {...props} onClick={onClick} disabled={disabled}/>
}

export interface FolderCreateTriggerProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
}

const FolderCreateTrigger = ({ asChild, ...props }: FolderCreateTriggerProps) => {
    const { addFolderToCurrDir, currentFolder } = useGlobalContext()

    function createFolder() {
        const name = "__filenest-temporary-" + Date.now().toString()
        addFolderToCurrDir(
            {
                id: name,
                name: "",
                path: currentFolder.path + "/" + name,
            },
            {
                isRenaming: true,
            }
        )
    }

    const Comp = asChild ? Slot : "button"

    return <Comp {...props} onClick={createFolder} />
}

export { FolderWrapper as Folder, FolderActionTrigger, FolderCreateTrigger }
