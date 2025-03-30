"use client"

import React from "react"
import { useFoldersContext } from "../../context/FoldersContext"
import { useGlobalContext } from "../Root"
import { BreadcrumbItem, BreadcrumbItemProps } from "./BreadcrumbItem"

interface RenderProps {
  breadcrumbs: Array<{
    Root: React.FC<BreadcrumbItemProps>
  }>
}

export interface BreadcrumbsProps {
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const Breadcrumbs = ({ children }: BreadcrumbsProps) => {
  const { navigation } = useFoldersContext()

  if (typeof children === "function") {
    return children({
      breadcrumbs: navigation.value.map((folder) => ({
        Root: (props: BreadcrumbItemProps) => (
          <BreadcrumbItem {...props} folder={folder} />
        ),
      })),
    })
  } else {
    return children
  }
}
