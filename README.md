# Hydrogen + Sentry

This is an example repo that shows you you can set up your Hydrogen app with Sentry.

It uses `@sentry/remix` to instrument client-side, and `@sentry/cloudflare` to instrument server-side.

## Installation

To start, first use the sentry-wizard to install `@sentry/remix` on your app. You can do this by running:

```bash
npx @sentry/wizard@latest -i remix
```

Then remove all server-side sentry imports. This includes removing `instrumentation.server.mjs` and sentry related code in `entry.server.tsx`.

Then install `@sentry/cloudflare`:

```bash
npm install @sentry/cloudflare
```

Update your `server.ts` to use `@sentry/cloudflare`:

```typescript
import {wrapRequestHandler} from '@sentry/cloudflare';

/**
 * Export a fetch handler in module format.
 */
export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    return wrapRequestHandler(
      {
        options: {
          dsn: 'YOUR_DSN_HERE',
          tracesSampleRate: 1.0,
        },
        // Need to cast to any because this is not on cloudflare
        request: request as any,
        context: executionContext,
      },
      async () => {
        // request handling logic
      },
    );
  },
};
```

To remove errors relating to `node:async_hooks` (which is included in the sdk, but not used by `wrapRequestHandler`), add a custom vite plugin that will alias it to an empty module:

```typescript
export function removeAsyncHooksPlugin(): Plugin {
  return {
    name: 'remove-async-hooks',
    load: (id) => {
      if (id === 'node:async_hooks') {
        return 'export default {}';
      }
    },
  };
}

export default defineConfig({
  plugins: [
    removeAsyncHooksPlugin(),
    // rest of your plugins
  ],
});
```

# Hydrogen template: Skeleton

Hydrogen is Shopify’s stack for headless commerce. Hydrogen is designed to dovetail with [Remix](https://remix.run/), Shopify’s full stack web framework. This template contains a **minimal setup** of components, queries and tooling to get started with Hydrogen.

[Check out Hydrogen docs](https://shopify.dev/custom-storefronts/hydrogen)
[Get familiar with Remix](https://remix.run/docs/en/v1)

## What's included

- Remix
- Hydrogen
- Oxygen
- Vite
- Shopify CLI
- ESLint
- Prettier
- GraphQL generator
- TypeScript and JavaScript flavors
- Minimal setup of components and routes

## Getting started

**Requirements:**

- Node.js version 18.0.0 or higher

```bash
npm create @shopify/hydrogen@latest
```

## Building for production

```bash
npm run build
```

## Local development

```bash
npm run dev
```

## Setup for using Customer Account API (`/account` section)

Follow step 1 and 2 of <https://shopify.dev/docs/custom-storefronts/building-with-the-customer-account-api/hydrogen#step-1-set-up-a-public-domain-for-local-development>
