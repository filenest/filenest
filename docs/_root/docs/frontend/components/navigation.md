# Navigation

The `Navigation` component is responsible for rendering folder navigation levels,
making it easy to navigate through the folder structure.

## Props

This component extends `React.ComponentPropsWithoutRef<"div">`, meaning it accepts all native `div` element props.

### `asChild`

**Type:** `boolean`

## Render Props
You can use render props to access the navigation levels.

### `navigation`

**Type:** `Folder[]`

## Usage

`Navigation` must be used inside a `Root` component.

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