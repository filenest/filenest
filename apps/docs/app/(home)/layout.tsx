import type { ReactNode } from "react"

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="max-w-7xl mx-auto px-4 sm:px-8">{children}</div>
}
