import { inter } from "@/fonts"
import "../styles/styles.scss"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <main className="mx-auto max-w-[1200px] py-16 px-6">{children}</main>
            </body>
        </html>
    )
}
