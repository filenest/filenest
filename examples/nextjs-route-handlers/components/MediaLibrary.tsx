"use client"

import { cn } from "@/lib/cn"
import { prettyFilesize } from "@/lib/prettyFilesize"
import { Filenest } from "@filenest/react"
import { IconEdit, IconFilePlus, IconPlus, IconTrash } from "@tabler/icons-react"
import { Fragment } from "react"

export const MediaLibrary = () => {
    return (
        <Filenest.Root endpoint="/api/media">
            <h2>My Media</h2>

            <Filenest.AlertDialog>
                <Filenest.AlertDialogOverlay className="fixed z-10 bg-black bg-opacity-30 w-full h-full top-0 left-0" />
                <Filenest.AlertDialogContent className="fixed z-20 bg-white p-8 rounded-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Filenest.AlertDialogTitle className="text-xl text-gray-800 font-semibold" />
                    <Filenest.AlertDialogText className="mt-2 mb-4" />
                    <div className="flex gap-2">
                        <Filenest.AlertDialogCancel className="py-2 px-3 rounded bg-gray-300 hover:bg-gray-200 cursor-pointer" />
                        <Filenest.AlertDialogAction className="py-2 px-3 rounded bg-red-400 hover:bg-red-300 cursor-pointer" />
                    </div>
                </Filenest.AlertDialogContent>
            </Filenest.AlertDialog>

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
                            Array.from({ length: 3 }).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-40 h-[50px] border border-gray-300 bg-gray-100 animate-pulse rounded"
                                />
                            ))}
                        {!isLoading && (
                            <Fragment>
                                {folders?.map((folder) => (
                                    <Filenest.Folder key={folder.id} folder={folder} asChild>
                                        {({ isLoading }) => (
                                            <div className="px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                                                <div className="flex gap-1">
                                                    {isLoading ? "🔄" : "📁"}
                                                    <Filenest.ResourceName />
                                                </div>
                                                <div className="flex gap-1">
                                                    <Filenest.FolderActionTrigger
                                                        action="rename"
                                                        className="hover:underline"
                                                    >
                                                        <IconEdit className="text-gray-600" size={20} />
                                                    </Filenest.FolderActionTrigger>
                                                    <Filenest.FolderActionTrigger
                                                        action="remove"
                                                        className="hover:underline"
                                                    >
                                                        <IconTrash className="text-gray-600" size={20} />
                                                    </Filenest.FolderActionTrigger>
                                                </div>
                                            </div>
                                        )}
                                    </Filenest.Folder>
                                ))}
                                <Filenest.FolderCreateTrigger className="flex gap-1 items-center px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
                                    <IconPlus className="text-gray-600" />
                                    Create Folder
                                </Filenest.FolderCreateTrigger>
                            </Fragment>
                        )}
                    </div>
                )}
            </Filenest.FolderList>

            <div className="grid grid-cols-[auto_300px] items-start gap-8 relative">
                <Filenest.AssetList>
                    {({ assets, isLoading, isLoadingMore }) => (
                        <div className="relative">
                            <Filenest.DropIndicator className="absolute w-full h-full bg-green-300 flex items-center justify-center rounded-lg bg-opacity-50" />
                            <Filenest.DropIndicator className="fixed z-10 p-4 rounded bg-blue-300 bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
                                <IconFilePlus /> Drop files to upload
                            </Filenest.DropIndicator>
                            <div className="my-4">{isLoading ? null : `Showing ${assets?.length} assets`}</div>
                            <div className="grid grid-cols-4 gap-6">
                                {!isLoading &&
                                    assets?.map((asset) => (
                                        <Filenest.Asset
                                            key={asset.assetId}
                                            asset={asset}
                                            className={cn(
                                                "p-2 flex flex-col rounded-lg border border-gray-300 cursor-pointer hover:bg-gray-100",
                                                asset.isLoading && "animate-pulse"
                                            )}
                                        >
                                            {asset.type == "image" ? (
                                                <img
                                                    // Apply transformations to make asset list less resource intensive
                                                    src={asset.url.split("upload/").join("upload/w_300,h_300,c_fill/")}
                                                    alt={asset.name}
                                                    className="aspect-square w-full object-cover rounded-md"
                                                />
                                            ) : (
                                                <div className="text-xl uppercase flex items-center justify-center rounded bg-gray-100 size-24 mx-auto mt-8 mb-auto">
                                                    .{asset.format}
                                                </div>
                                            )}
                                            <Filenest.ResourceName className="font-semibold text-gray-800 truncate mt-1" />
                                            <div className="flex gap-2 text-sm">
                                                <div className="uppercase">{asset.format}</div>
                                                <div>{prettyFilesize(asset.bytes)}</div>
                                            </div>
                                        </Filenest.Asset>
                                    ))}
                                {(isLoading || isLoadingMore) &&
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-[250px] border border-gray-300 bg-gray-100 animate-pulse rounded-lg"
                                        />
                                    ))}
                            </div>
                            <div className="flex justify-center mt-8">
                                <Filenest.LoadMore className="py-2 px-3 rounded bg-gray-300 hover:bg-gray-200 cursor-pointer">
                                    Load more
                                </Filenest.LoadMore>
                            </div>
                        </div>
                    )}
                </Filenest.AssetList>
                <Filenest.AssetDetails>
                    {({ asset }) => (
                        <div className="mt-14 sticky top-8 pl-8 border-l border-gray-300">
                            {asset && (
                                <Filenest.Asset asset={asset}>
                                    {asset.type == "image" ? (
                                        <img src={asset.url} alt={asset.name} className="rounded-md" />
                                    ) : (
                                        <div className="text-xl uppercase flex items-center justify-center rounded bg-gray-100 h-48">
                                            .{asset.format}
                                        </div>
                                    )}
                                    <Filenest.AssetActionTrigger action="rename" asChild>
                                        <Filenest.ResourceName className="font-semibold text-gray-800 mt-2 text-wrap hover:bg-gray-100" />
                                    </Filenest.AssetActionTrigger>
                                    <div className="flex gap-2 text-sm mt-2">
                                        <div className="uppercase">{asset.format}</div>
                                        <div>{prettyFilesize(asset.bytes)}</div>
                                    </div>
                                    <div className="text-sm">
                                        {asset.width}x{asset.height}
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Filenest.AssetActionTrigger
                                            action="select"
                                            className="py-2 px-3 rounded bg-green-400 hover:bg-green-300 cursor-pointer flex-grow"
                                        >
                                            Select
                                        </Filenest.AssetActionTrigger>
                                        <Filenest.AssetActionTrigger
                                            action="remove"
                                            className="py-2 px-3 rounded bg-red-400 hover:bg-red-300 cursor-pointer"
                                        >
                                            <IconTrash />
                                        </Filenest.AssetActionTrigger>
                                    </div>
                                </Filenest.Asset>
                            )}
                            {!asset && <div>No asset selected</div>}
                        </div>
                    )}
                </Filenest.AssetDetails>
            </div>
        </Filenest.Root>
    )
}