import ExampleClientComponent from '@/components/ExampleClientComponent';
import styles from './page.module.css';
import LanguageChanger from '@/components/LanguageChanger';
import Link from 'next/link';
import getTranslations from '../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';
import ExampleServerComponent from '@/components/ExampleServerComponent';
import localePath from '@/localePath';

async function Home() {
  const { t, resources, locale } = await getTranslations('home');

  return (
    <TranslationsProvider
      namespace="home"
      locale={locale}
      resources={resources}>
      <main className={styles.main}>
        <ExampleServerComponent />
        <ExampleClientComponent />
        <Link href={localePath(locale, '/about')}>{t('page2')}</Link>
        <LanguageChanger />
      </main>
    </TranslationsProvider>
  );
}

export default Home;
