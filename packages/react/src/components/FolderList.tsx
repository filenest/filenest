"use client"

import { FolderProps, Folder } from "./Folder/Folder"
import { useFoldersContext } from "../context/FoldersContext"
import { DeleteAction, DeleteActionProps } from "./Folder/DeleteAction"

interface RenderProps {
  folders: Array<{
    Root: React.FC<FolderProps>
    Delete: React.FC<DeleteActionProps>
  }>
  isLoading: boolean
}

export interface FolderListProps {
  children: React.ReactNode | ((props: RenderProps) => React.ReactNode)
}

export const FolderList = ({ children }: FolderListProps) => {
  const { folders, isLoading } = useFoldersContext()

  if (folders.value.length === 0) return null

  if (typeof children === "function") {
    return children({
      folders: folders.value.map((folder) => ({
        Root: (props: FolderProps) => <Folder {...props} folder={folder} />,
        Delete: (props: DeleteActionProps) => <DeleteAction {...props} folder={folder} />,
      })),
      isLoading,
    })
  } else {
    return children
  }
}
