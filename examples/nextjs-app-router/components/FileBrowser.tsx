"use client"

import { createFilenestComponents } from "@filenest/react"
import { client } from "@filenest/adapter-nextjs"
import { Spinner } from "./Spinner"

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
              return <div className="text-xl">Loading...</div>
            }

            return (
              <div className="grid grid-cols-2 gap-2">
                {files.map((File, index) => (
                  <File.Root
                    key={index}
                    children={({ file, rootProps, state }) => (
                      <div
                        className={`
                        bg-zinc-900 border border-zinc-800 rounded flex justify-between items-center
                        ${state.isSelected && "outline-2 outline-cyan-600"}`}
                      >
                        <div {...rootProps} className="p-3 w-full">
                          {file.name}
                        </div>
                        <File.Delete
                          children={({ trigger, isDeleting }) => (
                            <button
                              className={`
                                m-2 py-1 px-2 bg-gradient-to-b from-zinc-800 to-zinc-900
                                border border-zinc-700 rounded-lg cursor-pointer
                                disabled:opacity-50 disabled:cursor-not-allowed
                              `}
                              onClick={trigger}
                              disabled={isDeleting}
                            >
                              {isDeleting ? <Spinner /> : "Delete"}
                            </button>
                          )}
                        />
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
                  border border-zinc-700 rounded-lg cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                onClick={loadMore}
              >
                {isLoading ? <Spinner /> : "Load more"}
              </button>
            )}
          />
        </div>
      </Filenest.Root>
    </div>
  )
}
