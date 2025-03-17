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
            <Filenest.Root>
                <Filenest.FileList
                    children={({ files, isLoading }) => {
                        if (isLoading) {
                            return <div>Loading...</div>
                        }

                        return (
                            <div className="grid grid-cols-2 gap-2">
                                {files.map((File, index) => (
                                    <File.Root
                                        key={index}
                                        children={({ file }) => (
                                            <div className="p-3 bg-zinc-900 border border-zinc-800 rounded">
                                                {file.name}
                                            </div>
                                        )}
                                    />
                                ))}
                            </div>
                        )
                    }}
                />
                <div className="text-center mt-8">
                    <Filenest.LoadMore
                        children={({ loadMore, isLoading }) => (
                            <button
                                disabled={isLoading}
                                className={`
                                    py-3 px-4 bg-gradient-to-b from-zinc-800 to-zinc-900
                                    border border-zinc-800 rounded-lg cursor-pointer
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                                onClick={loadMore}
                            >
                                Load More
                            </button>
                        )}
                    />
                </div>
            </Filenest.Root>
        </div>
    )
}
