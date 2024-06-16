"use client"

import type { Folder as FolderType } from "@filenest/handlers"
import { FolderProvider, useFolderContext, type FolderInternals } from "../context/FolderContext"
import { useEffect, useRef } from "react"
import { useClickOutside } from "../utils/useClickOutside"
import { useMergedRef } from "../utils/useMergedRef"

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

    const inputRef = useRef<HTMLInputElement>(null)
    const clickOutsideRef = useClickOutside(() => {
        if (state.isRenaming && _internal._newName.length >= 1) {
            actions.rename()
        } else {
            _internal._setNewName("")
            _internal._setIsRenaming(false)
        }
    })

    const ref = useMergedRef(inputRef, clickOutsideRef)

    useEffect(() => {
        if (state.isRenaming && inputRef.current) {
            inputRef.current.focus()
        }
    }, [state.isRenaming])

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

export { FolderWrapper as Folder, FolderName, FolderEventTrigger }
