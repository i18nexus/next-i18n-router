'use client';

import { IntlProvider } from 'react-intl';
import type { ComponentProps, ReactNode } from 'react';

export default function ServerIntlProvider({
  messages,
  locale,
  children
}: {
  messages: ComponentProps<typeof IntlProvider>['messages'];
  locale: string;
  children: ReactNode;
}) {
  return (
    <IntlProvider messages={messages} locale={locale} defaultLocale="en">
      {children}
    </IntlProvider>
  );
}
