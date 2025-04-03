"use client"

import Link from "next/link"
import { Logo } from "./Logo"
import { GithubIcon } from "./Icon"

export const Navigation = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-fn-900 flex justify-between gap-8">
      <Link
        href="/"
        className="py-4 px-6 border-r border-fn-900 fill-fn-400 hover:fill-fn-50"
      >
        <Logo className="h-10" />
      </Link>
      <div className="flex items-center">
        <div className="h-full">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className="h-full flex items-center py-4 px-6 border-l border-fn-900 font-mono hover:border-b-4 duration-100"
            >
              {link.title}
            </Link>
          ))}
        </div>
        <div className="h-full border-l border-fn-900 flex gap-4">
          <Link
            href="https://github.com/filenest/filenest"
            className="p-4 px-6 flex items-center fill-fn-400 hover:fill-fn-50 border-fn-900 hover:border-b-4 duration-100"
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
