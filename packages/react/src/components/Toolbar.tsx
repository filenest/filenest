"use client"

import { useGlobalContext } from "../context/global/GlobalContext"

export const Toolbar = () => {
    const { selectedFiles } = useGlobalContext()

    return (
        <div>{selectedFiles.length}</div>
    )
}