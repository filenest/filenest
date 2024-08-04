# NavigationItem

The `NavigationItem` component handles navigating through the folder structure.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

### `folder`

**Type:** `Folder`  
**Required**

## Usage

`NavigationItem` must be used inside a `Navigation` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root>
    <Filenest.Navigation>
        {({ navigation }) =>
            navigation.map((folder, index) => (
                <Filenest.NavigationItem folder={folder} key={index}>
                    {folder.name}
                </Filenest.NavigationItem>
            ))
        }
    </Filenest.Navigation>
</Filenest.Root>
```