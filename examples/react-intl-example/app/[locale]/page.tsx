import getIntl from './intl';
import ServerIntlProvider from '@/components/ServerIntlProvider';
import ExampleClientComponent from '@/components/ExampleClientComponent';
import styles from './page.module.css';
import LanguageChanger from '@/components/LanguageChanger';
import Link from 'next/link';
import localePath from '@/localePath';
import ExampleServerComponent from '@/components/ExampleServerComponent';

async function Home() {
  const intl = await getIntl();

  return (
    <ServerIntlProvider messages={intl.messages} locale={intl.locale}>
      <main className={styles.main}>
        <ExampleServerComponent />
        <ExampleClientComponent />
        <Link href={localePath(intl.locale, '/about')}>
          {intl.formatMessage({ id: 'page2' })}
        </Link>
        <LanguageChanger />
      </main>
    </ServerIntlProvider>
  );
}

export default Home;
