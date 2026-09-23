'use client';

import Link from 'next/link';
import { useIntl } from 'react-intl';
import localePath from '@/localePath';

export default function BackButton() {
  const { formatMessage, locale } = useIntl();

  return <Link href={localePath(locale)}>{formatMessage({ id: 'back' })}</Link>;
}
