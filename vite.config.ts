import {sentryVitePlugin} from '@sentry/vite-plugin';
import type {Plugin} from 'vite';
import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {oxygen} from '@shopify/mini-oxygen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

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
    tailwindcss(),
    hydrogen(),
    oxygen(),
    remix({
      presets: [hydrogen.preset()],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'sentry-sdks',
      project: 'abhi-hydrogen',
    }),
  ],
  build: {
    // Allow a strict Content-Security-Policy
    // withtout inlining assets as base64:
    assetsInlineLimit: 0,

    sourcemap: true,
  },
  resolve: {
    alias: [
      {
        find: 'node:async_hooks',
        replacement: '',
        customResolver: () => {},
      },
    ],
  },
  ssr: {
    external: ['node:async_hooks'],
    optimizeDeps: {
      /**
       * Include dependencies here if they throw CJS<>ESM errors.
       * For example, for the following error:
       *
       * > ReferenceError: module is not defined
       * >   at /Users/.../node_modules/example-dep/index.js:1:1
       *
       * Include 'example-dep' in the array below.
       * @see https://vitejs.dev/config/dep-optimization-options
       */
      include: ['hoist-non-react-statics'],
    },
  },
});
