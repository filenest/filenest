"use client"

import { createContext, useContext, useState } from "react"
import type {  Folder } from "@filenest/handlers"
import { useGlobalContext } from "./GlobalContext"

export interface NavigationContext {
    navigation: Folder[]
    navigateTo: (folder: Folder) => void
}

const NavigationContext = createContext<NavigationContext | null>(null)

export const useNavigationContext = () => {
    const context = useContext(NavigationContext)
    if (!context) {
        throw new Error("A Filenest.Navigation must be used within a Filenest.Bundle component.")
    }
    return context
}

interface NavigationProviderProps {
    children: React.ReactNode
}

export const NavigationProvider = ({ children }: NavigationProviderProps) => {

    const { navigateTo } = useGlobalContext()

    const [navigation, setNavigation] = useState<Folder[]>([{ id: "home", path: "", name: "Home" }])

    function navigateFolder(folder: Folder) {
        navigateTo(folder)
        setNavigation((curr) => {
            const index = curr.findIndex((f) => f.path === folder.path)
            return index === -1 ? [...curr, folder] : curr.slice(0, index + 1)
        })
    }

    const contextValue = {
        navigation,
        navigateTo: navigateFolder,
    }

    return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>
}
