'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import localePath from '@/localePath';

export default function BackButton() {
  const { t, i18n } = useTranslation();

  return <Link href={localePath(i18n.language)}>{t('back')}</Link>;
}
