"use client"

import { Slot } from "@radix-ui/react-slot"

export interface DropIndicatorProps extends React.ComponentPropsWithoutRef<"div"> {
    asChild?: boolean
}

export const DropIndicator = ({ asChild, ...props }: DropIndicatorProps) => {

    const Comp = asChild ? Slot : "div"

    return <Comp {...props} />
}
