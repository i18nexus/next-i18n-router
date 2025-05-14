'use client';

import { Config } from '../types';
import { usePathname } from 'next/navigation';

const getCookie = (name: string, documentCookie: string) => {
  let cookies = documentCookie;
  let cookieArray = cookies.split('; ');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookiePair = cookieArray[i].split('=');
    if (cookiePair[0] === name) {
      return cookiePair[1];
    }
  }
  return null;
};

const useCurrentLocale = (
  i18nConfig: Config,
  documentCookie?: string
): string | undefined => {
  const { basePath = '', locales } = i18nConfig;

  if (!documentCookie && typeof window !== 'undefined') {
    documentCookie = document.cookie;
  }

  if (documentCookie) {
    const cookieLocale = getCookie(
      i18nConfig.localeCookie || 'NEXT_LOCALE',
      documentCookie
    );

    if (cookieLocale && locales.includes(cookieLocale)) {
      return cookieLocale;
    }
  }

  if (i18nConfig.noPrefix) {
    return i18nConfig.defaultLocale;
  }

  const currentPathname = usePathname();

  const locale = locales.find(locale => {
    // remove trailing slash if present
    let base = basePath.replace(/\/$/, '');
    // server does not include basePath in usePathname
    // https://github.com/vercel/next.js/issues/46562
    if (typeof window === 'undefined') {
      base = '';
    }

    return (
      currentPathname === `${base}/${locale}` ||
      // While the return type of usePathname is string, there are times when usePathname returns null, so we need to null check:
      // https://nextjs.org/docs/app/api-reference/functions/use-pathname
      currentPathname?.startsWith(`${base}/${locale}/`)
    );
  });

  if (locale) {
    return locale;
  }

  if (!i18nConfig.prefixDefault) {
    return i18nConfig.defaultLocale;
  } else {
    return undefined;
  }
};

export default useCurrentLocale;
