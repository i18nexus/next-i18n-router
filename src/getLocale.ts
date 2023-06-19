import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest } from 'next/server';
import { Config } from './types';

function getLocale(request: NextRequest, config: Config): string {
  const negotiatorHeaders: Record<string, string> = {};

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  if (config.localeCookie) {
    const cookieValue = request.cookies.get(config.localeCookie)?.value;

    if (cookieValue && config.locales.includes(cookieValue)) {
      return cookieValue;
    }
  }

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return match(languages, config.locales, config.defaultLocale);
}

export default getLocale;
