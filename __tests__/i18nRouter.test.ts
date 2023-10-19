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
        basePath
      };

      // @ts-ignore
      expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
        /locales/
      );
    });

    it('should throw an error if defaultLocale is not defined', () => {
      const config = { locales: ['en-US'], basePath };

      // @ts-ignore
      expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
        /defaultLocale/
      );
    });

    it('should throw an error if defaultLocale is not in locales array', () => {
      const config = {
        locales: ['en-US'],
        defaultLocale: 'invalid',
        basePath
      };
      expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
        /defaultLocale/
      );
    });

    it('should throw an error if localeDetector is not a function', () => {
      const config = {
        locales: ['en-US'],
        defaultLocale: 'en-US',
        localeDetector: 'invalid',
        basePath
      };

      // @ts-ignore
      expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
        /localeDetector/
      );
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
        basePath
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
        basePath
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
        basePath
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
        basePath
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/jp/faq`, 'https://example.com')
      );
    });

    it('should redirect to the base path when prefixed with default and prefixDefault is false', () => {
      const mockRedirect = jest.fn();
      NextResponse.redirect = mockRedirect;

      const request = mockRequest('/en/faq', ['en']);

      i18nRouter(request, {
        locales: ['en', 'jp'],
        defaultLocale: 'en',
        basePath
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
        basePath
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
        basePath
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
        basePath
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
        basePath
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
        basePath
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
        basePath
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        new URL(`${basePath}/jp/faq`, 'https://example.com')
      );
    });
  });
});
