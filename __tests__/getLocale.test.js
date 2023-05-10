const getLocale = require('../lib/getLocale');
const mockRequest = require('./fixtures/mockRequest');

describe('getLocale', () => {
  it('should return en when en is in both lists', () => {
    const request = mockRequest('/', ['en-US', 'en']);

    const config = {
      locales: ['jp', 'en'],
      defaultLocale: 'jp'
    };

    expect(getLocale(request, config)).toBe('en');
  });

  it('should return en when request uses en-US', () => {
    const request = mockRequest('/', ['en-US']);

    const config = {
      locales: ['jp', 'en'],
      defaultLocale: 'jp'
    };

    expect(getLocale(request, config)).toBe('en');
  });

  it('should return en-US when request uses en', () => {
    const request = mockRequest('/', ['en']);

    const config = {
      locales: ['jp', 'en-US'],
      defaultLocale: 'jp'
    };

    expect(getLocale(request, config)).toBe('en-US');
  });

  it('should use defaultLocale when request uses en', () => {
    const request = mockRequest('/', ['en']);

    const config = {
      locales: ['jp', 'zh'],
      defaultLocale: 'jp'
    };

    expect(getLocale(request, config)).toBe('jp');
  });

  it('should use defaultLocale when cookie value is not in locales', () => {
    const request = mockRequest('/', ['en'], 'fr');

    const config = {
      locales: ['jp', 'zh'],
      defaultLocale: 'jp',
      localeCookie: 'locale'
    };

    expect(getLocale(request, config)).toBe('jp');
  });

  it('should use defaultLocale when cookie is not set', () => {
    const request = mockRequest('/', ['en'], null);

    const config = {
      locales: ['jp', 'zh'],
      defaultLocale: 'jp',
      localeCookie: 'locale'
    };

    expect(getLocale(request, config)).toBe('jp');
  });

  it('should use defaultLocale when cookie is empty string', () => {
    const request = mockRequest('/', ['en'], '');

    const config = {
      locales: ['jp', 'zh'],
      defaultLocale: 'jp',
      localeCookie: 'locale'
    };

    expect(getLocale(request, config)).toBe('jp');
  });
});
