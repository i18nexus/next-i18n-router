import { Config } from './types';

export interface Rewrite {
  source: string;
  destination: string;
}

function i18nRewriter(config: Config): Rewrite[] {
  const { locales, defaultLocale, prefixDefault } = config;

  const rewrites: Rewrite[] = [];

  locales.forEach(locale => {
    if (locale === defaultLocale && !prefixDefault) {
      return;
    }

    rewrites.push({
      source: `/${locale}`,
      destination: `/`
    });

    rewrites.push({
      source: `/${locale}/:path*`,
      destination: `/:path*`
    });
  });

  return rewrites;
}

export default i18nRewriter;
