"use client"

import React from "react"
import Link from "next/link"
import { Logo } from "./Logo"
import { GithubIcon } from "./Icon"
import { BookOpenText, Menu, X } from "lucide-react"
import { cx } from "@/lib/cva"
import { Searchbar } from "./Searchbar"
import { DocsNavigation } from "./DocsNavigation"

const NavigationContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  toggleMenu: () => void
} | null>(null)

export const useNavigation = () => {
  const context = React.useContext(NavigationContext)
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider")
  }
  return context
}

export const Navigation = () => {
  const [open, setOpen] = React.useState(false)

  function toggleMenu() {
    setOpen((prev) => !prev)
  }

  return (
    <NavigationContext.Provider value={{ open, setOpen, toggleMenu }}>
      <div className="sticky top-0 left-0 right-0 z-40 border-b border-fn-800 flex justify-between gap-8 h-16 bg-fn-950">
        <div className="flex">
          <Link
            href="/"
            className="h-full flex items-center px-6 border-r border-fn-800 fill-fn-50 hover:border-b-4 duration-100"
            onClick={() => setOpen(false)}
          >
            <Logo className="h-10" />
          </Link>
          <div className="px-3 py-1 bg-fn-900 font-mono  text-xs border-t border-r border-fn-800 mt-auto">
            Beta
          </div>
        </div>
        <div
          className="h-full md:hidden flex items-center border-l border-fn-800"
          onClick={toggleMenu}
        >
          <div className="h-full flex items-center px-4">{open ? <X /> : <Menu />}</div>
        </div>
        <div className="hidden md:flex items-center">
          <div className="h-full">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className="h-full flex items-center py-4 px-6 border-l border-fn-800 font-mono hover:border-b-4 duration-100"
              >
                {link.icon && <span className="text-fn-300 mr-2">{link.icon}</span>}
                {link.title}
              </Link>
            ))}
          </div>
          <div className="h-full border-l border-fn-800 flex gap-4">
            <Link
              href="https://github.com/filenest/filenest"
              className="p-4 px-6 flex items-center fill-fn-300 hover:fill-fn-50 border-fn-800 hover:border-b-4 duration-100"
            >
              <GithubIcon className="h-6" />
            </Link>
          </div>
        </div>
        <MobileMenu />
      </div>
    </NavigationContext.Provider>
  )
}

const MobileMenu = () => {
  const { open, toggleMenu } = useNavigation()

  return (
    <div
      className={cx(
        "block md:hidden bg-fn-950 fixed top-16 left-0 w-full h-[calc(100vh-4rem)] overflow-auto",
        "duration-500",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      <Searchbar />
      <div className="mt-4">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            onClick={toggleMenu}
            className="h-full flex items-center py-2 px-6 border-b border-fn-800 font-mono"
          >
            {link.icon && <span className="text-fn-300 mr-2 mt-1">{link.icon}</span>}
            {link.title}
          </Link>
        ))}
      </div>
      <div className="mt-4">
        <DocsNavigation />
      </div>
    </div>
  )
}

export type NavLink = {
  title: string
  path: string
  icon?: React.ReactNode
  children?: NavLink[]
}

export const navLinks: NavLink[] = [
  { title: "Documentation", path: "/docs", icon: <BookOpenText /> },
]
