// Platform detection for different serverless environments
// Each platform has different APIs and capabilities

// Helper to safely check environment variables
const getEnvVar = (key: string): string | undefined => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Cloudflare Pages - uses Web Streams API (renderToReadableStream)
// Only true when explicitly running on Cloudflare Pages
export const IS_CF_PAGES = getEnvVar('CF_PAGES') === '1';

// Vercel - uses Node.js runtime (renderToPipeableStream)
export const IS_VERCEL = getEnvVar('VERCEL') === '1' || getEnvVar('VERCEL') === 'true';

// Netlify - uses Node.js runtime (renderToPipeableStream)
export const IS_NETLIFY = getEnvVar('NETLIFY') === 'true';

// Any serverless environment (limited filesystem access)
// Used for i18n configuration to avoid fs-backend
export const IS_SERVERLESS = IS_CF_PAGES || IS_VERCEL || IS_NETLIFY;

// Check if we're in an environment without Node.js process object
// This is used to determine if we need Web Streams API
export const IS_EDGE_RUNTIME = typeof process === 'undefined';

// Use Web Streams API only for Cloudflare Pages or true edge runtime without Node.js
export const USE_WEB_STREAMS = IS_CF_PAGES || (IS_EDGE_RUNTIME && !IS_VERCEL && !IS_NETLIFY);

// This hack is to prevent `node` modules/packages being bundled in the
// Cloudflare Pages context, which causes an error.
export async function safeRequireNodeDependency(module: string) {
  return import(module.split('').join(''));
}
