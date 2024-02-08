import { NextRequest } from 'next/server';

export interface Config {
  locales: readonly string[];
  defaultLocale: string;
  localeCookie?: string;
  localeDetector?: ((request: NextRequest, config: Config) => string) | false;
  prefixDefault?: boolean;
  basePath?: string;
  serverSetCookie?: 'if-empty' | 'always' | 'never';
}
