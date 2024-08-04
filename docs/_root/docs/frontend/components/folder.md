# Folder

The `Folder` component is used to render a folder, which on click will navigate a level deeper.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

### `folder`
For data handling purposes, a folder must be passed in as a prop.

**Type:** `Folder`  
**Required**

## Render Props
You can use render props to access folder state.

### `isLoading`

**Type:** `boolean`

### `isRenaming`

**Type:** `boolean`

## Usage

`Folder` must be used inside a `FolderList` component.

:::info Important to know
Use the `ResourceName` component to display the folder's name, instead of accessing `{folder.name}` directly. See [ResourceName](/docs/frontend/components/resource-name).
:::

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.FolderList>
        {({ folders }) => 
            folders?.map((folder) => (
                <Filenest.Folder key={folder.id} folder={folder}>
                    {({ isLoading }) => (
                        <div>
                            {isLoading ? "🔄" : "📁"}
                            <Filenest.ResourceName />
                        </div>
                    )}
                </Filenest.Folder>
            )
        )}
    </Filenest.FolderList>
</Filenest.Root>
```