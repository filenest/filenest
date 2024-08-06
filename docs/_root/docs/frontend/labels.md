# Labels

Filenest uses some hardcoded text strings that are displayed in the UI.
For example alert messages.

### Default labels

| Label                             | Default value |
| --------------------------------- | ------------- |
| `alert.folderNestedContent.title` | Are you sure you want to delete this folder? |
| `alert.folderNestedContent.text`  | This folder is not empty. All nested assets and folders will be permanently deleted. |
| `alert.folderNestedContent.cancel`| Cancel |
| `alert.folderNestedContent.commit`| Delete folder and all contents |
| `alert.deliveryUrlChange.title`   | Confirm your changes |
| `alert.deliveryUrlChange.text`    | Changing the name of your file will result in a new delivery URL. All existing URLs to this file will break. |
| `alert.deliveryUrlChange.cancel`  | Cancel |
| `alert.deliveryUrlChange.commit`  | Rename file |
| `alert.deliveryUrlRequired.title` | Update URL aswell? |
| `alert.deliveryUrlRequired.text`  | You are about to change the display name of this file. The URL of this file will not change. Do you want to update the URL aswell? Warning: All existing URLs to this file will break. |
| `alert.deliveryUrlRequired.cancel`| Change display name only |
| `alert.deliveryUrlRequired.commit`| Change name and URL |

### Overriding default labels

You can override the default labels by providing a custom `labels` prop to the `Root` component.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root
    labels={{
        "alert.folderNestedContent.title": "Your custom label text",
    }}
>
    /* All of your other Filenest components */
</Filenest.Root>
```