# Quick Start

:::warning{title="Heads-Up"}
Filenest is currently in its early development stage.
**The API may change without warning until the first major release.**  
The list of supported frameworks will expand in the future.
If your preferred provider or adapter is not available,
consider contributing to Filenest.
:::

## 1. Set up a Provider
A provider is responsible for making requests to a third-party service to retrieve your data and handle asset management.
Find your provider in the list below and learn how to set it up in your backend:

- [Cloudinary](/docs/backend/providers/cloudinary)

## 2. Configure an Adapter
An adapter creates API routes for your backend. You can use an adapter if your
backend framework is supported, or manually integrate the required
API routes if your framework is not supported. This may require a bit more effort.

- [Next.js Route Handlers](/docs/backend/adapters/nextjs-route-handlers)
- [tRPC](/docs/backend/adapters/trpc)
- [Manual Integration](/docs/backend/adapters/custom-integration)

## 3. Build your UI using Components
Build your asset management UI using React components.
Similar to Radix UI, all the logic is pre-defined at the component level, allowing you to focus solely on styling.
Check out [how to build your file manager using Filenest components](/docs/frontend/minimal-setup).

You can learn more about individual components [here](/docs/frontend/about-components).