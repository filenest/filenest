# AssetList

The `AssetList` component displays all of the assets (files) from a folder of your remote source.

You can select multiple assets by holding `shift` or `ctrl`. Perform actions on selected assets using the `Toolbar` component.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

## Render Props
You can use render props to access the assets and the lists loading state.

### `assets`

**Type:** `Array<Asset & { isLoading: boolean, isSelected: boolean }> | undefined`

### `isLoading`
True, if a fetch request for a specific query runs for the first time.

**Type:** `boolean`

### `isLoadingMore`
The `AssetList` has infinite loading capabilities when used together with the [`LoadMoreButton`](/docs/frontend/components/load-more-button).
This prop indicates if Filenest is currently fetching more assets.

**Type:** `boolean`

## Usage

`AssetList` must be used inside a `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.AssetList>
        {({ assets }) => (
            <div>
                {assets?.map((asset) => (
                    <Filenest.Asset key={asset.assetId} asset={asset}>
                        <Filenest.ResourceName />
                    </Filenest.Asset>
                ))}
            </div>
        )}
    </Filenest.AssetList>
</Filenest.Root>
```