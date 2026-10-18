/**
 * Audience registry: the single source of truth for the three homepage variants.
 *
 * Each audience is a separate, server-rendered route that shares the same section
 * components. Section-level content lives alongside each section as it is built.
 */

export const AUDIENCE_IDS = ['operators', 'brands', 'networks'] as const;

export type AudienceId = (typeof AUDIENCE_IDS)[number];

export interface Audience {
  id: AudienceId;
  /** Label used in the audience switcher. */
  label: string;
  /** Route path, always starting with "/". */
  path: '/' | `/${string}`;
  hero: {
    /** Two-line H1; the second line is rendered in the muted style. */
    headline: readonly [string, string];
    subhead: string;
  };
  seo: {
    title: string;
    description: string;
  };
}

export const DEFAULT_AUDIENCE: AudienceId = 'operators';

export const AUDIENCES: Readonly<Record<AudienceId, Audience>> = {
  operators: {
    id: 'operators',
    label: 'Operators',
    path: '/',
    hero: {
      headline: ['All your brands.', 'One control panel.'],
      subhead:
        'Run every casino, sportsbook and poker brand from one login. See which brand, market and affiliate is driving NGR, live.',
    },
    seo: {
      title: 'Affnook — iGaming affiliate platform for operators',
      description:
        'Run every casino, sportsbook and poker brand from one login. See which brand, market and affiliate is driving NGR, live.',
    },
  },
  brands: {
    id: 'brands',
    label: 'Brands',
    path: '/brands',
    hero: {
      headline: ['Know which partners', 'bring players who pay.'],
      subhead:
        'Track every affiliate, promo code and deposit in one dashboard. Pay partners on time, block fake traffic, and put budget where the real players come from.',
    },
    seo: {
      title: 'Affnook for iGaming brands — affiliate tracking and partner payouts',
      description:
        'Track every affiliate, promo code and deposit in one dashboard. Pay partners on time, block fake traffic, and put budget where the real players come from.',
    },
  },
  networks: {
    id: 'networks',
    label: 'Affiliate networks',
    path: '/affiliate-networks',
    hero: {
      headline: ['Scale the network.', 'Not the busywork.'],
      subhead:
        'Manage multi-tier publishers across every brand partner, catch fraud in real time, and let commission rules and payouts run themselves.',
    },
    seo: {
      title: 'Affnook for affiliate networks — multi-tier publisher management',
      description:
        'Manage multi-tier publishers across every brand partner, catch fraud in real time, and let commission rules and payouts run themselves.',
    },
  },
};

export function getAudience(id: AudienceId): Audience {
  return AUDIENCES[id];
}

export function listAudiences(): Audience[] {
  return AUDIENCE_IDS.map((id) => AUDIENCES[id]);
}
