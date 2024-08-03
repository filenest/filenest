# ClearQueueButton

The `ClearQueueButton` component removes all files from an upload queue.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `asChild`

**Type:** `boolean`

## Usage

`ClearQueueButton` must be used inside a `Queue` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.Queue>
        <Filenest.ClearQueueButton>
            Clear queue
        </Filenest.ClearQueueButton>
    </Filenest.Queue>
</Filenest.Root>
```