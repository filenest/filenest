"use client"

export const Navigation = () => {
  return (
    <div className=""></div>
  )
}

export type NavLink = {
  title: string
  path: string
  children?: NavLink[]
}

export const navLinks: NavLink[] = []