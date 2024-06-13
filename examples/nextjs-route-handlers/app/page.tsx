"use client"

import { MediaLibrary, config } from "@/components/MediaLibrary__Custom-Components"
import { type Asset } from "@filenest/handlers"
import { useState } from "react"

export default function Home() {

    const [selectedFiles, setSelectedFiles] = useState<Asset[]>([])

    return (
        <main>
            <MediaLibrary
                renderMode="bundle"
                {...config}
            />
        </main>
    )
}
