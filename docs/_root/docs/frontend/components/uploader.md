# Uploader

The `Uploader` component handles file selection.
It uses [`react-dropzone`](https://react-dropzone.js.org/) under the hood.
It must reference an `Uploader` component to find files to upload.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `accept`
For example: `{"image/*": [".png", ".gif", ".jpeg", ".jpg"]}`

**Type:** `{[key: string]: string[]}`

### `asChild`

**Type:** `boolean`

### `disabled`

**Type:** `boolean`

### `hideIfMaxFilesReached`
Hides the uploader if the maximum number of files has been reached.  
Also hides it, if a single file is selected and `multiple` is set to `false`.

**Type:** `boolean`

### `name`
A unique name for this uploader. Allows other components like `Queue` and `UploadButton` to reference this uploader.

**Type:** `string`  
**Required**

### `noDrop`
Prevents the user from dropping files into the uploader.

**Type:** `boolean`

### `noClick`
Prevents the user from clicking the uploader to select files.

**Type:** `boolean`

### `maxFiles`

**Type:** `number`

### `maxSize`

**Type:** `number`  
**Default:** `2.5e8` (250 MB)

### `multiple`
Allows selection of multiple files.

**Type:** `boolean`  
**Default:** `true`

### `onProgress`
A function to be called whenever a file's upload progress changes.

**Type:** `(progress: number) => void`

### `onUpload`
A function to be called whenever a file from the queue is uploaded.

**Type:** `(file: File) => void`

### `onSuccess`
A function to be called when all files of the queue are uploaded successfully.

**Type:** `() => void`

### `onError`
A function to be called when an error occurs during file upload.

**Type:** `(message: string) => void`

## Render Props

### `isDragActive`
It is recommended to use the `DropIndicator` component to conditionally
render elements based on drag status.

**Type:** `boolean`

## Usage

`Uploader` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.Uploader name="my-uploader">
        Click or drop to select files
    </Filenest.Uploader>
</Filenest.Root>
```