import { Provider } from ".."
import { NextRequest, NextResponse } from "next/server"

// TODO:
// This is a poor attempt at creating a dynamic route handler for Next.js.
// Definitely re-work this in the future and make it compatiple with all HTTP methods.
// I chose to only support POST for now because it supports sending a body.

export function experimental_createNextRouteHandlers({ provider }: { provider: Provider }) {
    const handleRequest = async (req: NextRequest) => {
        const { pathname } = new URL(req.url)
        const action = pathname.split("/").at(-1) as keyof Provider

        if (!provider[action]) {
            return new NextResponse("Not Found", { status: 404 })
        }

        // Prevents errors when there is no body
        let body
        try {
            body = await req.json()
        } catch (error) {
            body = {}
        }

        const result = await provider[action](body)

        return NextResponse.json(result)
    }

    return {
        POST: handleRequest,
    }
}