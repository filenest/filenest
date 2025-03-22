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
        <Filenest.Search
          children={({ setSearch }) => (
            <input
              type="text"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search files..."
              className={`py-2 px-4 bg-zinc-900 border border-zinc-800 rounded
                focus:outline-none focus:ring focus:ring-cyan-600 mb-8`}
            />
          )}
        />
        <Filenest.Uploader
          children={({ rootProps, inputProps, isDragActive }) => (
            <div
              {...rootProps}
              className={`
                w-full p-8 bg-zinc-900
                border-2 border-dashed ${
                  isDragActive ? "border-cyan-600" : "border-zinc-800"
                }
                rounded flex items-center justify-center mb-8
              `}
            >
              <input {...inputProps} />
              Drop files here or click to upload
            </div>
          )}
        />
        <Filenest.Queue
          children={({ uploads }) => (
            <div className="fixed bottom-8 right-8 z-20 p-6 rounded bg-zinc-900 border border-zinc-800 shadow-xl max-w-96">
              <div className="text-xl mb-2">Queued files:</div>
              {uploads.map((Upload, index) => (
                <Upload.Root
                  key={index}
                  children={({ upload, removeFromQueue }) => (
                    <div className="flex items-center justify-between mt-2 py-2 px-3 rounded-sm border border-zinc-800">
                      <div className="truncate">{upload.raw.name}</div>
                      <button
                        onClick={removeFromQueue}
                        className={`py-1 px-2 ml-2 bg-gradient-to-b from-zinc-800 to-zinc-900 cursor-pointer
                          border border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                />
              ))}
            </div>
          )}
        />
        <Filenest.Selection
          children={({ count, bulkDelete }) => (
            <div className="bg-zinc-900 border border-zinc-800 rounded flex items-center gap-4 py-2 px-4 mb-8">
              <div>{count} files selected:</div>
              <button
                className={`py-1 px-2 bg-gradient-to-b from-zinc-800 to-zinc-900 cursor-pointer
                  border border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={bulkDelete}
              >
                Delete
              </button>
            </div>
          )}
        />
        <Filenest.FileList
          children={({ files, isLoading }) => {
            if (isLoading) {
              return <div className="text-xl">Loading...</div>
            }

            return (
              <div className="grid grid-cols-2 gap-2">
                {files.length === 0 && <div className="text-xl">No files found.</div>}
                {files.map((File, index) => (
                  <File.Root
                    key={index}
                    children={({ file, rootProps, state }) => (
                      <div
                        className={`
                          bg-zinc-900 border border-zinc-800 rounded flex justify-between items-center
                          ${state.isSelected && "outline-2 outline-cyan-600"}
                          ${state.isLoading && "opacity-50"}
                        `}
                      >
                        <div {...rootProps} className="p-3 w-full">
                          {file.name}
                        </div>
                        <File.Delete
                          children={({ trigger, isDeleting }) => (
                            <button
                              className={`m-2 py-1 px-2 bg-gradient-to-b from-zinc-800 to-zinc-900 cursor-pointer
                                border border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
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
                className={`py-3 px-4 bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700
                  rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
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
