import { Upload } from "../context/UploadContext"

export function uploadObjectFromFile(file: File): Upload {
  return {
    raw: file,
    progress: 0,
    isUploading: false,
    isDone: false,
    isError: false,
  }
}
