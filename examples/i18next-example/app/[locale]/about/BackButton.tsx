'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function BackButton() {
  const { t } = useTranslation();

  return <Link href="/">{t('back')}</Link>;
}
