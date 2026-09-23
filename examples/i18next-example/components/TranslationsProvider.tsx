'use client';

import { I18nextProvider, initReactI18next } from 'react-i18next';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { createInstance } from 'i18next';
import type { Resource } from 'i18next';
import i18nConfig from '@/i18nConfig';

export default function TranslationsProvider({
  children,
  locale,
  namespace,
  resources
}: {
  children: ReactNode;
  locale: string;
  namespace: string;
  resources: Resource;
}) {
  const i18n = useMemo(() => {
    const instance = createInstance();
    // Resources are already loaded on the server, so initialization is synchronous.
    instance.use(initReactI18next).init({
      lng: locale,
      resources,
      ns: [namespace],
      defaultNS: namespace,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      initAsync: false,
      interpolation: { escapeValue: false }
    });
    return instance;
  }, [locale, namespace, resources]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
