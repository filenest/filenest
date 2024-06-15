"use client"

import type { Folder as FolderType } from "@filenest/handlers"
import { useGlobalContext } from "../context/GlobalContext"

interface RenderProps {
    actions: {
        delete: () => void
        rename: () => void
        navigateTo: () => void
    }
    state: {
        isRenaming: boolean
        isLoading: boolean
    }
}

interface FolderProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    folder: FolderType
}

export const Folder = ({ children, folder }: FolderProps) => {
    const { navigateTo } = useGlobalContext()

    const actions = {
        async delete() {},
        async rename() {},
        navigateTo: () => navigateTo(folder),
    }

    const state = {
        isRenaming: false,
        isLoading: false,
    }


    if (typeof children === "function") {
        return children({ actions, state })
    }

    return children
}
