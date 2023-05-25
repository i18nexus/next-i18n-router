const defaultGetLocale = require('./getLocale');
const validateConfig = require('./validateConfig');
const { NextResponse } = require('next/server');

function internationalizeRoute(request, config) {
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
    const locale = getLocale(request, {
      locales: locales,
      defaultLocale: defaultLocale,
      localeCookie: localeCookie
    });

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  const response = NextResponse.next();

  response.headers.set('x-next-i18n-router-locale', pathLocale);

  return response;
}

module.exports = internationalizeRoute;
