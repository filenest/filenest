"use client"

import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/global/GlobalContext"

export interface LoadMoreProps extends React.ComponentPropsWithoutRef<"button"> {
    asChild?: boolean
}

// Maybe replace this with infinite scroll later
export const LoadMore = ({ asChild, ...props }: LoadMoreProps) => {
    const { resourcesQuery } = useGlobalContext()

    const Comp = asChild ? Slot : "button"

    function onClick() {
        resourcesQuery.fetchNextPage()
    }

    if (!resourcesQuery.hasNextPage) return null

    return <Comp {...props} onClick={onClick}/>
}
