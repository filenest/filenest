"use client"

import type { Folder } from "@filenest/core"
import { NavigationProvider, useNavigationContext } from "../context/local/NavigationContext"
import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/global/GlobalContext"
import type { WithoutChildren } from "../utils/types"

const NavigationWrapper = (props: NavigationProps) => {
    const { isGlobalSearch } = useGlobalContext()

    if (isGlobalSearch) return null

    return (
        <NavigationProvider>
            <Navigation {...props} />
        </NavigationProvider>
    )
}

interface RenderProps {
    navigation: ReturnType<typeof useNavigationContext>["navigation"]
}

export interface NavigationProps extends WithoutChildren<React.ComponentPropsWithoutRef<"div">> {
    asChild?: boolean
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const Navigation = ({ asChild, children, ...props }: NavigationProps) => {
    const { navigation } = useNavigationContext()

    const Comp = asChild ? Slot : "div"

    function getChildren() {
        if (typeof children === "function") {
            return children({ navigation })
        }

        return children
    }

    return <Comp {...props}>{getChildren()}</Comp>
}

export { NavigationWrapper as Navigation }

export interface NavigationItemProps extends React.ComponentPropsWithoutRef<"div"> {
    folder: Folder
    asChild?: boolean
}

export const NavigationItem = ({ folder, asChild, ...props }: NavigationItemProps) => {
    const { navigateTo } = useNavigationContext()

    const Comp = asChild ? Slot : "div"

    return (
        <Comp {...props} onClick={() => navigateTo(folder)}>
            {folder.name}
        </Comp>
    )
}
