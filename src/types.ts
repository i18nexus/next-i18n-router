import { NextRequest } from 'next/server';

export type RoutingStrategies = 'rewrite' | 'dynamicSegment';

export interface Config {
  locales: string[];
  defaultLocale: string;
  localeCookie?: string;
  localeDetector?: ((request: NextRequest, config: Config) => string) | false;
  prefixDefault?: boolean;
  basePath?: string;
  routingStrategy?: RoutingStrategies;
}
