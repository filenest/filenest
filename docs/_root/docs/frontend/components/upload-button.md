# UploadButton

The `UploadButton` component can trigger an upload of all files in a queue to a remote data source.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `asChild`

**Type:** `boolean`

### `references`
The name of an `Uploader` component this button references.

**Type:** `string`  
**Required**

## Usage

`UploadButton` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.Uploader name="my-uploader">
        Click to select files
    </Filenest.Uploader>

    <Filenest.UploadButton references="my-uploader">
        Upload
    </Filenest.UploadButton>
</Filenest.Root>
```