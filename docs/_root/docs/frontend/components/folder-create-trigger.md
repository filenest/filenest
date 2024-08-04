# FolderCreateTrigger

The `FolderCreateTrigger` will append a temporary folder to your list of folders in the current path.
Inputting a folder name will create a new real folder with that name.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `asChild`

**Type:** `boolean`

## Usage

`FolderCreateTrigger` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.FolderList>
        <Filenest.FolderCreateTrigger>
            Add folder
        </Filenest.FolderCreateTrigger>
    </Filenest.FolderList>
</Filenest.Root>
```