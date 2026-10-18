import type { MetadataRoute } from 'next';

import { listAudiences } from '@/content/audiences';
import { getSiteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  return listAudiences().map((audience) => ({
    url: new URL(audience.path, base).toString(),
    changeFrequency: 'monthly',
    priority: audience.path === '/' ? 1 : 0.8,
  }));
}
