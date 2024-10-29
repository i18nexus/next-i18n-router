import ExampleClientComponent from '@/components/ExampleClientComponent';
import styles from './page.module.css';
import LanguageChanger from '@/components/LanguageChanger';
import Link from 'next/link';
import initTranslations from '../i18n';
import TranslationsProvider from '@/components/TranslationsProvider';

const i18nNamespaces = ['home'];

async function Home(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;

  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <TranslationsProvider
      namespaces={i18nNamespaces}
      locale={locale}
      resources={resources}>
      <main className={styles.main}>
        <h1>{t('header')}</h1>
        <ExampleClientComponent />
        <Link href="/about">{t('page2')}</Link>
        <LanguageChanger />
      </main>
    </TranslationsProvider>
  );
}

export default Home;
