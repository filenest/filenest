"use client"

import Link from "next/link"

export default function Home() {
    const links = [
        { href: "/custom-components", text: "With custom Components" },
        { href: "/custom-css", text: "With custom CSS" },
    ]

    return (
        <main>
            <div className="flex gap-4">
                {links.map(({ href, text }) => (
                    <Link
                        href={href}
                        key={href}
                        className="flex items-center px-3 py-2 rounded bg-blue-200 hover:bg-blue-300"
                    >
                        {text}
                    </Link>
                ))}
            </div>
        </main>
    )
}
