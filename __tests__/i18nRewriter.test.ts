import { Rewrite } from '../src/i18nRewriter';
import { i18nRewriter } from '../src';
import { Config } from '../src/types';

describe('i18nRewriter', () => {
  it('returns an array of rewrites with prefix for non-default locales', () => {
    const config: Config = {
      locales: ['en', 'fr', 'es'],
      defaultLocale: 'en'
    };

    const expectedRewrites: Rewrite[] = [
      { source: '/fr', destination: '/' },
      { source: '/es', destination: '/' },
      { source: '/fr/:path*', destination: '/:path*' },
      { source: '/es/:path*', destination: '/:path*' }
    ];

    const rewrites = i18nRewriter(config);

    expect(rewrites.length).toBe(expectedRewrites.length);
    expect(rewrites).toEqual(expect.arrayContaining(expectedRewrites));
  });

  it('returns an array of rewrites with prefix for default and non-default locales', () => {
    const config: Config = {
      locales: ['en', 'fr', 'es'],
      defaultLocale: 'en',
      prefixDefault: true
    };

    const expectedRewrites: Rewrite[] = [
      { source: '/en', destination: '/' },
      { source: '/fr', destination: '/' },
      { source: '/es', destination: '/' },
      { source: '/en/:path*', destination: '/:path*' },
      { source: '/fr/:path*', destination: '/:path*' },
      { source: '/es/:path*', destination: '/:path*' }
    ];

    const rewrites = i18nRewriter(config);

    expect(rewrites.length).toBe(expectedRewrites.length);
    expect(rewrites).toEqual(expect.arrayContaining(expectedRewrites));
  });

  it('returns an array no rewrite when there is only one locale', () => {
    const configWithSingleLocale: Config = {
      locales: ['en'],
      defaultLocale: 'en'
    };

    const expectedRewrites: Rewrite[] = [];

    const rewrites = i18nRewriter(configWithSingleLocale);

    expect(rewrites.length).toBe(expectedRewrites.length);
    expect(rewrites).toEqual(expect.arrayContaining(expectedRewrites));
  });

  it('returns an array of 2 rewrites when there is only one locale and prefixLocale is true', () => {
    const configWithSingleLocale: Config = {
      locales: ['en'],
      defaultLocale: 'en',
      prefixDefault: true
    };

    const expectedRewrites: Rewrite[] = [
      { source: '/en', destination: '/' },
      { source: '/en/:path*', destination: '/:path*' }
    ];

    const rewrites = i18nRewriter(configWithSingleLocale);

    expect(rewrites.length).toBe(expectedRewrites.length);
    expect(rewrites).toEqual(expect.arrayContaining(expectedRewrites));
  });
});
