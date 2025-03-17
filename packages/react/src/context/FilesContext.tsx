"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { useGlobalContext } from "../components/Root"
import React from "react"
import { FilenestFile } from "@filenest/core"
import { SetterGetter } from "../utils/types"

interface FilesContext {
    files: SetterGetter<FilenestFile[]>
    isLoading: boolean
    isFetching: boolean
    hasNextPage: boolean
    fetchNextPage: () => void
}

const FilesContext = React.createContext<FilesContext | null>(null)

export function useFilesContext() {
    const context = React.useContext(FilesContext)
    if (!context) {
        throw new Error(
            "This component uses useFilesContext, but was not used within Filenest.Root"
        )
    }
    return context
}

export const FilesProvider = ({ children }: { children: React.ReactNode }) => {
    const { client } = useGlobalContext()

    const [filesInList, setFilesInList] = React.useState<FilenestFile[]>([])

    const { data, isLoading, isFetching, error, isError, hasNextPage, fetchNextPage } =
        useInfiniteQuery({
            queryKey: ["filenest-files"],
            queryFn: async ({ pageParam }) => {
                return await client.fetchers.files.getFiles({
                    cursor: pageParam.cursor,
                    skip: pageParam.skip,
                })
            },
            initialPageParam: {
                cursor: undefined as string | null | undefined,
                skip: undefined as number | null | undefined,
            },
            getNextPageParam: (lastPage) => {
                console.log(lastPage)
                if ("data" in lastPage) {
                    if (!lastPage.data.nextCursor && !lastPage.data.nextSkip) return
                    return {
                        cursor: lastPage.data.nextCursor,
                        skip: lastPage.data.nextSkip,
                    }
                }
            },
        })

    React.useEffect(() => {
        if (!isError && data) {
            const filesData = data.pages.flatMap((result) => {
                if ("data" in result) {
                    return result.data.files
                } else {
                    return []
                }
            })

            setFilesInList(filesData)
        }

        if (isError) {
            console.error(error)
        }
    }, [data, isError])

    const contextValue = {
        files: {
            value: filesInList,
            set: setFilesInList,
        },
        isLoading,
        isFetching,
        hasNextPage,
        fetchNextPage,
    }

    return <FilesContext.Provider value={contextValue}>{children}</FilesContext.Provider>
}
