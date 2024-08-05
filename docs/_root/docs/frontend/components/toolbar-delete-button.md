# ToolbarDeleteButton

The `ToolbarDeleteButton` component can delete multiple selected assets.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `asChild`

**Type:** `boolean`

## Usage

`ToolbarDeleteButton` must be used inside a `Toolbar` component.

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