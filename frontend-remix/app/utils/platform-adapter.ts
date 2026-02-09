// Check if running in serverless environment (Cloudflare Pages, Netlify, or Vercel)
// These environments have limited filesystem access
export const IS_CF_PAGES = typeof process === 'undefined' ||
  (typeof process !== 'undefined' && (
    process.env?.NETLIFY === 'true' ||
    process.env?.VERCEL === '1' ||
    process.env?.VERCEL === 'true'
  ));

// This hack is to prevent `node` modules/packages being bundled in the
// Cloudflare Pages context, which causes an error.
export async function safeRequireNodeDependency(module: string) {
  return import(module.split('').join(''));
}
