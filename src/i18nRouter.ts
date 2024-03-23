import defaultLocaleDetector from './localeDetector';
import validateConfig from './validateConfig';
import { NextRequest, NextResponse } from 'next/server';
import { Config } from './types';

function i18nRouter(request: NextRequest, config: Config): NextResponse {
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
    basePath = '',
    serverSetCookie = 'always',
    noPrefix = false
  } = config;

  validateConfig(config);

  const pathname = request.nextUrl.pathname;
  const basePathTrailingSlash = basePath.endsWith('/');

  const responseOptions = {
    request: {
      headers: new Headers(request.headers)
    }
  };

  let response = NextResponse.next(responseOptions);

  let cookieLocale;
  // check cookie for locale
  if (localeCookie) {
    const cookieValue = request.cookies.get(localeCookie)?.value;

    if (cookieValue && config.locales.includes(cookieValue)) {
      cookieLocale = cookieValue;
    }
  }

  if (noPrefix) {
    let locale = cookieLocale || defaultLocale;

    let newPath = `${locale}${pathname}`;

    newPath = `${basePath}${basePathTrailingSlash ? '' : '/'}${newPath}`;

    if (request.nextUrl.search) {
      newPath += request.nextUrl.search;
    }

    response = NextResponse.rewrite(
      new URL(newPath, request.url),
      responseOptions
    );

    response.headers.set('x-next-i18n-router-locale', locale);

    return response;
  }

  const pathLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathLocale) {
    let locale = cookieLocale;

    // if no cookie, detect locale with localeDetector
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

    let newPath = `${locale}${pathname}`;

    newPath = `${basePath}${basePathTrailingSlash ? '' : '/'}${newPath}`;

    if (request.nextUrl.search) {
      newPath += request.nextUrl.search;
    }

    // redirect to prefixed path
    if (prefixDefault || locale !== defaultLocale) {
      return NextResponse.redirect(new URL(newPath, request.url));
    }

    // If we get here, we're using the defaultLocale.
    if (!prefixDefault) {
      response = NextResponse.rewrite(
        new URL(newPath, request.url),
        responseOptions
      );
    }
  } else {
    if (cookieLocale && cookieLocale !== pathLocale) {
      // if always, do not redirect to cookieLocale
      if (serverSetCookie !== 'always') {
        let newPath = pathname.replace(`/${pathLocale}`, `/${cookieLocale}`);

        if (request.nextUrl.search) {
          newPath += request.nextUrl.search;
        }

        if (basePathTrailingSlash) {
          newPath = newPath.slice(1);
        }

        newPath = `${basePath}${newPath}`;

        response = NextResponse.redirect(new URL(newPath, request.url));
      }
    }

    // If /default, redirect to /
    if (!prefixDefault && pathLocale === defaultLocale) {
      let pathWithoutLocale = pathname.slice(`/${pathLocale}`.length) || '/';

      if (basePathTrailingSlash) {
        pathWithoutLocale = pathWithoutLocale.slice(1);
      }

      if (request.nextUrl.search) {
        pathWithoutLocale += request.nextUrl.search;
      }

      response = NextResponse.redirect(
        new URL(`${basePath}${pathWithoutLocale}`, request.url)
      );
    }

    const setCookie = () => {
      response.cookies.set(localeCookie, pathLocale, {
        path: request.nextUrl.basePath || undefined,
        sameSite: 'strict',
        maxAge: 31536000 // expires after one year
      });
    };

    if (serverSetCookie !== 'never') {
      if (
        cookieLocale &&
        cookieLocale !== pathLocale &&
        serverSetCookie === 'always'
      ) {
        setCookie();
      } else if (!cookieLocale) {
        setCookie();
      }
    }
  }

  response.headers.set(
    'x-next-i18n-router-locale',
    pathLocale || defaultLocale
  );

  return response;
}

export default i18nRouter;
