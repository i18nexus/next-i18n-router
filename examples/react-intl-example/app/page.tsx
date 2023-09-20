import getIntl from './intl';
import ServerIntlProvider from '@/components/ServerIntlProvider';
import ExampleClientComponent from '@/components/ExampleClientComponent';
import styles from './page.module.css';
import LanguageChanger from '@/components/LanguageChanger';

async function Home() {
  const intl = await getIntl();

  return (
    <ServerIntlProvider messages={intl.messages} locale={intl.locale}>
      <main className={styles.main}>
        <h1>{intl.formatMessage({ id: 'header' })}</h1>
        <ExampleClientComponent />
        <LanguageChanger />
      </main>
    </ServerIntlProvider>
  );
}

export default Home;
