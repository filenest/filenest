"use client"

import { createFilenestComponents } from "@filenest/react"
import { client } from "@filenest/adapter-nextjs"

export const FileBrowser = () => {
    const Filenest = createFilenestComponents({
        endpoint: "/api/filenest",
        client,
    })

    return (
        <div>
            <Filenest.Root>hello</Filenest.Root>
        </div>
    )
}
