# SearchBar

The `SearchBar` component can be used to search for assets globally or in the current folder, respectively.

## Props

This component extends `React.ComponentPropsWithoutRef<"input">`, meaning it accepts all native `input` element props.

### `asChild`

**Type:** `boolean`

### `location`
Where to search for assets.

`"current"` searches in the current folder only.

`"global"` searches globally (recommended).

**Type:** `"current" | "global"`

## Usage

`SearchBar` must be used inside a `Root` component.

:::tip
You can specify either a `minLength` or `min` prop, to control when a new fetch request should be triggered.
:::

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.SearchBar location="global" />
</Filenest.Root>
```