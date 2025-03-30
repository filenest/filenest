"use client"

import React from "react"
import { FilenestFolder } from "@filenest/core"
import { useFoldersContext } from "../../context/FoldersContext"
import { useGlobalContext } from "../Root"

interface RenderProps {
  folder: FilenestFolder
  isCurrent: boolean
  rootProps: React.ComponentPropsWithoutRef<"div">
}

export interface BreadcrumbItemProps {
  folder?: FilenestFolder
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const BreadcrumbItem = ({ folder, children }: BreadcrumbItemProps) => {
  const { currentPath } = useGlobalContext()
  const { navigateTo } = useFoldersContext()

  if (!folder) {
    throw new Error(
      [
        "`folder` prop wasn't automatically passed to Breadcrumb.Root.",
        "Ensure your setup is correct.",
      ].join(" ")
    )
  }

  const isCurrent = currentPath.value === folder.key

  const rootProps: React.ComponentPropsWithoutRef<"div"> = {
    onClick: (e) => {
      e.preventDefault()
      e.stopPropagation()
      navigateTo(folder)
    },
  }

  if (typeof children === "function") {
    return children({ folder, rootProps, isCurrent })
  } else {
    return children
  }
}
