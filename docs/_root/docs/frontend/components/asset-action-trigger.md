# AssetActionTrigger

The `AssetActionTrigger` component can trigger selection, renaming, or deletion of an asset.

## Props

This component extends `React.ComponentPropsWithoutRef<"button">`, meaning it accepts all native `button` element props.

### `action`
Define the action the button should trigger.

`"remove"` triggers a confirmation modal to delete the asset.

`"rename"` displays an input to change the asset name.
See [`ResourceName`](/docs/frontend/components/resource-name) for more info.

`"select"` calls the `onAssetSelect` function defined as a prop on the `Root` component.

**Type:** `"remove" | "rename" | "select"`  
**Required**

::: details More Information
Because `delete` is a reserved keyword in JavaScript, the delete action is named `remove` to avoid conflicts.
:::

### `asChild`

**Type:** `boolean`

## Usage

`AssetActionTrigger` must be used inside an `Asset` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.AssetDetails>
        {({ asset }) => (
            {asset && (
                <Filenest.Asset asset={asset}>
                    <Filenest.ResourceName />
                    <Filenest.AssetActionTrigger action="remove">
                        Delete
                    </Filenest.AssetActionTrigger>
                </Filenest.Asset>
            )}
        )}
    </Filenest.AssetDetails>
</Filenest.Root>
```