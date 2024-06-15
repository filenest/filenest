"use client"

import { Filenest, FilenestRootProps } from "@filenest/react"
import { count } from "console"
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
                {({ folders, isLoading }) => (
                    <div className="flex gap-2">
                        {isLoading
                            ? Array.from({ length: 5 }).map((_, i) => (
                                  <div
                                      key={i}
                                      className="w-24 h-[34px] border border-gray-300 bg-gray-100 animate-pulse rounded"
                                  />
                              ))
                            : folders?.map((folder) => (
                                  <Filenest.Folder key={folder.path} folder={folder}>
                                      {({ actions, state }) => (
                                          <div
                                              onClick={actions.navigateTo}
                                              className="px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100"
                                          >
                                              {state.isLoading ? "🔄" : "📁"}
                                              {folder.name}
                                          </div>
                                      )}
                                  </Filenest.Folder>
                              ))}
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
