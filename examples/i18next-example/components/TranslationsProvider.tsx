'use client';

import { I18nextProvider } from 'react-i18next';
import { ReactNode, useMemo } from 'react';
import initTranslations from '@/app/i18n';
import { Resource, createInstance } from 'i18next';

export default function TranslationsProvider({
  children,
  locale,
  namespaces,
  resources
}: {
  children: ReactNode;
  locale: string;
  namespaces: string[];
  resources: Resource;
}) {
  const i18n = useMemo(() => {
    const instance = createInstance();

    initTranslations(locale, namespaces, instance, resources);

    return instance;
  }, [locale, namespaces, resources]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
