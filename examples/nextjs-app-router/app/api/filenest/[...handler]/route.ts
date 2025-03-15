import { initNextjsAdapter } from "@filenest/adapter-nextjs"
import { UploadThing } from "@filenest/provider-uploadthing"

const provider = new UploadThing({
    UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN!,
})

export const { GET, POST } = initNextjsAdapter(provider).create()

/*
Example of using middleware:

export const { GET, POST } = initNextjsAdapter(provider)
    .use(async (req) => {
        const isAuthed = req.cookies.get("authed")
        if (!isAuthed?.value) {
            return NextResponse.json("Unauthorized", { status: 401 })
        }
    })
    .create()
*/