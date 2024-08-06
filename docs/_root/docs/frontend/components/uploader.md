# Uploader

The `Uploader` component handles file selection.
It uses [`react-dropzone`](https://react-dropzone.js.org/) under the hood.
It must reference an `Uploader` component to find files to upload.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

### `disabled`

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