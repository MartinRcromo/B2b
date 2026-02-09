import { RemixI18Next } from 'remix-i18next';
import i18n from '~/i18n';
import { RemixI18NextOption } from 'remix-i18next/build/server';
import resourcesToBackend from 'i18next-resources-to-backend';
import { findLanguageJSON } from '~/languages.server';

// Always use resources backend for serverless compatibility
export async function getPlatformBackendApiCtx() {
  return resourcesToBackend(findLanguageJSON);
}

export async function platformAdapti18nConfig(config: RemixI18NextOption) {
  const backend = await getPlatformBackendApiCtx();
  if (Array.isArray(config.plugins)) {
    config.plugins = [...config.plugins, backend];
  } else {
    config.plugins = [backend];
  }
  return config;
}

export async function getI18NextServer() {
  return platformAdapti18nConfig({
    detection: {
      supportedLanguages: i18n.supportedLngs,
      fallbackLanguage: i18n.fallbackLng,
    },
    i18next: {
      ...i18n,
    },
    plugins: [],
  }).then((config) => new RemixI18Next(config));
}

export async function getFixedT(request: Request) {
  return getI18NextServer().then((i18next) => i18next.getFixedT(request));
}
