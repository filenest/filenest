"use client"

import { useResourceName } from "../utils/useResourceName"

interface ResourceNameProps {
    className?: string
}

export const ResourceName = ({ className }: ResourceNameProps) => {
    const { isRenaming, ref, handleKeyDown, newName, setNewName, name } = useResourceName()

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
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
        )
    }

    return <div className={className}>{name}</div>
}
