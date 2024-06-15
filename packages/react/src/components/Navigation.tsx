"use client"

import { NavigationProvider, useNavigationContext } from "../context/NavigationContext"

const NavigationWrapper = (props: NavigationProps) => {
    return (
        <NavigationProvider>
            <Navigation {...props} />
        </NavigationProvider>
    )
}

interface RenderProps {
    navigateTo: ReturnType<typeof useNavigationContext>["navigateTo"]
    navigation: ReturnType<typeof useNavigationContext>["navigation"]
}

interface NavigationProps {
    children: ((props: RenderProps) => React.ReactNode) | React.ReactNode
}

const Navigation = ({ children }: NavigationProps) => {
    const { navigateTo, navigation } = useNavigationContext()

    if (typeof children === "function") {
        return children({ navigateTo, navigation })
    }

    return children
}

export { NavigationWrapper as Navigation }
