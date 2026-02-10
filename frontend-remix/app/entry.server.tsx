import type { EntryContext } from '@remix-run/server-runtime';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';

import { createInstance } from 'i18next';
import { getI18NextServer, getPlatformBackendApiCtx } from './i18next.server';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from './i18n';
import { safeRequireNodeDependency } from '~/utils/platform-adapter';

const ABORT_DELAY = 5000;

// Runtime check for Web Streams API support
// This function prevents build-time optimization by the bundler
function shouldUseWebStreams(): boolean {
  // Check at runtime if we're in Cloudflare Pages (CF_PAGES=1)
  // Vercel and Netlify use Node.js runtime, so they should use renderToPipeableStream
  if (typeof process !== 'undefined' && process.env) {
    const isCfPages = process.env.CF_PAGES === '1';
    const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === 'true';
    const isNetlify = process.env.NETLIFY === 'true';

    // Only use Web Streams for Cloudflare Pages
    // Vercel and Netlify should always use Node.js streams
    if (isVercel || isNetlify) {
      return false;
    }
    if (isCfPages) {
      return true;
    }
  }

  // If process is undefined, we're likely in an edge runtime
  // But for safety, default to Node.js streams
  return false;
}

async function handleWebStreamsRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  _remixContext: EntryContext,
  jsx: JSX.Element,
) {
  const ReactDOM = await import('react-dom/server');
  const body = await (ReactDOM as any).renderToReadableStream(jsx, {
    signal: request.signal,
    onError(error: unknown) {
      console.error(error);
      responseStatusCode = 500;
    },
  });

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

async function handleNodeRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  _remixContext: EntryContext,
  jsx: JSX.Element,
): Promise<Response> {
  const ReactDOM = await import('react-dom/server');
  let callbackName = isbot(request.headers.get('user-agent'))
    ? 'onAllReady'
    : 'onShellReady';

  return new Promise((resolve, reject) => {
    let didError = false;

    let { pipe, abort } = (ReactDOM as any).renderToPipeableStream(jsx, {
      [callbackName]: async () => {
        const { PassThrough } = await safeRequireNodeDependency('node:stream');

        const { createReadableStreamFromReadable } =
          await safeRequireNodeDependency('@remix-run/node');

        const body = new PassThrough();
        const stream = createReadableStreamFromReadable(body);
        responseHeaders.set('Content-Type', 'text/html');

        resolve(
          new Response(stream, {
            headers: responseHeaders,
            status: didError ? 500 : responseStatusCode,
          }),
        );
        pipe(body);
      },
      onShellError(error: unknown) {
        reject(error);
      },
      onError(error: unknown) {
        didError = true;
        console.error(error);
      },
    });

    setTimeout(abort, ABORT_DELAY);
  });
}

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  let instance = createInstance();
  let lng = await getI18NextServer().then((i18next) =>
    i18next.getLocale(request),
  );

  await instance
    .use(initReactI18next)
    .use(await getPlatformBackendApiCtx())
    .init({
      ...i18n,
      lng,
    });

  const jsx = (
    <I18nextProvider i18n={instance}>
      <RemixServer context={remixContext} url={request.url} />
    </I18nextProvider>
  );

  // Runtime decision - cannot be optimized away by bundler
  if (shouldUseWebStreams()) {
    return handleWebStreamsRequest(
      request,
      responseStatusCode,
      responseHeaders,
      remixContext,
      jsx,
    );
  }

  return handleNodeRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext,
    jsx,
  );
}
