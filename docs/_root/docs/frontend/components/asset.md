# Asset

The `Asset` component should wrap a displayed asset (file).

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asset`
For data handling purposes, an asset must be passed in as a prop.

**Type:** `Asset & { isLoading: boolean, isSelected: boolean }`  
**Required**

### `asChild`

**Type:** `boolean`

## Usage

`Asset` must be used inside an `AssetList` or `AssetDetails` component, respectively.

:::info Important to know
Use the `ResourceName` component to display the asset's name, instead of accessing `{asset.name}` directly. See [ResourceName](/docs/frontend/components/resource-name).
:::

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.AssetList>
        {({ assets }) => 
            assets?.map((asset) => (
                <Filenest.Asset key={asset.assetId} asset={asset}>
                    <Filenest.ResourceName />
                </Filenest.Asset>
            ))}
    </Filenest.AssetList>

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