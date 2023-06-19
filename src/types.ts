import { NextRequest } from 'next/server';

export interface Config {
  locales: string[];
  defaultLocale: string;
  localeCookie?: string;
  getLocale?: (request: NextRequest, config: Config) => string;
}