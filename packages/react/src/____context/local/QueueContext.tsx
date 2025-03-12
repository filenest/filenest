"use client"

import { createContext, useContext } from "react"

export interface QueueContext {
    references: string
}

const QueueContext = createContext<QueueContext | null>(null)

export const useQueueContext = () => {
    const context = useContext(QueueContext)
    if (!context) {
        throw new Error("useQueueContext must be used within a Filenest.Queue component.")
    }
    return context
}

interface QueueProviderProps {
    references: string
    children: React.ReactNode
}

export const QueueProvider = ({ children, references }: QueueProviderProps) => {
    const contextValue = {
        references
    }

    return <QueueContext.Provider value={contextValue}>{children}</QueueContext.Provider>
}
