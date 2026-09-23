import i18nConfig from './i18nConfig';

export default function localePath(locale: string, pathname = '/') {
  if (
    i18nConfig.noPrefix ||
    (locale === i18nConfig.defaultLocale && !i18nConfig.prefixDefault)
  ) {
    return pathname;
  }

  return `/${locale}${pathname === '/' ? '' : pathname}`;
}
