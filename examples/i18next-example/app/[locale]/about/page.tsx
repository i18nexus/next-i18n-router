import BackButton from './BackButton';
import styles from '../page.module.css';
import LanguageChanger from '@/components/LanguageChanger';
import TranslationsProvider from '@/components/TranslationsProvider';
import getTranslations from '@/app/i18n';

async function About() {
  const { t, resources, locale } = await getTranslations('about');

  return (
    <TranslationsProvider
      namespace="about"
      locale={locale}
      resources={resources}>
      <main className={styles.main}>
        <h1>{t('about_header')}</h1>
        <BackButton />
        <LanguageChanger />
      </main>
    </TranslationsProvider>
  );
}

export default About;
