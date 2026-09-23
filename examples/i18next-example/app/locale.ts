import { locale } from 'next/root-params';
import { notFound } from 'next/navigation';
import i18nConfig from '@/i18nConfig';

export default async function getLocale() {
  const currentLocale = await locale();

  if (!i18nConfig.locales.includes(currentLocale)) {
    notFound();
  }

  return currentLocale;
}
