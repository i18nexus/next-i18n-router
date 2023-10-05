import { Config } from 'next-i18n-router/dist/types';

const i18nConfig: Config = {
  locales: ['en', 'de', 'ja'],
  defaultLocale: 'en',
  routingStrategy: 'dynamicSegment'
};

export default i18nConfig;
