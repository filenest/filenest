"use client"

import { useFilesContext } from "../context/FilesContext"

interface RenderProps {
    loadMore: () => void
    isLoading: boolean
}

export interface LoadMoreProps {
    children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const LoadMore = ({ children }: LoadMoreProps) => {
    const { hasNextPage, fetchNextPage, isLoading, isFetching } = useFilesContext()

    const loadMore = fetchNextPage

    if (!hasNextPage) return null

    if (typeof children === "function") {
        return children({
            loadMore,
            isLoading: isLoading || isFetching,
        })
    } else {
        return children
    }
}
