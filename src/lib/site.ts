/**
 * Deployment environment helpers.
 *
 * Indexing is opt-in: a deployment is only indexable when SITE_ENV is explicitly
 * "production" AND an absolute SITE_URL is configured. Every other combination
 * (local dev, Vercel previews, staging) is treated as non-indexable.
 */

export type SiteEnv = 'development' | 'staging' | 'production';

type Env = Record<string, string | undefined>;

const DEFAULT_SITE_URL = 'http://localhost:3000';

export function getSiteEnv(env: Env = process.env): SiteEnv {
  const value = env.SITE_ENV?.trim().toLowerCase();
  if (value === 'production' || value === 'staging') return value;
  return 'development';
}

export function getSiteUrl(env: Env = process.env): URL {
  const raw = env.SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw.replace(/\/+$/, ''));
    } catch {
      // Fall through to the default: an invalid URL must never break the build.
    }
  }
  return new URL(DEFAULT_SITE_URL);
}

export function isIndexable(env: Env = process.env): boolean {
  if (getSiteEnv(env) !== 'production') return false;
  const raw = env.SITE_URL?.trim();
  if (!raw) return false;
  try {
    return new URL(raw).protocol === 'https:';
  } catch {
    return false;
  }
}
