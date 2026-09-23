import getIntl from '@/app/[locale]/intl';

export default async function ExampleServerComponent() {
  const intl = await getIntl();

  return <h1>{intl.formatMessage({ id: 'header' })}</h1>;
}
