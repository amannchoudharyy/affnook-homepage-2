import { buildAudienceMetadata } from '@/lib/seo';
import { getSiteEnv, getSiteUrl, isIndexable } from '@/lib/site';

describe('site environment', () => {
  it('defaults to development for missing or unknown values', () => {
    expect(getSiteEnv({})).toBe('development');
    expect(getSiteEnv({ SITE_ENV: 'preview' })).toBe('development');
    expect(getSiteEnv({ SITE_ENV: ' Staging ' })).toBe('staging');
  });

  it('is indexable only for production with an https SITE_URL', () => {
    expect(isIndexable({})).toBe(false);
    expect(isIndexable({ SITE_ENV: 'staging', SITE_URL: 'https://example.com' })).toBe(false);
    expect(isIndexable({ SITE_ENV: 'production' })).toBe(false);
    expect(isIndexable({ SITE_ENV: 'production', SITE_URL: 'http://example.com' })).toBe(false);
    expect(isIndexable({ SITE_ENV: 'production', SITE_URL: 'not a url' })).toBe(false);
    expect(isIndexable({ SITE_ENV: 'production', SITE_URL: 'https://example.com' })).toBe(true);
  });

  it('falls back to localhost for a missing or invalid SITE_URL and strips trailing slashes', () => {
    expect(getSiteUrl({}).origin).toBe('http://localhost:3000');
    expect(getSiteUrl({ SITE_URL: '::bad::' }).origin).toBe('http://localhost:3000');
    expect(getSiteUrl({ SITE_URL: 'https://example.com/' }).href).toBe('https://example.com/');
  });
});

describe('audience metadata', () => {
  it('canonicalises each audience to its own route', () => {
    expect(buildAudienceMetadata('operators', {}).alternates?.canonical).toBe('/');
    expect(buildAudienceMetadata('brands', {}).alternates?.canonical).toBe('/brands');
    expect(buildAudienceMetadata('networks', {}).alternates?.canonical).toBe('/affiliate-networks');
  });

  it('marks non-production deployments noindex', () => {
    const staging = buildAudienceMetadata('brands', {
      SITE_ENV: 'staging',
      SITE_URL: 'https://staging.example.com',
    });
    expect(staging.robots).toMatchObject({ index: false, follow: false });
  });

  it('allows indexing in production', () => {
    const prod = buildAudienceMetadata('brands', {
      SITE_ENV: 'production',
      SITE_URL: 'https://example.com',
    });
    expect(prod.robots).toMatchObject({ index: true, follow: true });
  });
});
