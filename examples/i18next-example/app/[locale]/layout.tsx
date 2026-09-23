import i18nConfig from '@/i18nConfig';
import getLocale from '@/app/locale';
import './globals.css';
import type { ReactNode } from 'react';

export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
