"use client"

import { DocsNavigation } from "./DocsNavigation"
import { Searchbar } from "./Searchbar"

export const Sidebar = () => {
  return (
    <div className="hidden md:block w-96 bg-fn-950 border-r border-fn-800 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pb-16">
      <Searchbar />
      <DocsNavigation />
    </div>
  )
}