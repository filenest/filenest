"use client"

import { Filenest, FilenestRootProps } from "@filenest/react"
import { Fragment } from "react"

export const MediaLibrary = Filenest.Root

const MediaLibraryUploader = () => {
    return <Filenest.Uploader />
}

const MediaLibraryDialog = () => {
    return <Filenest.Dialog />
}

const MediaLibraryBundle = () => {
    return (
        <Filenest.Bundle>
            <h2>My Media</h2>

            <Filenest.Navigation>
                {({ navigateTo, navigation }) =>
                    navigation.map((folder, index) => (
                        <Fragment key={folder.path}>
                            <div onClick={() => navigateTo(folder)}>{folder.name}</div>
                            {index < navigation.length - 1 && <span>/</span>}
                        </Fragment>
                    ))
                }
            </Filenest.Navigation>

            <Filenest.FolderList>
                {({ folders, isLoading }) => {
                    if (isLoading) {
                        return Array.from({ length: 5 }).map((_, i) => <div key={i}>Loading...</div>)
                    }
                    return folders?.map((folder) => (
                        <Filenest.Folder key={folder.path} folder={folder}>
                            {folder.name}
                            // Add folder actions here
                        </Filenest.Folder>
                    ))
                }}
            </Filenest.FolderList>

            {/* <Filenest.AssetList>
                <Filenest.DragDropIndicator>
                    Drop files to upload
                </Filenest.DragDropIndicator>
                {({ assets }) => (
                    {assets.map((asset) => (
                        <Filenest.Asset key={asset.id} asset={asset} />
                    ))}
                )}
            </Filenest.AssetList>
            <Filenest.AssetDetails /> */}
        </Filenest.Bundle>
    )
}

export const config = {
    endpoint: "/api/media",
    bundle: <MediaLibraryBundle />,
    dialog: <MediaLibraryDialog />,
    uploader: <MediaLibraryUploader />,
} satisfies Partial<FilenestRootProps<any>>
