"use client"

interface FilenestUploaderProps {}

export const Uploader = () => {
    return (
        <div>
            Uploader
        </div>
    )
}


/* export type MediaLibraryDropzoneProps =
    | {
        multiple?: boolean
        isWrapper: true
        children: React.ReactNode
    }
    | {
        multiple?: boolean
        isWrapper?: false
        children?: never
    }

export const MediaLibraryDropzone = ({
    multiple = true,
    isWrapper = false,
    ...props
}: MediaLibraryDropzoneProps) => {
    const { renderMode } = useMediaLibrary()

    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const hasImagesSelected = selectedFiles.length > 0
    const hasSingleFileSelected = selectedFiles.length == 1 && !multiple
    const { acceptedFiles, getRootProps, getInputProps, isDragActive, inputRef } = useDropzone({
        accept: {
            "image/*": [".png", ".jpg", ".webp", ".avif"],
        },
        maxSize: 5242880,
        multiple,
        onDrop(acceptedFiles) {
            setSelectedFiles((current) => [...current, ...acceptedFiles])
        },
        noClick: isWrapper
    })

    // Get preview images
    useEffect(() => {
        if (selectedFiles.length == 0) return

        const images: string[] = []

        selectedFiles.forEach((file) => {
            images.push(URL.createObjectURL(file))
        })

        setPreviewImages(images)
    }, [selectedFiles])

    const previewImagesContainer = useRef<HTMLDivElement>(null)
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [isUploading, setIsUploading] = useState(false)

    // Scroll to show file input
    useEffect(() => {
        if (!previewImagesContainer.current) return
        previewImagesContainer.current.scrollLeft = previewImagesContainer.current.scrollWidth
    }, [previewImages])

    // Clear uploads
    function clearUploads(opts?: { confirmation?: boolean }) {
        if (inputRef.current) {
            inputRef.current.value = ""
            setPreviewImages([])
            setSelectedFiles([])
            if (opts?.confirmation) {
                toast.success("Cleared uploads")
            }
            return
        }
        if (!multiple) {
            setPreviewImages([])
            setSelectedFiles([])
            if (opts?.confirmation) {
                toast.success("Cleared uploads")
            }
            return
        }
        toast.error("Failed to clear uploads")
    }

    // Upload files
    async function uploadFiles() {
        setIsUploading(true)

        const formData = new FormData()

        for (const image of selectedFiles) {
            formData.append("images", image)
        }

        try {
            const res = await fetch("http://localhost:3000/api/media", {
                method: "POST",
                body: formData,
                credentials: "include",
            })

            const response: { message: string; status: string } = await res.json()
            toast.success(response.message)
            clearUploads()
            setIsUploading(false)
        } catch (error: any) {
            toast.error(error.message)
            setIsUploading(false)
        }
    }

    if (isWrapper) return (
        <div
            {...getRootProps({
                className: cn(
                    styles["dropzone-wrapper"],
                    isDragActive && styles["dropzone--is-active"]
                ),
            })}
        >
            <input {...(getInputProps() as any)} />
            <div>{props.children}</div>
            {isDragActive && (
                <span className={styles.dropzone__text}>
                    <IconFileUpload />
                    <div>Drop files to upload</div>
                </span>
            )}
        </div>
    )

    return (
        <div className={styles.uploader}>
            {!hasImagesSelected && (
                <div
                    {...getRootProps({
                        className: cn(styles.dropzone, isDragActive && styles["dropzone--is-active"]),
                    })}
                >
                    <input {...(getInputProps() as any)} />
                    {!isDragActive && (
                        <span className={styles.dropzone__text}>
                            <IconDragDrop />
                            <div>Drag & drop files or click to select</div>
                        </span>
                    )}
                    {isDragActive && (
                        <span className={styles.dropzone__text}>
                            <IconFileUpload />
                            <div>Drop files to add to selection</div>
                        </span>
                    )}
                </div>
            )}

            {hasImagesSelected && (
                <>
                    {!hasSingleFileSelected && (
                        <div
                            {...getRootProps({
                                className: cn(
                                    styles.dropzone,
                                    styles.dropzone__tile,
                                    isDragActive && styles["dropzone--is-active"]
                                ),
                            })}
                        >
                            <input {...(getInputProps() as any)} />
                            {!isDragActive && (
                                <span className={styles.dropzone__text}>
                                    <IconFilePlus size={48} />
                                    <div>Drag & drop files or click to select more</div>
                                </span>
                            )}
                            {isDragActive && (
                                <span className={styles.dropzone__text}>
                                    <IconFileUpload />
                                    <div>Drop files to add to selection</div>
                                </span>
                            )}
                        </div>
                    )}

                    <div className={styles.uploader__images} ref={previewImagesContainer}>
                        {previewImages.map((img, index) => (
                            <div className={styles.uploader__image} key={index}>
                                <Image src={img} alt="" width={112} height={72} key={index} unoptimized />
                                <div>
                                    <div>{selectedFiles[index].name}</div>
                                    <div className="text-smoke-darkest">{convertBytes(selectedFiles[index].size)}</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.uploader__buttons}>
                        <Button disabled={isUploading} isLoading={isUploading} onClick={() => uploadFiles()}>
                            <IconCloudUpload />
                            Upload
                        </Button>
                        <Button disabled={isUploading} onClick={() => clearUploads({ confirmation: true })}>
                            <IconTrash />
                            Clear
                        </Button>
                    </div>
                </>
            )}

            {renderMode == "uploader" && (!hasImagesSelected || !hasSingleFileSelected) && (
                <div className={styles.uploader__browser__link}>
                    <MediaLibrary
                        renderMode="dialog"
                        trigger={
                            <div className={styles.uploader__ui__link}>
                                <IconLibraryPhoto />
                                Choose existing
                            </div>
                        }
                    />
                </div>
            )}
        </div>
    )
}
 */