"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"
import type { WithoutChildren } from "../utils/types"

interface RenderProps {
    isLoading: boolean
}

export interface ReloadButtonProps extends WithoutChildren<React.ComponentPropsWithoutRef<"button">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

export const ReloadButton = ({ asChild, children, ...props }: ReloadButtonProps) => {
    const { resourcesQuery } = useGlobalContext()

    const Comp = asChild ? Slot : "button"

    const disabled = resourcesQuery.isFetching

    function onClick() {
        resourcesQuery.refetch()
    }

    function getChildren() {
        if (typeof children === "function") {
            return children({ isLoading: disabled })
        }

        return children
    }

    return (
        <Comp {...props} onClick={onClick} disabled={disabled}>
            {getChildren()}
        </Comp>
    )
}
