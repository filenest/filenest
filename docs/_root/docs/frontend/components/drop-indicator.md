# DropIndicator

The `DropIndicator` component will render when dragging files onto an `Uploader`.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

## Usage

`DropIndicator` must be used inside an `Uploader` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.Uploader>
        <Filenest.DropIndicator>
            Drop files to upload
        </Filenest.DropIndicator>
    </Filenest.Uploader>
</Filenest.Root>
```