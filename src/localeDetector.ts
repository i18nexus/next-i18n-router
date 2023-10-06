import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest } from 'next/server';
import { Config } from './types';

function localeDetector(request: NextRequest, config: Config): string {
  const negotiatorHeaders: Record<string, string> = {};

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // in case of no accept-language header
  // https://stackoverflow.com/questions/76447732/nextjs-13-i18n-incorrect-locale-information-provided
  if (!languages || (languages.length === 1 && languages[0] === '*')) {
    return config.defaultLocale;
  }

  return match(languages, config.locales, config.defaultLocale);
}

export default localeDetector;
