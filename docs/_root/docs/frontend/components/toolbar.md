# Toolbar

The `Toolbar` component is rendered when multiple assets are selected.
It acts as a container for various actions that can be performed on the selected assets.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

## Render Props

### `selectedFilesCount`

**Type:** `number`

## Usage

`Toolbar` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.Toolbar>
        {({ selectedFilesCount }) => (
            <div>
                <div>{selectedFilesCount} files selected</div>
                <Filenest.ToolbarDeleteButton>
                    Delete selected files
                </Filenest.ToolbarDeleteButton>
            </div>
        )}
    </Filenest.Toolbar>
</Filenest.Root>
```