"use client"

import React from "react"
import { useGlobalContext } from "./Root"

interface RenderProps {
  //search: string
  setSearch: (value: string) => void
}

export interface SearchProps {
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const Search = ({ children }: SearchProps) => {
  const { search } = useGlobalContext()

  if (typeof children === "function") {
    return children({
      //search: search.value,
      setSearch: search.set,
    })
  } else {
    return children
  }
}
