"use client"

import { Fragment } from "react"
import { NavigationProvider, useNavigationContext } from "../context/NavigationContext"

const NavigationWrapper = (props: NavigationProps) => {
    return (
        <NavigationProvider>
            <Navigation {...props} />
        </NavigationProvider>
    )
}

interface NavigationProps {
    children?: ({
        navigateTo,
        navigation,
    }: {
        navigateTo: ReturnType<typeof useNavigationContext>["navigateTo"]
        navigation: ReturnType<typeof useNavigationContext>["navigation"]
    }) => React.ReactNode | React.ReactNode
    classNames?: {
        container?: string
        item?: string
        seperator?: string
    }
}

const Navigation = ({ children, classNames }: NavigationProps) => {
    const { navigateTo, navigation } = useNavigationContext()

    if (children) {
        return children({ navigateTo, navigation })
    }

    return (
        <div className={classNames?.container}>
            {navigation.map((folder, index) => (
                <Fragment key={folder.path}>
                    <div className={classNames?.item} onClick={() => navigateTo(folder)}>
                        {folder.name}
                    </div>
                    {index < navigation.length - 1 && <div className={classNames?.seperator}>/</div>}
                </Fragment>
            ))}
        </div>
    )
}

export { NavigationWrapper as Navigation }