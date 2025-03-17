"use client"

import { FileProps, File } from "./File/File"
import { useFilesContext } from "../context/FilesContext"
import { DeleteAction, DeleteActionProps } from "./File/DeleteAction"

interface RenderProps {
    files: Array<{
        Root: React.FC<FileProps>
        Delete: React.FC<DeleteActionProps>
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
                Delete: (props: DeleteActionProps) => (
                    <DeleteAction {...props} file={file} />
                ),
            })),
            isLoading,
        })
    } else {
        return children
    }
}
