# ReloadButton

The `ReloadButton` component re-fetches the assets in the current folder.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `asChild`

**Type:** `boolean`

## Render Props
You can use render props to access button state.

### `isLoading`

**Type:** `boolean`

## Usage

`ReloadButton` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.ReloadButton>
        Reload
    </Filenest.ReloadButton>
</Filenest.Root>
```