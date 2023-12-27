import { NextRequest } from 'next/server';

export default function mockRequest(
  pathname: string,
  acceptLanguages?: string[],
  cookie?: string
): NextRequest {
  const mockHeaders: { [key: string]: any } = {};

  if (acceptLanguages) {
    mockHeaders['accept-language'] = acceptLanguages.join(',') + ';q=0.9';
  }

  const url = 'https://example.com' + pathname;

  const headers = new Headers({
    ...mockHeaders,
    cookie: `NEXT_LOCALE=${cookie}`
  });

  return new NextRequest(url, { headers });
}
