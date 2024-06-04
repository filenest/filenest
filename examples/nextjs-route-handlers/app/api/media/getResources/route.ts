import { NextResponse } from "next/server"
import { Cloudinary } from "../../../../../../packages/providers"

export async function GET(request: Request) {
    const nest = new Cloudinary({
        API_KEY: process.env.CLOUDINARY_API_KEY!,
        API_SECRET: process.env.CLOUDINARY_API_SECRET!,
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
    })

    const response = await nest.getResourcesByFolder()

    return NextResponse.json(response)
}