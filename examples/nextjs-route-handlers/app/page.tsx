"use client"

import { type Asset } from "@filenest/handlers"
import { useState } from "react"

export default function Home() {

    const [selectedFiles, setSelectedFiles] = useState<Asset[]>([])

    return (
        <main>
            <Filenest
                endpoint="/api/media"
                onFileSelect={(file) => console.log(file)}
            />
        </main>
    )
}
