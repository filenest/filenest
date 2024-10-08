"use client"

import { createContext, useContext } from "react"
import type { Folder } from "@filenest/core"
import { useGlobalContext } from "../global/GlobalContext"

export interface NavigationContext {
    navigation: Folder[]
    navigateTo: (folder: Folder) => void
}

const NavigationContext = createContext<NavigationContext | null>(null)

export const useNavigationContext = () => {
    const context = useContext(NavigationContext)
    if (!context) {
        throw new Error("useNavigationContext must be used within a Filenest.Navigation component.")
    }
    return context
}

interface NavigationProviderProps {
    children: React.ReactNode
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {
    const { navigateTo, navigation } = useGlobalContext()

    const contextValue = {
        navigation,
        navigateTo,
    }

    return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}
