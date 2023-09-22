'use client';

import Link from 'next/link';
import { useIntl } from 'react-intl';

export default function BackButton() {
  const { formatMessage } = useIntl();

  return <Link href="/">{formatMessage({ id: 'back' })}</Link>;
}
