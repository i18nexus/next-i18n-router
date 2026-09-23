import { cache } from 'react';
import { createIntl, createIntlCache } from 'react-intl/server';
import getLocale from '@/app/locale';

const formatterCache = createIntlCache();

const getIntl = cache(async () => {
  const locale = await getLocale();

  return createIntl(
    {
      locale,
      defaultLocale: 'en',
      messages: (await import(`@/messages/${locale}.json`)).default
    },
    formatterCache
  );
});

export default getIntl;
