"use client"

import { GlobalProvider } from "../context/GlobalContext"
import type { RenderMode } from "../utils/types"

type FilenestBaseProps<R extends RenderMode> = {
    bundle: React.ReactNode
    dialog: React.ReactNode
    endpoint: string
    renderMode: R
    uploader: React.ReactNode
}

export type FilenestRootProps<R extends RenderMode> = R extends "dialog"
    ? FilenestBaseProps<R> & { dialogTrigger: React.ReactNode, uploadMultiple?: never }
    : R extends "uploader"
    ? FilenestBaseProps<R> & { uploadMultiple: boolean,  dialogTrigger?: never}
    : FilenestBaseProps<R> & { dialogTrigger?: never, uploadMultiple?: never }

export const Root = <R extends RenderMode,>({
    bundle,
    dialog,
    dialogTrigger,
    endpoint,
    renderMode,
    uploader,
    uploadMultiple
}: FilenestRootProps<R>) => {
    const config = {
        endpoint,
        renderMode,
        uploadMultiple,
        dialogTrigger
    }

    return (
        <GlobalProvider config={config}>
            {renderMode === "bundle" && bundle}
            {renderMode === "dialog" && dialog}
            {renderMode === "uploader" && uploader}
        </GlobalProvider>
    )
}