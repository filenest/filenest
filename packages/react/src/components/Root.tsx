"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GlobalProvider } from "../context/global/GlobalContext"
import type { labels } from "../utils/labels"
import type { Asset } from "@filenest/core"

export type RootProps = {
    children: React.ReactNode
    endpoint: string
    endpointIsTRPC?: boolean
    labels?: Partial<Record<keyof typeof labels, string>>
    onAssetSelect?: (asset: Asset) => void
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

export const Root = (props: RootProps) => {
    return (
        <QueryClientProvider client={queryClient}>
            <GlobalProvider {...props}/>
        </QueryClientProvider>
    )
}
