import { i18nRouter } from 'next-i18n-router';
import i18nConfig from './i18nConfig';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  return i18nRouter(request, i18nConfig);
}

// Skip API routes, Next.js internals, and static files.
export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)'
};
