import { headers } from 'next/headers';

const currentLocale = (): string | null => {
  return headers().get('x-next-i18n-router-locale');
};

export default currentLocale;
