# RemoveFromQueueButton

The `RemoveFromQueueButton` component can remove a file from the upload queue.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `asChild`

**Type:** `boolean`

### `file`

**Type:** `QueueFile`  
**Required**

## Usage

`RemoveFromQueueButton` must be used inside a `Queue` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.Queue>
        {({ files }) =>
            files.map((f) => (
                <div key={f.file.name}>
                    <div>{f.file.name}</div>
                    <Filenest.RemoveFromQueueButton file={f}>
                        Remove
                    </Filenest.RemoveFromQueueButton>
                </div>
            )
        )}
    </Filenest.Queue>
</Filenest.Root>
```