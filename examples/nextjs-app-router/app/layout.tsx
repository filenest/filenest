import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body
                className={`
                    ${geistSans.variable} ${geistMono.variable} antialiased
                    bg-zinc-950 text-zinc-50 font-(family-name:--font-geist-sans)
                `}
            >
                <div className="py-32 max-w-7xl mx-auto">{children}</div>
            </body>
        </html>
    )
}
