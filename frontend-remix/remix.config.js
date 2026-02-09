import { createRoutesFromFolders } from '@remix-run/v1-route-convention';

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const commonConfig = {
  appDirectory: 'app',
  serverModuleFormat: 'esm',
  serverDependenciesToBundle: [
    'remix-i18next',
    '@remix-validated-form/with-zod',
  ],
  tailwind: true,
  routes(defineRoutes) {
    // uses the v1 convention, works in v1.15+ and v2
    return createRoutesFromFolders(defineRoutes);
  },
};

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const cloudflarePagesConfig = {
  serverBuildPath: 'functions/[[path]].js',
  serverPlatform: 'neutral',
  server: './server-cloudflare-pages.js',
  ignoredRouteFiles: ['**/.*'],
  serverMinify: true,
  ...commonConfig,
};
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const netlifyConfig = {
  serverBuildPath: 'netlify/functions/server.js',
  server: './server-netlify.js',
  serverModuleFormat: 'cjs',
  ignoredRouteFiles: ['**/.*'],
  ...commonConfig,
};
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const vercelConfig = {
  ignoredRouteFiles: ['**/.*'],
  serverModuleFormat: 'esm',
  ...commonConfig,
};
/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const devConfig = {
  appDirectory: 'app',
  serverModuleFormat: 'cjs',
  devServerPort: 8002,
  ignoredRouteFiles: ['.*'],
  ...commonConfig,
};

/**
 * @type {import('@remix-run/dev').AppConfig}
 */
const buildConfig = {
  appDirectory: 'app',
  assetsBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'build',
  ignoredRouteFiles: ['.*'],
  ...commonConfig,
};

function selectConfig() {
  // Vercel sets VERCEL=1 during build
  if (process.env.VERCEL) return vercelConfig;
  if (process.env.CF_PAGES) return cloudflarePagesConfig;
  if (process.env.NETLIFY) return netlifyConfig;
  if (process.env.NODE_ENV === 'development') return devConfig;
  // Default to build config for production or undefined NODE_ENV
  return buildConfig;
}

export default selectConfig();
