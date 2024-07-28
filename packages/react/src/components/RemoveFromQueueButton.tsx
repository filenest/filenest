"use client"

import { Slot } from "@radix-ui/react-slot"
import { type QueueFile, useFileQueueContext } from "../context/global/FileQueueContext"

export interface RemoveFromQueueButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
    file: QueueFile
}

export const RemoveFromQueueButton = ({ asChild, file, ...props }: RemoveFromQueueButtonProps) => {
    const { removeFromQueue } = useFileQueueContext()

    function onClick() {
        removeFromQueue(file.uploaderName, file.file.name)
    }

    const Comp = asChild ? Slot : "button"

    return (
        <Comp {...props} onClick={onClick}/>
    )
}