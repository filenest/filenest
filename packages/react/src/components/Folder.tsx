"use client"

import type { Folder as FolderType } from "@filenest/handlers"
import { useGlobalContext } from "../context/GlobalContext"

interface RenderProps {
    actions: {
        delete: () => void
        rename: () => void
    }
    state: {
        isRenaming: boolean
        isLoading: boolean
    }
}

interface FolderProps {
    children?: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    folder: FolderType
    classNames?: {
        item?: string
        actionListTrigger?: string
        actionList?: string
        actionListItem?: string
    }
}

export const Folder = ({ children, folder, classNames }: FolderProps) => {
    const { navigateTo } = useGlobalContext()

    const actions = {
        async delete() {},
        async rename() {},
    }

    const state = {
        isRenaming: false,
        isLoading: false,
    }

    if (children && typeof children === "function") {
        return <div onClick={() => navigateTo(folder)}>{children({ actions, state })}</div>
    }

    return (
        <div onClick={() => navigateTo(folder)} className={classNames?.item}>
            {folder.name}
            <div className={classNames?.actionListTrigger}></div>
        </div>
    )
}
