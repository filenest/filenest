# Queue

The `Queue` component renders a list of upload-ready files.
It must reference an `Uploader` component to find files to display.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

### `references`
The name of an `Uploader` component this queue references.

**Type:** `string`  
**Required**

## Render Props

### `clearQueue`
It is recommended to use the `ClearQueueButton` component instead.

**Type:** `() => void`

### `files`

**Type:** `QueueFile[]`

### `isUploading`

**Type:** `boolean`

### `progress`
Total upload progress of all files in the queue in percent.

**Type:** `number`

## Usage

`Queue` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.Uploader name="my-uploader">
        Click to select files
    </Filenest.Uploader>

    <Filenest.Queue references="my-uploader">
        {({ files }) => (
            <div>
                {files.map((f) => (
                    <div key={f.file.name}>
                        <div>{f.file.name}</div>
                        <Filenest.RemoveFromQueueButton file={f}>
                            Remove
                        </Filenest.RemoveFromQueueButton>
                    </div>
                ))}
                <Filenest.UploadButton references="my-uploader">
                    Upload
                </Filenest.UploadButton>
                <Filenest.ClearQueueButton>
                    Clear queue
                </Filenest.ClearQueueButton>
            </div>
        )}
    </Filenest.Queue>
</Filenest.Root>
```

### QueueFile
When mapping over the `files` array in a `Queue`, you can access each file's loading state and progress.

```ts
interface QueueFile {
    uploaderName: string
    file: File
    isUploading: boolean
    isSuccess: boolean
    progress: number // in percent
}
```