import defaultLocaleDetector from './localeDetector';
import validateConfig from './validateConfig';
import { NextRequest, NextResponse } from 'next/server';
import { Config } from './types';

function i18nRouter(
  request: NextRequest,
  config: Config,
  response?: NextResponse
): NextResponse {
  if (!request) {
    throw new Error(`i18nRouter requires a request argument.`);
  }

  if (!config) {
    throw new Error(`i18nRouter requires a config argument`);
  }

  const {
    locales,
    defaultLocale,
    localeCookie = 'NEXT_LOCALE',
    localeDetector = defaultLocaleDetector,
    prefixDefault = false,
    basePath = ''
  } = config;

  validateConfig(config);

  const pathname = request.nextUrl.pathname;
  const basePathTrailingSlash = basePath.endsWith('/');

  const pathLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathLocale) {
    let locale;

    if (localeCookie) {
      const cookieValue = request.cookies.get(localeCookie)?.value;

      if (cookieValue && config.locales.includes(cookieValue)) {
        locale = cookieValue;
      }
    }

    if (!locale) {
      if (localeDetector === false) {
        locale = defaultLocale;
      } else {
        locale = localeDetector(request, config);
      }
    }

    if (!locales.includes(locale)) {
      console.warn(
        'The localeDetector callback must return a locale included in your locales array. Reverting to using defaultLocale.'
      );

      locale = defaultLocale;
    }

    if (prefixDefault || locale !== defaultLocale) {
      let path = `${locale}${pathname}`;

      if (request.nextUrl.search) {
        path += request.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(
          `${basePath}${basePathTrailingSlash ? '' : '/'}${path}`,
          request.url
        )
      );
    }
  }

  if (!prefixDefault && pathLocale === defaultLocale) {
    let path = pathname.slice(`/${defaultLocale}`.length) || '/';

    if (basePathTrailingSlash) {
      path = path.slice(1);
    }

    if (request.nextUrl.search) {
      path += request.nextUrl.search;
    }

    return NextResponse.redirect(new URL(`${basePath}${path}`, request.url));
  }

  if (!response) {
    response = NextResponse.next();
  }

  response.headers.set(
    'x-next-i18n-router-locale',
    pathLocale || defaultLocale
  );

  return response;
}

export default i18nRouter;
