import { NextResponse } from 'next/server';
import { i18nRouter } from '../src';
import mockRequest from './fixtures/mockRequest';

const basePaths = ['', '/with-basepath'];

basePaths.forEach(basePath => {
  describe(`i18nRouter${basePath ? ' with basePath' : ''}`, () => {
    it('should throw an error if locales is not an array', () => {
      const config = {
        locales: 'invalid',
        defaultLocale: 'en-US',
        basePath,
        serverSetCookie: 'never'
      };

      // @ts-ignore
      expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
        /locales/
      );
    });

    it('should throw an error if defaultLocale is not defined', () => {
      const config = { locales: ['en-US'], basePath, serverSetCookie: 'never' };

      // @ts-ignore
      expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
        /defaultLocale/
      );
    });

    it('should throw an error if defaultLocale is not in locales array', () => {
      expect(() =>
        i18nRouter(mockRequest('/', ['en']), {
          locales: ['en-US'],
          defaultLocale: 'invalid',
          basePath,
          serverSetCookie: 'never'
        })
      ).toThrow(/defaultLocale/);
    });

    it('should throw an error if localeDetector is not a function', () => {
      const config = {
        locales: ['en-US'],
        defaultLocale: 'en-US',
        localeDetector: 'invalid',
        basePath,
        serverSetCookie: 'never'
      };

      expect(() =>
        i18nRouter(mockRequest('/', ['en']), {
          locales: ['en-US'],
          defaultLocale: 'en-US',
          // @ts-ignore
          localeDetector: 'invalid',
          basePath,
          serverSetCookie: 'never'
        })
      ).toThrow(/localeDetector/);
    });

    it('should throw an error if request argument is missing', () => {
      // @ts-ignore
      expect(() => i18nRouter()).toThrow(/request/);
    });

    it('should not redirect when prefixDefault is false and defaultLocale matches accept-language', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq', ['en']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledTimes(0);
    });

    it('should redirect when prefixDefault is true and defaultLocale matches accept-language', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq', ['en']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        prefixDefault: true,
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/en/faq`, 'https://example.com')
      );
    });

    it('should redirect when prefixDefault is false and defaultLocale does not match accept-language', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq', ['jp']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/jp/faq`, 'https://example.com')
      );
    });

    it('should redirect when prefixDefault is true and defaultLocale does not match accept-language', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq', ['jp']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        prefixDefault: true,
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/jp/faq`, 'https://example.com')
      );
    });

    it('should redirect to the base path when prefixed with default and prefixDefault is false', () => {
      const mockRedirect = jest.fn().mockReturnValue(new NextResponse());
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/en/faq', ['en']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/faq`, 'https://example.com')
      );
    });

    it('should not redirect when a language subpath is present with real page', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/jp/faq', ['jp']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledTimes(0);
    });

    it('should not redirect when language does not match any language subpath and prefixDefault is false', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq', ['zh']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledTimes(0);
    });

    it('should redirect when first entry of path matches', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq/support', ['jp']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/jp/faq/support`, 'https://example.com')
      );
    });

    it('should use defaultLocale when cookie value is not in locales', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq', ['en'], 'fr');

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledTimes(0);
    });

    it('should use defaultLocale when cookie is empty string', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq', ['en'], '');

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledTimes(0);
    });

    it('should use cookie when cookie is valid', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/faq', ['en'], 'jp');

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/jp/faq`, 'https://example.com')
      );
    });

    it('should use cookie when cookie is different from path locale', () => {
      const mockRedirect = jest.fn().mockReturnValue(new NextResponse());
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/de/faq', ['en'], 'jp');

      i18nRouter(request, {
        locales: ['en', 'de', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'never'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/jp/faq`, 'https://example.com')
      );
    });

    it('should not redirect when serverSetCookie is always', () => {
      const mockRedirect = jest.fn().mockReturnValue(new NextResponse());
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/de/faq', ['en'], 'jp');

      i18nRouter(request, {
        locales: ['en', 'de', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'always'
      });

      expect(mockRedirect).toHaveBeenCalledTimes(0);
    });

    it('should redirect to no locale when default locale in bath and serverSetCookie is always', () => {
      const mockRedirect = jest.fn().mockReturnValue(new NextResponse());
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/en/faq', ['en'], 'jp');

      i18nRouter(request, {
        locales: ['en', 'de', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'always'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/faq`, 'https://example.com')
      );
    });

    it('should redirect when has cookie and serverSetCookie is if-empty', () => {
      const mockRedirect = jest.fn().mockReturnValue(new NextResponse());
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/de/faq', ['en'], 'jp');

      i18nRouter(request, {
        locales: ['en', 'de', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'if-empty'
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/jp/faq`, 'https://example.com')
      );
    });

    it('should not redirect to no cookie and serverSetCookie is if-empty', () => {
      const mockRedirect = jest.fn().mockReturnValue(new NextResponse());
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/de/faq', ['en']);

      i18nRouter(request, {
        locales: ['en', 'de', 'jp'],
        defaultLocale: 'en',
        basePath,
        serverSetCookie: 'if-empty'
      });

      expect(mockRedirect).toHaveBeenCalledTimes(0);
    });

    it('should not redirect when noPrefix is true', () => {
      const mockRedirect = jest.fn().mockReturnValue(new NextResponse());
      NextResponse.redirect = mockRedirect;

      const mockRewrite = jest.fn().mockReturnValue(new NextResponse());
      NextResponse.rewrite = mockRewrite;

      const request = mockRequest('/faq', ['en'], 'jp');

      i18nRouter(request, {
        locales: ['en', 'de', 'jp'],
        defaultLocale: 'en',
        basePath,
        noPrefix: true
      });

      expect(mockRedirect).toHaveBeenCalledTimes(0);
      expect(mockRewrite).toHaveBeenCalledTimes(1);
      expect(mockRewrite.mock.calls[0][0]).toEqual(
        new URL(`${basePath}/jp/faq`, 'https://example.com/faq')
      );
    });
  });
});
