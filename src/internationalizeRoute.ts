import defaultGetLocale from './getLocale';
import validateConfig from './validateConfig';
import { NextRequest, NextResponse } from 'next/server';
import { Config } from './types';

function internationalizeRoute(
  request: NextRequest,
  config: Config
): NextResponse {
  if (!request) {
    throw new Error(`internationalizeRoute requires a request argument.`);
  }

  if (!config) {
    throw new Error(`internationalizeRoute requires a config argument`);
  }

  const {
    locales,
    defaultLocale,
    localeCookie = 'NEXT_LOCALE',
    getLocale = defaultGetLocale
  } = config;

  validateConfig(config);

  const pathname = request.nextUrl.pathname;

  const pathLocale = locales.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathLocale) {
    let locale = getLocale(request, {
      locales,
      defaultLocale,
      localeCookie
    });

    if (!locales.includes(locale)) {
      console.warn("The getLocale callback must return a locale included in your locales array. Reverting to using defaultLocale.")
      
      locale = defaultLocale;
    }

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  const response = NextResponse.next();

  response.headers.set('x-next-i18n-router-locale', pathLocale);

  return response;
}

export default internationalizeRoute;
