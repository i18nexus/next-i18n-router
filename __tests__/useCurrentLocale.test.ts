import { useCurrentLocale } from '../src/client';

let pathname: string | null;

jest.mock('next/navigation', () => ({
  usePathname() {
    return pathname;
  }
}));

const basePaths = ['', '/with-basepath'];

basePaths.forEach(basePath => {
  describe(`useCurrentLocale${basePath ? ' with basePath' : ''}`, () => {
    it('should return locale at base URL', () => {
      pathname = `/de`;

      const config = {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        basePath
      };

      expect(useCurrentLocale(config)).toEqual('de');
    });

    it('should return locale at base URL with trailing slash', () => {
      pathname = `/de/`;

      const config = {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        basePath
      };

      expect(useCurrentLocale(config)).toEqual('de');
    });

    it('should return locale with path segments', () => {
      pathname = `/de/products/2`;

      const config = {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        basePath
      };

      expect(useCurrentLocale(config)).toEqual('de');
    });

    it('should return defaultLocale when no locale in path', () => {
      pathname = `/products/2`;

      const config = {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        basePath
      };

      expect(useCurrentLocale(config)).toEqual('en');
    });

    it('should return undefined when no locale and prefixDefault is true', () => {
      pathname = `/products/2`;

      const config = {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        prefixDefault: true,
        basePath
      };

      expect(useCurrentLocale(config)).toEqual(undefined);
    });

    it('should return cookie locale when noPrefix is true and cookie set', () => {
      pathname = `/products/2`;

      const config = {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        noPrefix: true,
        basePath
      };

      expect(
        useCurrentLocale(config, 'random_cookie=sdf; NEXT_LOCALE=de')
      ).toEqual('de');
    });

    it('should return defaultLocale when noPrefix is true and no cookie set', () => {
      pathname = `/products/2`;

      const config = {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        noPrefix: true,
        basePath
      };

      expect(useCurrentLocale(config, 'random_cookie=sdf')).toEqual('en');
    });

    it('should return defaultLocale when pathname is null', () => {
      pathname = null;

      const config = {
        defaultLocale: 'en',
        locales: ['en', 'de'],
        basePath
      };

      expect(useCurrentLocale(config)).toEqual('en');
    });
  });
});
