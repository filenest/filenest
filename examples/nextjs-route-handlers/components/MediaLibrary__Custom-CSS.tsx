"use client"

import { Filenest } from "@filenest/react"

export const MediaLibrary = ({
    uploadMultiple,
    dialogTrigger,
}: {
    uploadMultiple: boolean
    dialogTrigger: React.ReactNode
}) => {
    return (
        <Filenest.Root
            bundle={MediaLibraryBundle}
            dialog={MediaLibraryDialog}
            dialogTrigger={dialogTrigger}
            uploader={MediaLibraryUploader}
            uploadMultiple={uploadMultiple}
        />
    )
}

const MediaLibraryUploader = () => {
    return <Filenest.Uploader onUpload={} />
}

const MediaLibraryDialog = () => {
    return <Filenest.Dialog onSelect={} />
}

const MediaLibraryBundle = () => {
    return (
        <Filenest.Bundle>
            <h2>My Media</h2>
            <Filenest.Navigation />
            <Filenest.FolderList />
            <Filenest.AssetList />
            <Filenest.AssetDetails />
        </Filenest.Bundle>
    )
}
