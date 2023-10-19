import getIntl from './intl';
import ServerIntlProvider from '@/components/ServerIntlProvider';
import ExampleClientComponent from '@/components/ExampleClientComponent';
import styles from './page.module.css';
import LanguageChanger from '@/components/LanguageChanger';
import Link from 'next/link';

async function Home({ params: { locale } }: { params: { locale: string } }) {
  const intl = await getIntl(locale);

  return (
    <ServerIntlProvider messages={intl.messages} locale={intl.locale}>
      <main className={styles.main}>
        <h1>{intl.formatMessage({ id: 'header' })}</h1>
        <ExampleClientComponent />
        <Link href="/about">{intl.formatMessage({ id: 'page2' })}</Link>
        <LanguageChanger />
      </main>
    </ServerIntlProvider>
  );
}

export default Home;
