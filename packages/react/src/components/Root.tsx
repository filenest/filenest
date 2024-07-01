"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { GlobalProvider } from "../context/GlobalContext"
import type { RenderMode } from "../utils/types"
import type { labels } from "../utils/labels"

type FilenestBaseProps<R extends RenderMode> = {
    bundle: React.ReactNode
    dialog: React.ReactNode
    endpoint: string
    endpointIsTRPC?: boolean
    renderMode: R
    uploader: React.ReactNode
    labels?: Partial<typeof labels>
}

export type FilenestRootProps<R extends RenderMode> = R extends "dialog"
    ? FilenestBaseProps<R> & { dialogTrigger: React.ReactNode; uploadMultiple?: never }
    : R extends "uploader"
    ? FilenestBaseProps<R> & { uploadMultiple?: boolean; dialogTrigger?: never }
    : FilenestBaseProps<R> & { dialogTrigger?: never; uploadMultiple?: never }

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
})

export const Root = <R extends RenderMode>({
    bundle,
    dialog,
    dialogTrigger,
    endpoint,
    endpointIsTRPC = false,
    renderMode,
    uploader,
    uploadMultiple,
}: FilenestRootProps<R>) => {
    const config = {
        endpoint,
        endpointIsTRPC,
        renderMode,
        uploadMultiple,
        dialogTrigger,
    }

    return (
        <QueryClientProvider client={queryClient}>
            <GlobalProvider config={config}>
                {renderMode === "bundle" && bundle}
                {renderMode === "dialog" && dialog}
                {renderMode === "uploader" && uploader}
            </GlobalProvider>
        </QueryClientProvider>
    )
}
