"use client"

import { FilenestFile } from "@filenest/core"

interface RenderProps {
    file: FilenestFile
}

export interface FileProps {
    file?: FilenestFile
    children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const File = ({ file, children }: FileProps) => {
    if (!file) {
        throw new Error(
            [
                "`file` prop wasn't automatically passed to File.Root.",
                "Ensure your setup is correct.",
            ].join(" ")
        )
    }

    if (typeof children === "function") {
        return children({ file })
    } else {
        return children
    }
}
