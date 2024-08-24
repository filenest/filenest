"use client"

import * as Primitive from "@radix-ui/react-alert-dialog"
import { useGlobalContext } from "../../context/global/GlobalContext"
import { cloneElement, isValidElement } from "react"

export const AlertDialog = ({ children, ...props }: Primitive.AlertDialogProps) => {
    const { alertDialog } = useGlobalContext()

    return (
        <Primitive.Root {...props} open={alertDialog.open} onOpenChange={alertDialog.setOpen}>
            <Primitive.Portal>
                {children}
            </Primitive.Portal>
        </Primitive.Root>
    )
}

export const AlertDialogTitle = ({ className }: Primitive.AlertDialogTitleProps) => {
    const { alertDialog } = useGlobalContext()
    return (
        <Primitive.AlertDialogTitle className={className} asChild>
            <h3>{alertDialog.content.title}</h3>
        </Primitive.AlertDialogTitle>
    )
}

export const AlertDialogText = ({ className }: { className?: string }) => {
    const { alertDialog } = useGlobalContext()
    return (
        <p className={className}>{alertDialog.content.text}</p>
    )
}

export const AlertDialogOverlay = ({ children, ...props }: Primitive.AlertDialogOverlayProps) => {
    return (
        <Primitive.Overlay {...props}/>
    )
}

export const AlertDialogContent = ({ children, ...props }: Primitive.AlertDialogContentProps) => {
    return (
        <Primitive.Content {...props}>
            {children}
        </Primitive.Content>
    )
}

export const AlertDialogCancel = ({ children, ...props }: Primitive.AlertDialogCancelProps) => {
    const { alertDialog } = useGlobalContext()

    const textLabel = alertDialog.content.cancel

    function getChildren() {
        if (isValidElement(children)) {
            return cloneElement(children, {}, textLabel)
        }
        return textLabel
    }

    if (alertDialog.cancel) {
        return (
            <Primitive.Action {...props} onClick={alertDialog.cancel}>
                {getChildren()}
            </Primitive.Action>
        )
    }

    return (
        <Primitive.Cancel {...props}>
            {getChildren()}
        </Primitive.Cancel>
    )
}

export const AlertDialogAction = ({ children, ...props }: Primitive.AlertDialogActionProps) => {
    const { alertDialog } = useGlobalContext()

    const textLabel = alertDialog.content.commit

    function getChildren() {
        if (isValidElement(children)) {
            return cloneElement(children, {}, textLabel)
        }
        return textLabel
    }

    return (
        <Primitive.Action {...props} onClick={alertDialog.action}>
            {getChildren()}
        </Primitive.Action>
    )
}