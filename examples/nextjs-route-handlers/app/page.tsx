"use client"

import { MediaLibrary, config } from "@/components/MediaLibrary"

export default function Home() {

    return (
        <main>
            <MediaLibrary renderMode="bundle" {...config} />
        </main>
    )
}
