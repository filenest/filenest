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
git@github.com:filenest/filenest.git
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
I wanted to move quickly and publish it as fast as possible.

Tests will be added incrementally.

**Please open an issue or create a discussion if you want to take the initiative to add tests.**

## Project overview

This project is a monorepo using [Turborepo](https://turbo.build/repo/docs).
All packages are located in the `packages` directory.

wip