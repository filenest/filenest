# FolderActionTrigger

The `FolderActionTrigger` component can trigger renaming or deletion of a folder.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `action`

**Type:** `"remove" | "rename" | "navigateTo"`  
**Required**

::: details More Information
Because `delete` is a reserved keyword in JavaScript, the delete action is named `remove` to avoid conflicts.
:::

### `asChild`

**Type:** `boolean`

## Usage

`FolderActionTrigger` must be used inside a `Folder` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.FolderList>
        {({ folders }) => 
            folders?.map((folder) => (
                <Filenest.Folder key={folder.id} folder={folder}>
                    <Filenest.ResourceName />
                    <Filenest.FolderActionTrigger action="remove">
                        Delete
                    </Filenest.FolderActionTrigger>
                </Filenest.Folder>
            )
        )}
    </Filenest.FolderList>
</Filenest.Root>
```