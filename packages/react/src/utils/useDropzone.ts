"use client"

import { useDropzone } from "react-dropzone"

interface UseUploadProps {

}

export const useUpload = () => {

    const dropzone = useDropzone({
        maxSize: 2.5e+8, // 250 MB
        multiple: true,
        noClick: true,
        onDrop(acceptedFiles) {
            // upload
        },
    })

    return dropzone
}