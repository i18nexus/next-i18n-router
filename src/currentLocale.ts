import { headers } from 'next/headers';

const currentLocale = (): string | undefined => {
  // header should always be present
  return headers().get('x-next-i18n-router-locale') || undefined;
};

export default currentLocale;
