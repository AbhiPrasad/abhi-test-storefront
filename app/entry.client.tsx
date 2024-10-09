import * as Sentry from '@sentry/remix';
import {RemixBrowser, useLocation, useMatches} from '@remix-run/react';
import {startTransition, StrictMode, useEffect} from 'react';
import {hydrateRoot} from 'react-dom/client';

Sentry.init({
  dsn: 'YOUR_DSN',
  tracesSampleRate: 1,

  debug: true,

  integrations: [
    Sentry.browserTracingIntegration({
      useEffect,
      useLocation,
      useMatches,
    }),
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
});

if (!window.location.origin.includes('webcache.googleusercontent.com')) {
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <RemixBrowser />
      </StrictMode>,
    );
  });
}
