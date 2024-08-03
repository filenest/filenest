# AssetDetails

The `AssetDetails` component can display advanced details of the last clicked asset.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

## Render Props
To view advanced details of a file, click on an `Asset` in an `AssetList`
and the details of that asset will be available as a render prop
in the `AssetDetails` component.

### `asset`

**Type:** `Asset & { isLoading: boolean, isSelected: boolean }`

## Usage

`AssetDetails` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.AssetDetails>
        {({ asset }) => (
            {asset && (
                <Filenest.Asset asset={asset}>
                    <Filenest.ResourceName />
                </Filenest.Asset>
            )}
        )}
    </Filenest.AssetDetails>
</Filenest.Root>
```