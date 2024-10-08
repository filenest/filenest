"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createFetchers } from "../../utils/fetchers"
import { labels } from "../../utils/labels"
import { useDebouncedState } from "../../utils/useDebouncedState"
import { useInfiniteQuery, type UseInfiniteQueryResult, type InfiniteData } from "@tanstack/react-query"
import type { Asset, Folder, FolderWithResources, GetResourcesReturn } from "@filenest/core"
import type { AssetExtraProps, SetState } from "../../utils/types"
import type { RootProps } from "../../components/Root"

export interface GlobalContext {
    currentFolder: Folder
    endpoint: string
    endpointIsTRPC: boolean
    navigation: Folder[]
    navigateTo: (folder: Folder) => void
    resources?: FolderWithResources | undefined
    addFolderToCurrDir: (
        folder: Folder,
        initialState?: { isLoading?: boolean; isRenaming?: boolean },
        shouldSort?: boolean
    ) => void
    removeFolderFromCurrDir: (id: string, shouldSort?: boolean) => void
    resourcesQuery: UseInfiniteQueryResult<InfiniteData<GetResourcesReturn, unknown>>
    updateAsset: (
        assetId: string,
        updater: (current: Asset & AssetExtraProps) => Partial<Asset & AssetExtraProps>
    ) => void
    removeAssetFromCurrDir: (id: string) => void
    _l: (label: keyof typeof labels) => string
    alertDialog: {
        open: boolean
        setOpen: SetState<boolean>
        content: Partial<AlertDialogContent>
        setContent: (content: Partial<AlertDialogContent>) => void
        action: () => void
        setAction: SetState<() => void>
        cancel?: () => void
        setCancel: SetState<(() => void) | undefined>
    }
    detailedAsset: (Asset & AssetExtraProps) | null
    setDetailedAsset: SetState<(Asset & Partial<AssetExtraProps>) | null>
    fetchers: ReturnType<typeof createFetchers>
    searchQuery: string
    handleSearch: (query: string, location: "current" | "global") => void
    isGlobalSearch: boolean
    onAssetSelect?: (asset: Asset) => void
    selectedFiles: Asset[]
    setSelectedFiles: SetState<Asset[]>
    isToolbarBusy: boolean
    setIsToolbarBusy: SetState<boolean>
    onError?: (message: string) => void
}

const GlobalContext = createContext<GlobalContext | null>(null)

export const useGlobalContext = () => {
    const context = useContext(GlobalContext)
    if (!context) {
        throw new Error("A Filenest component must be used within a Filenest.Root component.")
    }
    return context
}

interface GlobalProviderProps extends RootProps {}

export const GlobalProvider = ({ children, ...props }: GlobalProviderProps) => {
    const { endpoint, endpointIsTRPC = false, onError } = props

    const fetchers = createFetchers({ endpoint, endpointIsTRPC, onError })

    const _labels = { ...labels, ...props.labels }
    function _l(label: keyof typeof labels): string {
        return _labels[label]
    }

    const DEFAULT_FOLDER = { id: "home", path: "", name: "Home" }
    const [currentFolder, setCurrentFolder] = useState<Folder>(DEFAULT_FOLDER)
    const [navigation, setNavigation] = useState<Folder[]>([DEFAULT_FOLDER])

    function navigateTo(folder: Folder) {
        if (folder.path === currentFolder.path) return
        setCurrentFolder(folder)
        setNavigation((curr) => {
            const index = curr.findIndex((f) => f.path === folder.path)
            return index === -1 ? [...curr, folder] : curr.slice(0, index + 1)
        })
    }

    const [searchQuery, setSearchQuery] = useDebouncedState("", 500)
    const [isGlobalSearch, setGlobalSearch] = useDebouncedState(false, 500)

    function handleSearch(query: string, location: "current" | "global") {
        if (location === "global" && query.length) {
            setGlobalSearch(true)
        } else if (location === "global" && query === "") {
            setGlobalSearch(false)
        } else if (location === "current") {
            setGlobalSearch(false)
        }
        setSearchQuery(query)
    }

    const queryKey = ["folderWithResources", currentFolder, searchQuery]

    const resourcesQuery = useInfiniteQuery({
        queryKey,
        queryFn: ({ pageParam }) => {
            setDetailedAsset(null)
            return fetchers.getResources({
                folder: currentFolder.path,
                nextCursor: pageParam,
                searchQuery,
                global: isGlobalSearch,
            })
        },
        initialPageParam: "",
        getNextPageParam: (lastPage) => lastPage.resources.assets.nextCursor,
    })

    const [data, setData] = useState<FolderWithResources>()

    useEffect(() => {
        if (resourcesQuery.data?.pages) {
            const newestResult = resourcesQuery.data.pages.at(-1)!
            setData({
                ...newestResult,
                resources: {
                    ...newestResult.resources,
                    assets: {
                        ...newestResult.resources.assets,
                        data: resourcesQuery.data.pages.flatMap((p) =>
                            p.resources.assets.data.map((a) => ({
                                ...a,
                                // Make sure assets are still selected when fetching more data
                                isSelected: selectedFiles.some((sf) => sf.assetId === a.assetId),
                            }))
                        ),
                    },
                },
            })
        }
    }, [resourcesQuery.isFetching])

    function updateAsset(
        assetId: string,
        updater: (current: Asset & AssetExtraProps) => Partial<Asset & AssetExtraProps>
    ) {
        setData((prev) => {
            if (!prev) return prev
            const currentAssets = prev.resources.assets.data
            const currentAsset = currentAssets.find((a) => a.assetId === assetId)
            if (!currentAsset) return prev
            const updatedData = updater(currentAsset as any /* fuck it */)
            const newAssets = currentAssets.map((a) => (a.assetId === assetId ? { ...a, ...updatedData } : a))
            return {
                ...prev,
                resources: {
                    ...prev.resources,
                    assets: {
                        ...prev.resources.assets,
                        data: newAssets,
                    },
                },
            }
        })
    }

    function addFolderToCurrDir(
        folder: Folder,
        initialState?: { isLoading?: boolean; isRenaming?: boolean },
        shouldSort?: boolean
    ) {
        setData((curr) => {
            if (!curr) return curr
            let folders = [...curr.resources.folders.data, { ...folder, ...initialState }]
            if (shouldSort) {
                folders = folders.sort((a, b) => a.name.localeCompare(b.name))
            }
            return {
                ...curr,
                resources: {
                    ...curr.resources,
                    folders: {
                        ...curr.resources.folders,
                        data: folders,
                    },
                },
            }
        })
    }

    function removeFolderFromCurrDir(id: string, shouldSort?: boolean) {
        setData((prev) => {
            if (!prev) return prev
            const currentFolders = prev.resources.folders.data
            let newFolders = currentFolders.filter((f) => f.id !== id)
            if (shouldSort) {
                newFolders = newFolders.sort((a, b) => a.name.localeCompare(b.name))
            }
            return {
                ...prev,
                resources: {
                    ...prev.resources,
                    folders: {
                        ...prev.resources.folders,
                        data: newFolders,
                    },
                },
            }
        })
    }

    function removeAssetFromCurrDir(id: string) {
        setData((prev) => {
            if (!prev) return prev
            const currentAssets = prev.resources.assets.data
            const newAssets = currentAssets.filter((a) => a.assetId !== id)
            return {
                ...prev,
                resources: {
                    ...prev.resources,
                    assets: {
                        ...prev.resources.assets,
                        data: newAssets,
                    },
                },
            }
        })
    }

    const [detailedAsset, setDetailedAsset] = useState<Asset | null>(null)

    const [alertDialogOpen, setAlertDialogOpen] = useState(false)
    const [alertDialogAction, setAlertDialogAction] = useState<() => void>(() => () => {})
    const [alertDialogCancel, setAlertDialogCancel] = useState<() => void>()
    const [alertDialogContent, _setAlertDialogContent] = useState<Partial<AlertDialogContent>>({
        title: "",
        text: "",
        cancel: _l("alert.folderNestedContent.cancel"),
        commit: _l("alert.folderNestedContent.commit"),
    })
    function setAlertDialogContent(content: Partial<AlertDialogContent>) {
        _setAlertDialogContent((prev) => ({ ...prev, ...content }))
    }

    const [selectedFiles, setSelectedFiles] = useState<Asset[]>([])

    useEffect(() => {
        setSelectedFiles([])
    }, [currentFolder])

    const [isToolbarBusy, setIsToolbarBusy] = useState(false)

    const contextValue = {
        currentFolder,
        endpoint,
        navigation,
        navigateTo,
        resources: data,
        addFolderToCurrDir,
        removeFolderFromCurrDir,
        updateAsset,
        removeAssetFromCurrDir,
        resourcesQuery,
        _l,
        alertDialog: {
            open: alertDialogOpen,
            setOpen: setAlertDialogOpen,
            content: alertDialogContent,
            setContent: setAlertDialogContent,
            action: alertDialogAction,
            setAction: setAlertDialogAction,
            cancel: alertDialogCancel,
            setCancel: setAlertDialogCancel,
        },
        detailedAsset: detailedAsset as any,
        setDetailedAsset,
        endpointIsTRPC,
        fetchers,
        searchQuery,
        handleSearch,
        isGlobalSearch,
        onAssetSelect: props.onAssetSelect,
        selectedFiles,
        setSelectedFiles,
        isToolbarBusy,
        setIsToolbarBusy,
        onError
    }

    return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}

type AlertDialogContent = { title: string; text: string; cancel: string; commit: string }
