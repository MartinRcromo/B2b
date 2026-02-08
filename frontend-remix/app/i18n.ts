export default {
  supportedLngs: ['es', 'en', 'pt', 'pt-BR'],
  fallbackLng: 'es',
  // Disabling suspense is recommended
  react: { useSuspense: false },
  backend: {
    loadPath: '../public/locales/{{lng}}/{{ns}}.json',
  },
};
