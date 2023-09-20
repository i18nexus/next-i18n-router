'server-only';

import i18nConfig from '@/i18nConfig';
import { createIntl } from '@formatjs/intl';
import { currentLocale } from 'next-i18n-router';
import { MessageFormatElement } from 'react-intl';

const getMessages = async (
  lang: string
): Promise<Record<string, MessageFormatElement[]> | Record<string, string>> => {
  return (await import(`@/messages/${lang}.json`)).default;
};

export default async function getIntl() {
  const lang = currentLocale() || i18nConfig.defaultLocale;

  return createIntl({
    locale: lang,
    messages: await getMessages(lang)
  });
}
