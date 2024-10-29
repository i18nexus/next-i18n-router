import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

// only applies this middleware to files in the app directory
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};
