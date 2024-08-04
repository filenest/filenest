# LoadMoreButton

The `LoadMoreButton` component fetches more assets in an infinite loading style.
The component is only rendered when there are more assets to fetch.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `asChild`

**Type:** `boolean`

## Usage

`LoadMoreButton` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.AssetList>
        <Filenest.LoadMoreButton>
            Load more
        </Filenest.LoadMoreButton>
    </Filenest.AssetList>
</Filenest.Root>
```