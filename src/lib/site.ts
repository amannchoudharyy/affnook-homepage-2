/**
 * Deployment environment helpers.
 *
 * Indexing is opt-in: a deployment is only indexable when SITE_ENV is explicitly
 * "production" AND SITE_URL is an https:// origin that is not a *.vercel.app host. Every
 * other combination (local dev, Vercel previews, staging) is treated as non-indexable.
 */

export type SiteEnv = 'development' | 'staging' | 'production';

type Env = Record<string, string | undefined>;

const DEFAULT_SITE_URL = 'http://localhost:3000';

export function getSiteEnv(env: Env = process.env): SiteEnv {
  const value = env.SITE_ENV?.trim().toLowerCase();
  if (value === 'production' || value === 'staging') return value;
  return 'development';
}

/**
 * Absolute origin for canonicals, sitemap and Open Graph: SITE_URL, else (on Vercel) the
 * project's production domain or this deployment's own URL, else localhost for local work.
 */
export function getSiteUrl(env: Env = process.env): URL {
  const candidates = [
    env.SITE_URL?.trim(),
    env.VERCEL_ENV === 'production' && env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    env.VERCEL_URL ? `https://${env.VERCEL_URL}` : undefined,
  ];
  for (const raw of candidates) {
    if (!raw) continue;
    try {
      return new URL(raw.replace(/\/+$/, ''));
    } catch {
      // Try the next candidate: an invalid URL must never break the build.
    }
  }
  return new URL(DEFAULT_SITE_URL);
}

/** Hosts that are never indexable, even with SITE_ENV=production (Vercel staging/preview). */
const NON_INDEXABLE_HOST = /(^|\.)vercel\.app$/i;

export function isIndexable(env: Env = process.env): boolean {
  if (getSiteEnv(env) !== 'production') return false;
  const raw = env.SITE_URL?.trim();
  if (!raw) return false;
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' && !NON_INDEXABLE_HOST.test(url.hostname);
  } catch {
    return false;
  }
}

/**
 * Build-time guard (called from next.config.ts): a build that is meant to be production but
 * would ship noindex pages or wrong canonicals fails loudly instead of deploying silently.
 * Returns an error message, or null when the configuration is consistent.
 */
export function deployConfigError(env: Env = process.env): string | null {
  if (getSiteEnv(env) !== 'production' || isIndexable(env)) return null;
  return (
    'SITE_ENV=production requires SITE_URL to be the https:// production origin ' +
    '(not localhost or *.vercel.app). Use SITE_ENV=staging for staging and preview builds.'
  );
}
