"use client"

import React from "react"
import { FilenestFolder } from "@filenest/core"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useGlobalContext } from "../components/Root"
import { SetterGetter } from "../utils/types"

interface FolderContext {
  folders: SetterGetter<FilenestFolder[]>
  isLoading: boolean
  isFetching: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
}

const FoldersContext = React.createContext<FolderContext | null>(null)

export function useFoldersContext() {
  const context = React.useContext(FoldersContext)
  if (!context) {
    throw new Error(
      "This component uses useFoldersContext, but was not used within Filenest.Root"
    )
  }
  return context
}

export const FoldersProvider = ({ children }: { children: React.ReactNode }) => {
  const { client, currentPath } = useGlobalContext()

  const [foldersInList, setFoldersInList] = React.useState<FilenestFolder[]>([])

  const { data, isLoading, isFetching, error, isError, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["filenest-folders", currentPath.value],
      queryFn: async ({ pageParam }) => {
        return await client.fetchers.folders.getFolders({
          path: currentPath.value,
          cursor: pageParam.cursor,
          skip: pageParam.skip,
        })
      },
      initialPageParam: {
        cursor: undefined as string | null | undefined,
        skip: undefined as number | null | undefined,
      },
      getNextPageParam: (lastPage) => {
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
      const foldersData = data.pages.flatMap((result) => {
        if ("data" in result) {
          return result.data.folders
        } else {
          return []
        }
      })

      setFoldersInList(foldersData)
    }

    if (isError) {
      console.error(error)
    }
  }, [data, isError])

  const contextValue = {
    folders: {
      value: foldersInList,
      set: setFoldersInList,
    },
    isLoading,
    isFetching,
    hasNextPage,
    fetchNextPage,
  }

  return <FoldersContext.Provider value={contextValue}>{children}</FoldersContext.Provider>
}
