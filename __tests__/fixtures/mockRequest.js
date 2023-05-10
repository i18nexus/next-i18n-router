function mockRequest(pathname, acceptLanguages, cookie) {
  const mockHeaders = {
    'accept-language': acceptLanguages.join(',') + ';q=0.9'
  };

  return {
    nextUrl: { pathname },
    headers: {
      ...mockHeaders,
      forEach: function (callback) {
        for (const name in this) {
          if (typeof this[name] !== 'function') {
            callback(this[name], name, this);
          }
        }
      }
    },
    url: 'https://example.com/',
    cookies: {
      get: jest.fn().mockReturnValue(cookie)
    }
  };
}

module.exports = mockRequest;
