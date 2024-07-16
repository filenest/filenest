"use client"

import type { Folder } from "@filenest/core"
import { NavigationProvider, useNavigationContext } from "../context/NavigationContext"
import { Slot } from "@radix-ui/react-slot"
import { useGlobalContext } from "../context/GlobalContext"

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

export interface NavigationProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const Navigation = ({ children }: NavigationProps) => {
    const { navigation } = useNavigationContext()

    if (typeof children === "function") {
        return children({ navigation })
    }

    return children
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