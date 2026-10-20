import type { Metadata } from 'next';

import { StatusPage } from '@/components/page/StatusPage';

export const metadata: Metadata = {
  title: 'Page not found · Affnook',
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Page not found"
      text="The page you are looking for does not exist or has moved."
    />
  );
}
