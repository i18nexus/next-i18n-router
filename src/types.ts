import { NextRequest } from 'next/server';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export interface Config {
  locales: readonly string[];
  defaultLocale: string;
  localeCookie?: string;
  localeDetector?: ((request: NextRequest, config: Config) => string) | false;
  prefixDefault?: boolean;
  permanentRedirect?: boolean;
  noPrefix?: boolean;
  basePath?: string;
  serverSetCookie?: 'if-empty' | 'always' | 'never';
  cookieOptions?: Partial<ResponseCookie>;
}
