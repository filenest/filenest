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
            <h2 className="mb-4">My Media</h2>

            <Filenest.Navigation
                classNames={{
                    container: "mb-4 flex gap-1 items-center",
                    item: "px-2 py-1 rounded cursor-pointer hover:bg-gray-100",
                    seperator: ""
                }}
            />

            <Filenest.FolderList
                classNames={{
                    container: "flex gap-2",
                    item: "flex items-center gap-2 px-2 py-1 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer",
                    actionListTrigger: "text-lg after:content-['≡']"
                }}
            />

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
