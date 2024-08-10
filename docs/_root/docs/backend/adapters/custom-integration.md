---
title: Custom Integration
---

# Custom Integration

This guide explains how to add Filenest endpoints to your existing JS/TS API,
if there is no fitting adapter for your framework.

## Setup

At its core, an adapter is a wrapper around a provider
and returns the providers class methods in a specific way
to conform to a specific implementation.
To integrate Filenest into your existing API, you need to
manually create multiple endpoints, each calling a function from the provider.

Take a look at this **pseudo code** and imagine this was a real REST API.

You first instanciate a provider:

```ts title="/routes/index.ts"
import { Cloudinary } from "@filenest/provider-cloudinary"

const provider = new Cloudinary({...})
```

Next, create a request handler / endpoint for each public method of the provider.  
You can find a list of all required endpoints below.

:::warning Careful
Filenest currently only works with POST requests.
Make sure to only accept POST requests in your custom Filenest API endpoints.
:::

```ts title="/routes/index.ts"
const provider = new Cloudinary({...})

// You can replace `filenest` with any other route you like
app.post("/filenest/createFolder", async (req, res) => {
    const input = req.body
    const response = await provider.createFolder(input)
    return res.json(response)
})

app.post("/filenest/deleteAsset", async (req, res) => {
    const input = req.body
    const response = await provider.deleteAsset(input)
    return res.json(response)
})

app.post("/filenest/deleteFolder", async (req, res) => {
    const input = req.body
    const response = await provider.deleteFolder(input)
    return res.json(response)
})

app.post("/filenest/getResources", async (req, res) => {
    const input = req.body
    const response = await provider.getResources(input)
    return res.json(response)
})

app.post("/filenest/getUploadUrl", async (req, res) => {
    const input = req.body
    const response = await provider.getUploadUrl(input)
    return res.json(response)
})

app.post("/filenest/renameAsset", async (req, res) => {
    const input = req.body
    const response = await provider.renameAsset(input)
    return res.json(response)
})

app.post("/filenest/renameFolder", async (req, res) => {
    const input = req.body
    const response = await provider.renameFolder(input)
    return res.json(response)
})
```

### Frontend configuration

In the above example, the main API endpoint is `/filenest`.  
Make sure to pass this endpoint to the `Filenest.Root` component in your frontend.
If your API runs on a different host or port, you can also pass the full URL,
e.g. `https://api.example.com/filenest`.

```tsx
import { Filenest } from "@filenest/react"

<Filenest.Root endpoint="/filenest">
    /* All of your other Filenest components */
</Filenest.Root>
```

## Input validation

The Filenest core comes with input and output types for all data fetching methods - even `zod` schemas. You can validate the input data in your endpoints like this:

```ts title="/routes/index.ts"
import {
    CreateFolderInput,
    DeleteAssetInput,
    DeleteFolderInput,
    GetResourcesInput,
    GetUploadUrlInput,
    RenameAssetInput,
    RenameFolderInput,
} from "@filenest/core"

const provider = new Cloudinary({...})

app.post("/filenest/renameAsset", async (req, res) => {
    const input = req.body
    try {
        const validatedInput = RenameAssetInput.parse(input)
        const response = await provider.renameAsset(validatedInput)
        return res.json(response)
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
})
```

You do not need to add input validation, unless you plan to expose your API to the public
or access it in other ways than via the Filenest frontend components.