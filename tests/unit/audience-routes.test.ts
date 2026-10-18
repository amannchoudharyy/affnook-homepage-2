import { audienceFromPathname, isAudiencePath } from '@/content/audience-routes';

describe('audience routes', () => {
  it('maps pathnames to audiences, tolerating trailing slashes', () => {
    expect(audienceFromPathname('/')).toBe('operators');
    expect(audienceFromPathname('/brands')).toBe('brands');
    expect(audienceFromPathname('/brands/')).toBe('brands');
    expect(audienceFromPathname('/affiliate-networks')).toBe('networks');
  });

  it('falls back to the default audience for unknown paths', () => {
    expect(audienceFromPathname('/unknown')).toBe('operators');
    expect(audienceFromPathname(null)).toBe('operators');
    expect(isAudiencePath('/unknown')).toBe(false);
    expect(isAudiencePath('/brands')).toBe(true);
  });
});
