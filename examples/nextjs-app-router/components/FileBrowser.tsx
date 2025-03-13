"use client"

import { createFilenestComponents } from "@filenest/react"

export const FileBrowser = () => {
    const Filenest = createFilenestComponents({
        endpoint: "/api/filenest",
        adapter
    })

    return (
        <div></div>
    )
}