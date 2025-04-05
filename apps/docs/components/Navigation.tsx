"use client"

import Link from "next/link"
import { Logo } from "./Logo"
import { GithubIcon } from "./Icon"
import { Menu } from "lucide-react"

export const Navigation = () => {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 border-b border-fn-800 flex justify-between gap-8 h-16 bg-fn-950">
      <div className="flex">
        <Link
          href="/"
          className="h-full flex items-center px-6 border-r border-fn-800 fill-fn-50 hover:border-b-4 duration-100"
        >
          <Logo className="h-10" />
        </Link>
        <div className="px-3 py-1 bg-fn-900 font-mono  text-xs border-t border-r border-fn-800 mt-auto">Beta</div>
      </div>
      <div className="h-full sm:hidden flex items-center border-l border-fn-800"> 
        <div className="h-full flex items-center px-4">
          <Menu />
        </div>
      </div>
      <div className="hidden sm:flex items-center">
        <div className="h-full">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="h-full flex items-center py-4 px-6 border-l border-fn-800 font-mono hover:border-b-4 duration-100"
            >
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
    </div>
  )
}

export type NavLink = {
  title: string
  path: string
  children?: NavLink[]
}

export const navLinks: NavLink[] = [{ title: "Documentation", path: "/docs" }]
