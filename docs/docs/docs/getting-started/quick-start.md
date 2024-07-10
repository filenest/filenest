# Quick Start

:::warning{title="Heads-Up"}
Filenest is currently in its early development stage. The list of supported frameworks will expand in the future. If your preferred provider or adapter is not available, a contribution to Filenest would be highly appreciated.
:::

## 1. Set up a Provider
A provider is responsible for making requests to a third-party service to retrieve your data and handle asset management.
Find your provider in the list below and learn how to set it up in your backend:

- [Cloudinary](/docs/backend/providers/cloudinary)

## 2. Configure an Adapter
An adapter creates API routes for your backend. You can use an adapter if your backend framework is supported, or manually integrate the required API routes if your framework is not supported. This may require a bit more effort.

- [Next.js Route Handlers](/docs/backend/adapters/nextjs-route-handlers)
- [tRPC](/docs/adapters/trpc)
- [Manual Integration](/docs/backend/adapters/custom-integration)

## 3. Build your UI using Components
Build your asset management UI using components for your preferred frontend framework.
Similar to Radix UI, all the logic is pre-defined at the component level, allowing you to focus solely on styling.
Check out how to build your file manager using Filenest components:

- [React](/docs/frontend/react)

You can learn more about individual components [here](/docs/frontend/components/about).