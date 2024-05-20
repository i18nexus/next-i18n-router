import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { NextRequest } from 'next/server';
import { Config } from './types';

function localeDetector(request: NextRequest, config: Config): string {
  const negotiatorHeaders: Record<string, string> = {};

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  // match can only use specifically formatted locales
  // https://stackoverflow.com/questions/76447732/nextjs-13-i18n-incorrect-locale-information-provided
  try {
    return match(languages, config.locales, config.defaultLocale);
  } catch (e) {
    // invalid accept-language header

    return config.defaultLocale;
  }
}

export default localeDetector;
