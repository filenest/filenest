"use client"

import { MediaLibrary, config } from "@/components/MediaLibrary__Custom-CSS"


export default function Page() {
    return (
        <MediaLibrary renderMode="bundle" {...config} />
    )
}