"use client"

import type { Folder as FolderType } from "@filenest/handlers"
import { FolderProvider, useFolderContext, type FolderInternals } from "../context/FolderContext"
import { useEffect, useRef } from "react"
import { useClickOutside } from "../utils/useClickOutside"
import { useMergedRef } from "../utils/useMergedRef"
import { useFolderListContext } from "../context/FolderListContext"
import { createFolder } from "../utils/fetchers"
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
    const { actions, state } = useFolderContext()

    const stopPropagate = {
        onClick: (e: React.MouseEvent) => {
            e.stopPropagation()
            e.preventDefault()
        },
    }

    if (typeof children === "function") {
        return children({ actions, state, stopPropagate })
    }

    return children
}

interface FolderNameProps {
    className?: string
}

const FolderName = ({ className }: FolderNameProps) => {
    const { folder, state, actions, _internal } = useFolderContext()
    const { endpoint, currentFolder, setResources } = useGlobalContext()

    const inputRef = useRef<HTMLInputElement>(null)
    const clickOutsideRef = useClickOutside(() => {
        if (state.isRenaming && _internal._newName.length >= 1) {
            if (isTemporary) {
                createNewFolder()
            } else {
                actions.rename()
            }
        } else {
            _internal._resetRename()
            removeIfTemporary()
        }
    })

    const isTemporary = folder.id.includes("__filenest-temporary")

    function removeIfTemporary() {
        if (isTemporary) {
            _internal._removeFolderFromState(folder.id)
        }
    }

    const ref = useMergedRef(inputRef, clickOutsideRef)

    useEffect(() => {
        if (state.isRenaming && inputRef.current) {
            inputRef.current.focus()
        }
    }, [state.isRenaming])

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === "Enter") {
            if (isTemporary) {
                createNewFolder()
            } else {
                actions.rename()
            }
        } else if (e.key === "Escape") {
            _internal._resetRename()
            removeIfTemporary()
        }
    }

    async function createNewFolder() {
        if (_internal._newName.length < 1) return
        _internal._setIsLoading(true)
        try {
            const newFolder = await createFolder({
                endpoint,
                path: currentFolder.path + "/" + _internal._newName,
            })
            removeIfTemporary()
            setResources((prev) => {
                if (!prev) return prev
                const currentFolders = prev?.resources.folders.data
                return {
                    ...prev,
                    resources: {
                        ...prev.resources,
                        folders: {
                            ...prev.resources.folders,
                            data: [...currentFolders, newFolder].sort((a, b) => a.name.localeCompare(b.name)),
                        },
                    },
                }
            })
        } catch (error) {
            console.error("[Filenest] Error creating folder:", error)
        }
        _internal._setIsLoading(false)
    }

    if (state.isRenaming) {
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

interface FolderEventTriggerProps {
    action: keyof ReturnType<typeof useFolderContext>["actions"]
    children: React.ReactNode
    className?: string
}

const FolderEventTrigger = ({ action, children, className }: FolderEventTriggerProps) => {
    const { actions } = useFolderContext()

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
    const { createFolder } = useFolderListContext()

    return (
        <div className={className} onClick={createFolder}>
            {children}
        </div>
    )
}

export { FolderWrapper as Folder, FolderName, FolderEventTrigger, FolderCreateTrigger }
