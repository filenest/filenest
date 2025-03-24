"use client"

import { createFilenestComponents } from "@filenest/react"
import { client } from "@filenest/adapter-trpc/client"
import { Spinner } from "./Spinner"

export const FileBrowser = () => {
  const Filenest = createFilenestComponents({
    endpoint: "/api/trpc/filenest",
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
          children={({ uploads, upload, meta }) => (
            <div className="fixed bottom-8 right-8 z-20 p-6 rounded-lg bg-zinc-900 border border-zinc-800 shadow-xl max-w-96">
              <div className="text-xl mb-2">Queued files:</div>
              {uploads.map((Upload, index) => (
                <Upload.Root
                  key={index}
                  children={({ upload, removeFromQueue }) => (
                    <div className="mt-2 border border-zinc-800 rounded-sm overflow-hidden">
                      <div className="flex items-center justify-between py-2 px-3 pb-1">
                        <div className="truncate">{upload.raw.name}</div>
                        {!meta.isLoading && !upload.isDone && (
                          <button
                            onClick={removeFromQueue}
                            disabled={upload.isUploading}
                            className={`py-1 px-2 ml-2 bg-gradient-to-b from-zinc-800 to-zinc-900 cursor-pointer
                              border border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <div
                        className="h-1 bg-green-600"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}
                />
              ))}
              <button
                onClick={upload}
                disabled={meta.isLoading}
                className={`py-1 px-2 w-full mt-4 bg-gradient-to-b from-green-800 to-green-900 cursor-pointer
                  border border-green-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed relative`}
              >
                <span className="relative z-1">Upload {uploads.length} files</span>
                {meta.isLoading && (
                  <div
                    className="absolute top-0 right-0 h-full bg-zinc-900 rounded-md"
                    style={{ width: `${100 - meta.totalProgress}%` }}
                  />
                )}
              </button>
            </div>
          )}
        />
        <Filenest.Selection
          children={({ count, bulkDelete }) => (
            <div
              className={`bg-zinc-950 border border-zinc-800 rounded flex items-center gap-4
              py-2 px-4 mb-8 fixed bottom-4 left-1/2 -translate-x-1/2 z-20`}
            >
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
                        <div {...rootProps} className="p-3 w-full truncate">
                          {file.name}
                        </div>
                        <div className="flex ml-4">
                          <button
                            className={`m-2 ml-0 py-1 px-2 bg-gradient-to-b from-zinc-800 to-zinc-900 cursor-pointer
                              border border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={() => alert(file.url)}
                          >
                            URL
                          </button>
                          <File.Delete
                            children={({ trigger, isDeleting }) => (
                              <button
                                className={`m-2 ml-0 py-1 px-2 bg-gradient-to-b from-zinc-800 to-zinc-900 cursor-pointer
                                  border border-zinc-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                                onClick={trigger}
                                disabled={isDeleting}
                              >
                                {isDeleting ? <Spinner /> : "Delete"}
                              </button>
                            )}
                          />
                        </div>
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
