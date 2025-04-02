import "@/styles/styles.css"
import { RootProvider } from "fumadocs-ui/provider"
import type { ReactNode } from "react"
import { Chivo_Mono } from "next/font/google"

const chivoMono = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-chivo-mono",
  display: "swap",
})

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={chivoMono.variable} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider theme={{ enableSystem: true, defaultTheme: "dark" }}>
          <main className="pt-16">{children}</main>
        </RootProvider>
      </body>
    </html>
  )
}
