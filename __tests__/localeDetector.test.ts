import localeDetector from '../src/localeDetector';
import mockRequest from './fixtures/mockRequest';

describe('localeDetector', () => {
  it('should return en when en is in both lists', () => {
    const request = mockRequest('/', ['en-US', 'en']);

    const config = {
      locales: ['jp', 'en'],
      defaultLocale: 'jp'
    };

    expect(localeDetector(request, config)).toBe('en');
  });

  it('should return en when request uses en-US', () => {
    const request = mockRequest('/', ['en-US']);

    const config = {
      locales: ['jp', 'en'],
      defaultLocale: 'jp'
    };

    expect(localeDetector(request, config)).toBe('en');
  });

  it('should return en-US when request uses en', () => {
    const request = mockRequest('/', ['en']);

    const config = {
      locales: ['jp', 'en-US'],
      defaultLocale: 'jp'
    };

    expect(localeDetector(request, config)).toBe('en-US');
  });

  it('should use defaultLocale when request uses en', () => {
    const request = mockRequest('/', ['en']);

    const config = {
      locales: ['jp', 'zh'],
      defaultLocale: 'jp'
    };

    expect(localeDetector(request, config)).toBe('jp');
  });
});
