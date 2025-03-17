"use client"

import React from "react"
import { FilenestFile } from "@filenest/core"
import { SetterGetter } from "../../utils/types"

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
  isLoading: boolean
}

export interface FileProps {
  file?: FilenestFile
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const File = ({ file, children }: FileProps) => {
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

  const contextValue = {
    file,
    isLoading: { value: isLoading, set: setIsLoading },
    isDeleting: { value: isDeleting, set: setIsDeleting },
  }

  if (typeof children === "function") {
    return (
      <FileContext.Provider value={contextValue}>
        {children({ file, isLoading: isLoading || isDeleting })}
      </FileContext.Provider>
    )
  } else {
    return <FileContext.Provider value={contextValue}>{children}</FileContext.Provider>
  }
}
