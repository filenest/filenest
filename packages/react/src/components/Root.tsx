"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GlobalProvider } from "../context/GlobalContext"
import type { labels } from "../utils/labels"

export type FilenestRootProps = {
    children: React.ReactNode
    endpoint: string
    endpointIsTRPC?: boolean
    labels?: Partial<typeof labels>
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

export const Root = (props: FilenestRootProps) => {

    return (
        <QueryClientProvider client={queryClient}>
            <GlobalProvider {...props}/>
        </QueryClientProvider>
    )
}
