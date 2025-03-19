"use client"

import React from "react"
import { FilenestFile } from "@filenest/core"
import { SetterGetter } from "../../utils/types"
import { useGlobalContext } from "../Root"
import { useFilesContext } from "../../context/FilesContext"

interface FileContext {
  file: FilenestFile
  isLoading: SetterGetter<boolean>
  isDeleting: SetterGetter<boolean>
}

const FileContext = React.createContext<FileContext | null>(null)

export function useFileContext() {
  const context = React.useContext(FileContext)
  if (!context) {
    throw new Error(
      "One of your components uses useFileContext, but was not used within File.Root"
    )
  }
  return context
}

interface RenderProps {
  file: FilenestFile
  rootProps: React.ComponentPropsWithoutRef<"div">
  state: {
    isLoading: boolean
    isSelected: boolean
  }
}

export interface FileProps {
  file?: FilenestFile
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const File = ({ file, children }: FileProps) => {
  const { selectedFiles } = useGlobalContext()
  const { files } = useFilesContext()

  const [isLoading, setIsLoading] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  if (!file) {
    throw new Error(
      [
        "`file` prop wasn't automatically passed to File.Root.",
        "Ensure your setup is correct.",
      ].join(" ")
    )
  }

  const isSelected = React.useMemo(
    () => selectedFiles.value.some((f) => f.id === file.id),
    [selectedFiles.value, file.id]
  )

  const state = {
    isLoading: isLoading || isDeleting,
    isSelected,
  }

  const toggleSelection = () => {
    selectedFiles.set((current) => {
      if (current.some((f) => f.id === file.id)) {
        return current.filter((f) => f.id !== file.id)
      }
      return [...current, file]
    })
  }

  const rootProps: React.ComponentPropsWithoutRef<"div"> = {
    onClick: ((e) => {
      // Handle selection of multiple files
      if (e.ctrlKey || e.metaKey) {
        if (e.detail === 1) {
          toggleSelection()
          return
        } else if (e.detail === 2) {
          // Deselect all files by CTRL + double clicking
          selectedFiles.set([])
          return
        }
      } else if (e.shiftKey) {
        toggleSelection()
        const firstSelectedFile = selectedFiles.value.at(0)
        if (!firstSelectedFile || !files.value.length) return
        const data = files.value
        const firstSelectedIndex = data.findIndex((f) => f.id === firstSelectedFile.id)
        const newlySelectedIndex = data.findIndex((f) => f.id === file.id)
        const min = Math.min(firstSelectedIndex, newlySelectedIndex)
        const max = Math.max(firstSelectedIndex, newlySelectedIndex)
        const filesToSelect = data.slice(min, max + 1)

        selectedFiles.set([])
        selectedFiles.set((current) => [...current, ...filesToSelect])
        return
      }
    }),
  }

  const contextValue = {
    file,
    isLoading: { value: isLoading, set: setIsLoading },
    isDeleting: { value: isDeleting, set: setIsDeleting },
  }

  if (typeof children === "function") {
    return (
      <FileContext.Provider value={contextValue}>
        {children({
          file,
          state,
          rootProps,
        })}
      </FileContext.Provider>
    )
  } else {
    return <FileContext.Provider value={contextValue}>{children}</FileContext.Provider>
  }
}
