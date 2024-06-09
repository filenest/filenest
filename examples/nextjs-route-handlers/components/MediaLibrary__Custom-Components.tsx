"use client"

import { Filenest } from "@filenest/react"
import { Fragment } from "react"

export const MediaLibrary = ({
    uploadMultiple = false,
    dialogTrigger,
    renderMode
}: {
    uploadMultiple?: boolean
    dialogTrigger: React.ReactNode
    renderMode: string
}) => {
    return (
        <Filenest.Root
            bundle={MediaLibraryBundle}
            dialog={MediaLibraryDialog}
            dialogTrigger={dialogTrigger}
            uploader={MediaLibraryUploader}
            uploadMultiple={uploadMultiple}
            renderMode={renderMode}
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

            <Filenest.Navigation>
                {({ navigation, navigateTo }) => (
                    {navigation.map((folder, index) => (
                        <Fragment>
                            <div key={folder.path} className="" onClick={() => navigateTo(folder)}>
                                {folder.name}
                            </div>
                            {index < navigation.length - 1 && <span>/</span>}
                        </Fragment>
                    ))}
                )}
            </Filenest.Navigation>

            <Filenest.FolderList>
                {({ folders, navigateTo }) => (
                    {folders.map((folder) => (
                        <Filenest.Folder key={folder.path} className="" onClick={() => navigateTo(folder)}>
                            {folder.name}
                            // Add folder actions here
                        </Filenest.Folder>
                    ))}
                )}
            </Filenest.FolderList>

            <Filenest.AssetList>
                <Filenest.DragDropIndicator>
                    Drop files to upload
                </Filenest.DragDropIndicator>
                {({ assets }) => (
                    {assets.map((asset) => (
                        <Filenest.Asset key={asset.id} asset={asset} />
                    ))}
                )}
            </Filenest.AssetList>
            <Filenest.AssetDetails />
        </Filenest.Bundle>
    )
}
