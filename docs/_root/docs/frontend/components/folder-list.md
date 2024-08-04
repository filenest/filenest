# FolderList

The `FolderList` component is used to render a list of folders under the current path.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

## Render Props
You can use render props to access all available folders at the current path.

### `folders`

**Type:** `Folder[] | undefined`

### `isLoading`

**Type:** `boolean`

## Usage

`FolderList` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.FolderList>
        {({ folders }) => 
            folders?.map((folder) => (
                <Filenest.Folder key={folder.id} folder={folder}>
                    <Filenest.ResourceName />
                </Filenest.Folder>
            )
        )}
    </Filenest.FolderList>
</Filenest.Root>
```