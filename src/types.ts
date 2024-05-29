import { NextRequest, NextResponse } from 'next/server';

interface CookieOptions {
  domain?: string;
  path?: string;
  maxAge?: number;
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

export interface Config {
  locales: readonly string[];
  defaultLocale: string;
  localeCookie?: string;
  localeDetector?: ((request: NextRequest, config: Config) => string) | false;
  prefixDefault?: boolean;
  noPrefix?: boolean;
  basePath?: string;
  serverSetCookie?: 'if-empty' | 'always' | 'never';
  cookieOptions?: CookieOptions;
}
