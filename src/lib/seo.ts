import type { Metadata } from 'next';

import { getAudience, type AudienceId } from '@/content/audiences';

import { isIndexable } from './site';

type Env = Record<string, string | undefined>;

/**
 * Per-route metadata. Canonical URLs are relative and resolved against
 * `metadataBase` (set from SITE_URL in the root layout), so each audience route
 * is canonical to itself.
 */
export function buildAudienceMetadata(id: AudienceId, env: Env = process.env): Metadata {
  const audience = getAudience(id);
  const indexable = isIndexable(env);

  return {
    title: audience.seo.title,
    description: audience.seo.description,
    alternates: { canonical: audience.path },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: false, googleBot: { index: false, follow: false } },
    openGraph: {
      type: 'website',
      siteName: 'Affnook',
      title: audience.seo.title,
      description: audience.seo.description,
      url: audience.path,
    },
    twitter: {
      card: 'summary_large_image',
      title: audience.seo.title,
      description: audience.seo.description,
    },
  };
}
