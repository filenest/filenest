"use client"

import * as Primitive from "@radix-ui/react-alert-dialog"
import { useGlobalContext } from "../../context/GlobalContext"

export const AlertDialog = ({ children, ...props }: Primitive.AlertDialogProps) => {
    const { alertDialogOpen, setAlertDialogOpen } = useGlobalContext()

    return (
        <Primitive.Root {...props} open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
            <Primitive.Portal>
                {children}
            </Primitive.Portal>
        </Primitive.Root>
    )
}

export const AlertDialogTitle = ({ className }: Primitive.AlertDialogTitleProps) => {
    const { alertDialogContent } = useGlobalContext()
    return (
        <Primitive.AlertDialogTitle className={className} asChild>
            <h3>{alertDialogContent.title}</h3>
        </Primitive.AlertDialogTitle>
    )
}

export const AlertDialogText = ({ className }: { className?: string }) => {
    const { alertDialogContent } = useGlobalContext()
    return (
        <p className={className}>{alertDialogContent.text}</p>
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
    const { alertDialogContent } = useGlobalContext()

    return (
        <Primitive.Cancel asChild {...props}>
            <div>{alertDialogContent.cancel}</div>
        </Primitive.Cancel>
    )
}

export const AlertDialogAction = ({ children, ...props }: Primitive.AlertDialogActionProps) => {
    const { alertDialogContent, alertDialogAction } = useGlobalContext()

    return (
        <Primitive.Action asChild {...props} onClick={alertDialogAction}>
            <div>{alertDialogContent.commit}</div>
        </Primitive.Action>
    )
}