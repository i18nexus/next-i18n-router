const { NextResponse } = require('next/server');
const i18nRouter = require('../index');
const mockRequest = require('./fixtures/mockRequest');

describe('internationalizeRoutes', () => {
  it('should throw an error if locales is not an array', () => {
    const config = { locales: 'invalid', defaultLocale: 'en-US' };
    expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
      /locales/
    );
  });

  it('should throw an error if defaultLocale is not defined', () => {
    const config = { locales: ['en-US'] };
    expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
      /defaultLocale/
    );
  });

  it('should throw an error if defaultLocale is not in locales array', () => {
    const config = { locales: ['en-US'], defaultLocale: 'invalid' };
    expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
      /defaultLocale/
    );
  });

  it('should throw an error if getLocale is not a function', () => {
    const config = {
      locales: ['en-US'],
      defaultLocale: 'en-US',
      getLocale: 'invalid'
    };
    expect(() => i18nRouter(mockRequest('/', ['en']), config)).toThrow(
      /getLocale/
    );
  });

  it('should throw an error if request argument is missing', () => {
    expect(() => i18nRouter()).toThrow(/request/);
  });

  it('should redirect to the correct URL when a language subpath is missing', () => {
    const mockRedirect = jest.fn();
    NextResponse.redirect = mockRedirect;

    const request = mockRequest('/faq', ['en']);

    i18nRouter(request, {
      locales: ['en', 'jp'],
      defaultLocale: 'en'
    });

    expect(mockRedirect).toHaveBeenCalledWith(
      new URL(`/en/faq`, 'https://example.com')
    );
  });

  it('should not redirect when a language subpath is present with missing page', () => {
    const mockRedirect = jest.fn();
    NextResponse.redirect = mockRedirect;

    const request = mockRequest('/en/nonexistant', ['en']);

    i18nRouter(request, {
      locales: ['en', 'jp'],
      defaultLocale: 'en'
    });

    expect(mockRedirect).toHaveBeenCalledTimes(0);
  });

  it('should not redirect when a language subpath is present with real page', () => {
    const mockRedirect = jest.fn();
    NextResponse.redirect = mockRedirect;

    const request = mockRequest('/en/faq', ['en']);

    i18nRouter(request, {
      locales: ['en', 'jp'],
      defaultLocale: 'en'
    });

    expect(mockRedirect).toHaveBeenCalledTimes(0);
  });

  it('should not redirect when the page directory does not match any language subpath', () => {
    const mockRedirect = jest.fn();
    NextResponse.redirect = mockRedirect;

    const request = mockRequest('/faq', ['zh']);

    i18nRouter(request, {
      locales: ['en', 'jp'],
      defaultLocale: 'en'
    });

    // need more here

    expect(mockRedirect).toHaveBeenCalledTimes(1);
  });

  it('should redirect when first entry of path matches', () => {
    const mockRedirect = jest.fn();
    NextResponse.redirect = mockRedirect;

    const request = mockRequest('/faq/support', ['jp']);

    i18nRouter(request, {
      locales: ['en', 'jp'],
      defaultLocale: 'en'
    });

    expect(mockRedirect).toHaveBeenCalledWith(
      new URL(`/jp/faq/support`, 'https://example.com')
    );
  });

  it('should unfortunately redirect when first entry of path matches even if second page nonexistant', () => {
    const mockRedirect = jest.fn();
    NextResponse.redirect = mockRedirect;

    const request = mockRequest('/faq/nonexistant', ['en']);

    i18nRouter(request, {
      locales: ['en', 'jp'],
      defaultLocale: 'en'
    });

    expect(mockRedirect).toHaveBeenCalledWith(
      new URL(`/en/faq/nonexistant`, 'https://example.com')
    );
  });
});
