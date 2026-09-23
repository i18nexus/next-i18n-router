import { cache } from 'react';
import { createInstance } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import i18nConfig from '@/i18nConfig';
import getLocale from '@/app/locale';

const getTranslations = cache(async (namespace: string) => {
  const locale = await getLocale();
  const i18n = createInstance();

  await i18n
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`@/locales/${language}/${namespace}.json`)
      )
    )
    .init({
      lng: locale,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      defaultNS: namespace,
      ns: [namespace],
      initAsync: false,
      interpolation: { escapeValue: false }
    });

  return {
    locale,
    resources: i18n.services.resourceStore.data,
    t: i18n.t
  };
});

export default getTranslations;
