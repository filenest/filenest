"use client"

import { cx } from "@/lib/cva"
import { useSearchContext } from "fumadocs-ui/provider"
import { Search } from "lucide-react"

export const Searchbar = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) => {
  const { setOpenSearch } = useSearchContext()

  return (
    <div
      {...props}
      className={cx(
        "flex items-center justify-between py-4 px-6 bg-fn-900 border-b border-fn-800",
        className
      )}
      onClick={() => setOpenSearch(true)}
    >
      <div className="flex gap-2 items-center font-mono">
        <Search className="text-fn-300" />
        <span>Search</span>
      </div>
      <div className="flex items-center gap-1 text-xs">
        <kbd className="bg-fn-800 border border-fn-700 rounded-sm px-2 py-1">CTRL</kbd>
        <kbd className="bg-fn-800 border border-fn-700 rounded-sm px-2 py-1">K</kbd>
      </div>
    </div>
  )
}
