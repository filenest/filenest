"use client"

import { useGlobalContext } from "../context/GlobalContext"
import { useResourceName } from "../utils/useResourceName"

export interface ResourceNameProps extends React.HTMLAttributes<HTMLElement> {
    className?: string
}

export const ResourceName = ({ className, onClick }: ResourceNameProps) => {
    const { isRenaming, ref, handleKeyDown, newName, setNewName, name } = useResourceName()
    const { _l } = useGlobalContext()

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

    return <div className={className} onClick={onClick} title={_l("hint.clickToRename")}>{name}</div>
}
