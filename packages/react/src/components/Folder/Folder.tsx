"use client"

import React from "react"
import { FilenestFolder } from "@filenest/core"
import { SetterGetter } from "../../utils/types"
import { useFoldersContext } from "../../context/FoldersContext"
import { useGlobalContext } from "../Root"

interface FolderContext {
  folder: FilenestFolder
  isLoading: SetterGetter<boolean>
  isDeleting: SetterGetter<boolean>
}

const FolderContext = React.createContext<FolderContext | null>(null)

export function useFolderContext() {
  const context = React.useContext(FolderContext)
  if (!context) {
    throw new Error(
      "One of your components uses useFolderContext, but was not used within Folder.Root"
    )
  }
  return context
}

interface RenderProps {
  folder: FilenestFolder
  rootProps: React.ComponentPropsWithoutRef<"div">
  state: {
    isLoading: boolean
  }
}

export interface FolderProps {
  folder?: FilenestFolder
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const Folder = ({ folder, children }: FolderProps) => {
  const { currentPath } = useGlobalContext()
  const { navigation } = useFoldersContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  if (!folder) {
    throw new Error(
      [
        "`folder` prop wasn't automatically passed to Folder.Root.",
        "Ensure your setup is correct.",
      ].join(" ")
    )
  }

  const state = {
    isLoading: isLoading || isDeleting,
  }

  const rootProps: React.ComponentPropsWithoutRef<"div"> = {
    onClick: (e) => {
      e.preventDefault()
      e.stopPropagation()
      currentPath.set(folder.key)
      navigation.set((curr) => [...curr, folder])
    },
  }

  const contextValue = {
    folder,
    isLoading: { value: isLoading, set: setIsLoading },
    isDeleting: { value: isDeleting, set: setIsDeleting },
  }

  if (typeof children === "function") {
    return (
      <FolderContext.Provider value={contextValue}>
        {children({
          folder,
          state,
          rootProps,
        })}
      </FolderContext.Provider>
    )
  } else {
    return (
      <FolderContext.Provider value={contextValue}>{children}</FolderContext.Provider>
    )
  }
}
