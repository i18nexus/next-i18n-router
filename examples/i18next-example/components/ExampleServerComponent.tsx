import getTranslations from '@/app/i18n';

export default async function ExampleServerComponent() {
  const { t } = await getTranslations('home');

  return <h1>{t('header')}</h1>;
}
