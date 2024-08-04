# Root

The `Root` component must wrap all other Filenest components.

## Props

### `children`

**Type:** `React.ReactNode`  
**Required**

### `endpoint`
The main API endpoint Filenest will use to fetch data.  
For example: `/api/media` or `https://localhost:3000/api/media`

**Type:** `string`  
**Required**

### `endpointIsTRPC`
If your API uses tRPC, set this to `true`.  
Check if the `endpoint` prop is set correctly to use dots if your endpoint is a nested procedure, like `/trpc/admin.media`.

**Type:** `boolean`

### `labels`
Override the default labels used in Filenest components.  
For example, you can override the default alert text strings.

See [labels](/docs/frontend/labels) for a list of all available labels.

**Type:** `Record<string, string>`

### `onAssetSelect`
A function that is called when an asset is selected.  
Can be used to store the selected asset URL in a form state, for example.

**Type:** `(asset: Asset) => void`

## Usage

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root
    endpoint="/api/media"
    onAssetSelect={(asset) => alert(asset.url)}
>
    /* All of your other Filenest components */
</Filenest.Root>
```