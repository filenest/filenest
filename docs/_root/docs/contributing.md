# Contributing

Thanks for showing interest in contributing! Contributions of any kind are welcome.

You can contribute to Filenest by
- [Adding or improving features or fixing bugs](#development-workflow)
- [Improving documentation](#documentation)
- [Reporting bugs](https://github.com/filenest/filenest/issues)

## Development workflow

This project uses [pnpm](https://pnpm.io/) as the package manager. Make sure to install it first.

### Initial installation

```sh
git clone git@github.com:filenest/filenest.git
cd filenest
pnpm install
pnpm build
```

### Running the project

You'll need to open multiple terminals to run the project.

First, run the following command in the root dir
to start the watcher to build all packages on file changes.

```sh
pnpm dev
```

In another terminal, you can run an example app to test your changes.  
If you want to add a new adapter, please also add an example app to test it.

```sh
cd examples/nextjs-trpc
pnpm dev
```

### Documentation

To run the docs development server, run the following command in the root dir.

```sh
pnpm docs:dev
```

You can build the docs by running:

```sh
pnpm docs:build
```

### Testing

Filenest was initially created without any tests,
because it was first designed for personal use.
When I decided to turn it into an open-source project,
I wanted to move quickly and publish it as fast as possible to focus on my main project.

Tests will be added incrementally, while the library is in beta.

**Please open an issue or create a discussion if you want to take the initiative to add tests.**

## Project overview

This project is a monorepo using [Turborepo](https://turbo.build/repo/docs).
All packages are located in the `packages` directory.

### `@filenest/core`

The core package contains the `Provider` interface which all providers must implement.

### `@filenest/provider-<provider>`

Each provider package contains the implementation of the `Provider` interface for a specific provider.

It's important to use as few dependencies as possible and to avoid large SDKs (e.g. AWS SDK or Cloudinary SDK).

Each provider package should communicate with the provider's REST API via plain `fetch`.

#### Adding a new provider

Some provider methods must return specific error messages,
so `@filenest/react` can respond by showing alert dialogs, for example.

- `deleteFolder` should return `{ success: false, message: "ERR_FOLDER_NOT_EMPTY" }`
when trying to delete a non-empty folder.
- `renameAsset` should return `{ success: false, message: "ERR_DELIVERY_URL_WILL_CHANGE" }`
when renaming an asset would change its delivery URL.
- `renameAsset` should return `{ success: false, message: "ERR_UPDATE_DELIVERY_URL_REQUIRED" }`
when renaming an asset would change the display name only, and can optionally change the delivery URL.

Also, make sure to prefix private methods and properties with an underscore `_`.

**For implementation details, or as a guide to implement a new provider,**
**check out the [Cloudinary provider](https://github.com/filenest/filenest/blob/next/packages/provider-cloudinary/src/index.ts).**

#### We might need to change the `react` package

Uploading files is done by getting a signed URL from the Filenest API
and uploading files to the provider directly from the client.

[That code](https://github.com/filenest/filenest/blob/next/packages/react/src/context/global/FileQueueContext.tsx#L132-L184)
is currently tailored to Cloudinary, as that was the first provider, but it should be abstracted to work with any provider.

For example, Cloudinary needs a `file` parameter to upload a file.
[See this line of code](https://github.com/filenest/filenest/blob/next/packages/react/src/context/global/FileQueueContext.tsx#L153)  
Other providers might work differently and need different parameters, so this will need to be refactored.

One way could be to implement a `provider.getProvider()` method that returns the provider name as a string.  
With that result, we could switch between different upload implementations. There are probably better ways.

### `@filenest/adapter-<adapter>`

An adapter basically wraps a provider and returns its methods
in a way to conform to a framework's API.

If you want to add a new adapter, please also add an example app to test it.

#### Middleware

If possible, an adapter should accept global or per-route middleware,
so that a user can add authorization, logging, etc.

Check out the [tRPC Adapter](https://github.com/filenest/filenest/blob/next/packages/adapter-trpc/src/index.ts) for an example.

### `@filenest/react`

This package contains all frontend components.

Talking to the Filenest API is done using a [fetchers](https://github.com/filenest/filenest/blob/next/packages/react/src/utils/fetchers.ts) util,
which is [made available in the `Global Context`](https://github.com/filenest/filenest/blob/next/packages/react/src/context/global/GlobalContext.tsx#L70).