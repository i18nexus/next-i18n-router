import { NextRequest } from 'next/server';

export default function mockRequest(
  pathname: string,
  acceptLanguages: string[],
  cookie?: string
): NextRequest {
  const mockHeaders: { [key: string]: any } = {
    'accept-language': acceptLanguages.join(',') + ';q=0.9'
  };

  const request: NextRequest = {
    // @ts-ignore
    nextUrl: { pathname },
    // @ts-ignore
    headers: {
      ...mockHeaders,
      forEach: function (callback: Function) {
        const _this: { [key: string]: any } = this;

        for (const name in this) {
          const value: any = _this[name];

          if (typeof value !== 'function') {
            callback(value, name, this);
          }
        }
      }
    },
    url: 'https://example.com/',
    // @ts-ignore
    cookies: {
      get: jest.fn().mockReturnValue(cookie ? { value: cookie } : undefined)
    }
  };

  return request;
}
