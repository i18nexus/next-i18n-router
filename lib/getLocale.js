const { match } = require('@formatjs/intl-localematcher');
const Negotiator = require('negotiator');

const getLocale = (request, { locales, defaultLocale, localeCookie }) => {
  const negotiatorHeaders = {};

  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  if (localeCookie) {
    const cookieValue = request.cookies.get(localeCookie);

    if (locales.includes(cookieValue)) {
      return cookieValue;
    }
  }

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  return match(languages, locales, defaultLocale);
};

module.exports = getLocale;
