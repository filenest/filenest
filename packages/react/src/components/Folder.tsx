"use client"

import type { Folder as FolderType } from "@filenest/handlers"
import { FolderProvider, useFolderContext, type FolderInternals } from "../context/FolderContext"
import { useEffect, useRef } from "react"
import { useClickOutside } from "../utils/useClickOutside"
import { useMergedRef } from "../utils/useMergedRef"
import { useGlobalContext } from "../context/GlobalContext"

interface RenderProps extends Omit<FolderInternals, "_internal"> {
    stopPropagate: {
        onClick: (e: React.MouseEvent) => void
    }
}

interface FolderProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
    folder: FolderType
}

const FolderWrapper = ({ children, folder }: FolderProps) => {
    return (
        <FolderProvider folder={folder}>
            <Folder children={children} />
        </FolderProvider>
    )
}

const Folder = ({ children }: Pick<FolderProps, "children">) => {
    const { remove, rename, navigateTo, isLoading, isRenaming } = useFolderContext()

    const stopPropagate = {
        onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
        },
    }

    if (typeof children === "function") {
        return children({ remove, rename, navigateTo, isLoading, isRenaming, stopPropagate })
    }

    return children
}

interface FolderNameProps {
    className?: string
}

const FolderName = ({ className }: FolderNameProps) => {
    const { folder, isRenaming, _internal, rename, create } = useFolderContext()
    const { removeFolderFromCurrDir } = useGlobalContext()

    const inputRef = useRef<HTMLInputElement>(null)
    const clickOutsideRef = useClickOutside(() => {
        if (isRenaming && _internal._newName.length >= 1) {
            if (isTemporary) {
                create()
            } else {
                rename()
            }
        } else {
            _internal._resetRename()
            removeIfTemporary()
        }
    })

    const isTemporary = folder.id.includes("__filenest-temporary")

    function removeIfTemporary() {
        if (isTemporary) {
            removeFolderFromCurrDir(folder.id)
        }
    }

    const ref = useMergedRef(inputRef, clickOutsideRef)

    useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isRenaming])

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            if (isTemporary) {
                create()
            } else {
                rename()
            }
        } else if (e.key === "Escape") {
            _internal._resetRename()
            removeIfTemporary()
        }
    }

    if (isRenaming) {
        return (
            <input
                type="text"
                ref={ref}
                className={className}
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                }}
                onKeyDown={handleKeyDown}
                value={_internal._newName}
                onChange={(e) => _internal._setNewName(e.target.value)}
            />
        )
    }

    return <div className={className}>{folder.name}</div>
}

interface FolderActionTriggerProps {
    action: "remove" | "rename" | "navigateTo"
    children: React.ReactNode
    className?: string
}

const FolderActionTrigger = ({ action, children, className }: FolderActionTriggerProps) => {
    const { remove, rename, navigateTo } = useFolderContext()

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

    return (
        <div onClick={onClick} className={className}>
            {children}
        </div>
    )
}

interface FolderCreateTriggerProps {
    children: React.ReactNode
    className?: string
}

const FolderCreateTrigger = ({ children, className }: FolderCreateTriggerProps) => {
    const { addFolderToCurrDir, currentFolder } = useGlobalContext()

    function createFolder() {
        const name = "__filenest-temporary-" + Date.now().toString()
        addFolderToCurrDir({
            id: name,
            name: "",
            path: currentFolder.path + "/" + name,
        }, {
            isRenaming: true,
        })
    }

    return (
        <div className={className} onClick={createFolder}>
            {children}
        </div>
    )
}

export { FolderWrapper as Folder, FolderName, FolderActionTrigger, FolderCreateTrigger }
