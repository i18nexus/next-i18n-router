'server-only';

import { createIntl } from '@formatjs/intl';
import { MessageFormatElement } from 'react-intl';

const getMessages = async (
  locale: string
): Promise<Record<string, MessageFormatElement[]> | Record<string, string>> => {
  return (await import(`@/messages/${locale}.json`)).default;
};

export default async function getIntl(locale: string) {
  return createIntl({
    locale: locale,
    messages: await getMessages(locale)
  });
}
