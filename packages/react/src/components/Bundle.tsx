"use client"

interface FilenestBundleProps {
    children: React.ReactNode
}

export const Bundle = ({ children }: FilenestBundleProps) => {
    return <div>{children}</div>
}
