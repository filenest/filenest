"use client"

import { MediaLibrary, config } from "@/components/MediaLibrary__Custom-Components"


export default function Page() {
    return (
        <MediaLibrary renderMode="bundle" {...config} />
    )
}