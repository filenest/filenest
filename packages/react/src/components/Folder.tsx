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
    className?: string
}

export const Folder = ({ children, folder, className }: FolderProps) => {
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
    } else if (children) {
        return <div onClick={() => navigateTo(folder)}>{children}</div>
    }

    return (
        <div onClick={() => navigateTo(folder)} className={className}>
            {folder.name}
        </div>
    )
}
