"use client"

import { FileProps, File } from "./File/File"
import { useFilesContext } from "../context/FilesContext"

interface RenderProps {
    files: Array<{
        Root: React.FC<FileProps>
    }>
    isLoading: boolean
}

export interface FileListProps {
    children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const FileList = ({ children }: FileListProps) => {
    const { files, isLoading } = useFilesContext()

    if (typeof children === "function") {
        return children({
            files: files.value.map((file) => ({
                Root: (props: FileProps) => <File {...props} file={file} />,
            })),
            isLoading,
        })
    } else {
        return children
    }
}
