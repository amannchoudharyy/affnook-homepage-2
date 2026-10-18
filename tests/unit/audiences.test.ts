import { AUDIENCE_IDS, AUDIENCES, DEFAULT_AUDIENCE, listAudiences } from '@/content/audiences';

describe('audience registry', () => {
  it('defines exactly the three approved audiences in switcher order', () => {
    expect(listAudiences().map((a) => a.id)).toEqual(['operators', 'brands', 'networks']);
  });

  it('maps each audience to its approved route', () => {
    expect(AUDIENCES.operators.path).toBe('/');
    expect(AUDIENCES.brands.path).toBe('/brands');
    expect(AUDIENCES.networks.path).toBe('/affiliate-networks');
  });

  it('uses Operators as the default audience on "/"', () => {
    expect(DEFAULT_AUDIENCE).toBe('operators');
    expect(AUDIENCES[DEFAULT_AUDIENCE].path).toBe('/');
  });

  it('has unique paths and complete hero/SEO copy for every audience', () => {
    const paths = AUDIENCE_IDS.map((id) => AUDIENCES[id].path);
    expect(new Set(paths).size).toBe(paths.length);
    for (const a of listAudiences()) {
      expect(a.hero.headline.every((line) => line.trim().length > 0)).toBe(true);
      expect(a.hero.subhead.trim()).not.toBe('');
      expect(a.seo.title.trim()).not.toBe('');
      expect(a.seo.description.length).toBeLessThanOrEqual(170);
    }
  });
});
