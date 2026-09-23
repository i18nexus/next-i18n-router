'use client';

import { usePathname } from 'next/navigation';
import type { ChangeEvent } from 'react';
import { useIntl } from 'react-intl';
import i18nConfig from '@/i18nConfig';

export default function LanguageChanger() {
  const { locale: currentLocale } = useIntl();
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=2592000;SameSite=Lax`;

    if (i18nConfig.noPrefix) {
      window.location.reload();
      return;
    }

    const hasPrefix =
      currentLocale !== i18nConfig.defaultLocale || i18nConfig.prefixDefault;
    const unprefixedPath = hasPrefix
      ? pathname.slice(`/${currentLocale}`.length) || '/'
      : pathname;
    // Include the new locale so the proxy also updates its preference cookie.
    // It redirects the default locale to its canonical unprefixed URL.
    const href =
      `/${newLocale}${unprefixedPath === '/' ? '' : unprefixedPath}` +
      window.location.search +
      window.location.hash;

    // A full navigation runs the proxy even if the destination was prefetched.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign(href);
  };

  return (
    <select aria-label="Language" onChange={handleChange} value={currentLocale}>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
      <option value="ja">日本語</option>
    </select>
  );
}
