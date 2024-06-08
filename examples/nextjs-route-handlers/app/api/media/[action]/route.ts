import { Cloudinary, createNextRouteHandlers } from "@filenest/handlers"

const provider = new Cloudinary({
    API_KEY: process.env.CLOUDINARY_API_KEY!,
    API_SECRET: process.env.CLOUDINARY_API_SECRET!,
    CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME!,
})

export const { POST } = createNextRouteHandlers({ provider })