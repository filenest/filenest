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
                {({ navigateTo, navigation }) => (
                    <div className="flex gap-1 my-4 items-center">
                        {navigation.map((folder, index) => (
                            <Fragment key={folder.path}>
                                <div
                                    onClick={() => navigateTo(folder)}
                                    className="py-1 px-2 hover:bg-gray-100 rounded cursor-pointer"
                                >
                                    {folder.name}
                                </div>
                                {index < navigation.length - 1 && <span>/</span>}
                            </Fragment>
                        ))}
                    </div>
                )}
            </Filenest.Navigation>

            <Filenest.FolderList>
                {({ folders, isLoading }) => (
                    <div className="flex gap-2 flex-wrap">
                        {isLoading &&
                            Array.from({ length: 5 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-28 p-2 h-[50px] border border-gray-300 bg-gray-100 animate-pulse rounded"
                                >
                                    <div className="rounded-sm animate-pulse bg-gray-400 h-4" />
                                </div>
                            ))}
                        {!isLoading && (
                            <Fragment>
                                {folders?.map((folder) => (
                                    <Filenest.Folder key={folder.id} folder={folder}>
                                        {({ navigateTo, isLoading, remove, rename }) => (
                                            <div
                                                onClick={navigateTo}
                                                className="px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
                                            >
                                                <div className="flex gap-1">
                                                    {isLoading ? "🔄" : "📁"}
                                                    <Filenest.FolderName />
                                                </div>
                                                <div className="flex gap-2 text-xs">
                                                    <Filenest.FolderActionTrigger
                                                        action="rename"
                                                        className="hover:underline"
                                                    >
                                                        Rename
                                                    </Filenest.FolderActionTrigger>
                                                    <Filenest.FolderActionTrigger
                                                        action="remove"
                                                        className="hover:underline"
                                                    >
                                                        Delete
                                                    </Filenest.FolderActionTrigger>
                                                </div>
                                            </div>
                                        )}
                                    </Filenest.Folder>
                                ))}
                                <Filenest.FolderCreateTrigger className="flex items-center px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                                    Create Folder
                                </Filenest.FolderCreateTrigger>
                            </Fragment>
                        )}
                    </div>
                )}
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
