# ResourceName

The `ResourceName` component should be used to display the name of any folder or asset. While a folder or asset is being renamed,
this component displays an input field to edit the name.

## Props

This component extends `React.HTMLAttributes<HTMLElement>`, meaning it accepts all standard HTML element props.

## Usage

`ResourceName` must be used inside either an `Asset` or `Folder` component.

It is recommended to not exaggerate use of CSS styles on this component.
Remember, that the component returns either a `div` or an `input` element,
depending on the parent resources `isRenaming` state.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.FolderList>
        {({ folders }) => 
            folders?.map((folder) => (
                <Filenest.Folder key={folder.id} folder={folder}>
                    <Filenest.ResourceName /> // Use instead of {folder.name}
                </Filenest.Folder>
            )
        )}
    </Filenest.FolderList>
</Filenest.Root>
```

You can use `ResourceName` in combination with an action trigger to trigger renaming by clicking the resource name.
```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.AssetDetails>
        {({ asset }) => (
            <div>
                {asset && (
                    <Filenest.Asset asset={asset}>
                        <Filenest.AssetActionTrigger action="rename" asChild>
                            <Filenest.ResourceName />
                        </Filenest.AssetActionTrigger>
                    </Filenest.Asset>
                )}
            </div>
        )}
    </Filenest.AssetDetails>
</Filenest.Root>
```