"use client"

import { Slot } from "@radix-ui/react-slot"
import { useFileQueueContext } from "../context/global/FileQueueContext"
import { useQueueContext } from "../context/local/QueueContext"

export interface ClearQueueButtonProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
}

export const ClearQueueButton = ({ asChild, ...props }: ClearQueueButtonProps) => {
    const { clearQueue } = useFileQueueContext()
    const { references } = useQueueContext()

    function onClick() {
        clearQueue(references)
    }

    const Comp = asChild ? Slot : "button"

    return (
        <Comp {...props} onClick={onClick}/>
    )
}