import type { AudienceId } from './audiences';
import type { CountValue } from './dashboards';
import { CTA_LINKS, affnookUrl } from './links';

/**
 * Proof — case-study carousel (Figma Operators 9765:8043, Brands 9606:113762, Networks
 * 9606:115093). Figma draws the first slide of each audience and the peeking second one;
 * its other carousel states are placeholder copies, so slide order and the remaining case
 * copy follow the approved motion prototype. All figures are the published case-study
 * results on affnook.com and still need marketing sign-off (see docs/decisions.md).
 */

export type CaseId = 'unicon365' | 'gamegram' | 'slotBunny' | 'platform';

export interface CaseMetric {
  count: CountValue;
  label: string;
}

export interface CaseStudy {
  tag: string;
  name: string;
  story: string;
  metrics: readonly CaseMetric[];
  link: { label: string; href: string };
  /** "After" side of the before/after slider: one live view replacing the spreadsheets. */
  after: { title: string; subtitle: string; value: string };
}

export const CASES: Record<CaseId, CaseStudy> = {
  unicon365: {
    tag: 'Online casino operator · 9+ brands',
    name: 'Unicon365',
    story:
      'Unicon365 moved affiliate management for 9+ casino brands onto one Affnook dashboard in April 2024, with tracking, fraud checks and payouts in one place.',
    metrics: [
      { count: { value: 200, suffix: '%' }, label: 'NGR growth' },
      { count: { value: 30000, suffix: '+' }, label: 'new players, Apr–Jul 2024' },
      { count: { value: 13, suffix: 'M+' }, label: 'player activities tracked' },
    ],
    link: {
      label: 'Read the full story',
      href: affnookUrl('/customer-success-story-online-casino-brand/'),
    },
    after: { title: 'All 9 brands', subtitle: 'NGR', value: '+200%' },
  },
  gamegram: {
    tag: 'Virtual casino · global',
    name: 'Gamegram',
    story:
      'Gamegram moved its whole affiliate program to Affnook to get fraud traffic under control while it scaled. After four months:',
    metrics: [
      { count: { prefix: '20–', value: 25, suffix: '%' }, label: 'monthly NGR/GGR growth' },
      { count: { prefix: '20–', value: 30, suffix: '%' }, label: 'more active players' },
      { count: { prefix: '12–', value: 15, suffix: '%' }, label: 'higher player LTV' },
    ],
    link: { label: 'Read the full story', href: affnookUrl('/customer-success-story-gamegram/') },
    after: { title: 'Monthly NGR/GGR', subtitle: 'Growth after 4 months', value: '+20–25%' },
  },
  slotBunny: {
    tag: 'Crypto-first casino · new launch',
    name: 'Slot Bunny',
    story:
      'Slot Bunny launched its affiliate program on Affnook from day one, with tracking, reporting and fraud monitoring built in, and grew without adding to the team.',
    metrics: [{ count: { value: 3, suffix: 'X' }, label: 'scale without adding operational cost' }],
    link: {
      label: 'Read the full story',
      href: affnookUrl('/customer-success-story-slot-bunny/'),
    },
    after: { title: 'Affiliate program', subtitle: 'From day one', value: '3X' },
  },
  platform: {
    tag: 'Platform · all clients',
    name: 'What Affnook runs today',
    story:
      'Networks need infrastructure that doesn’t blink. Here’s what Affnook already handles for iGaming clients in 20+ countries.',
    metrics: [
      { count: { value: 500, suffix: 'TB' }, label: 'data migrated with zero loss' },
      { count: { value: 99.9, decimals: 1, suffix: '%' }, label: 'platform uptime' },
      { count: { value: 100, suffix: '+' }, label: 'two-way integrations' },
    ],
    link: { label: 'See why networks choose Affnook', href: CTA_LINKS.whyAffnook },
    after: { title: 'All brand partners', subtitle: 'Commissions due · Oct 1', value: '$412K' },
  },
};

export const PROOF_EYEBROW = 'Proof';

export const PROOF: Record<AudienceId, { headline: string; cases: readonly CaseId[] }> = {
  operators: {
    headline: 'Operators who made the switch.',
    cases: ['unicon365', 'gamegram', 'slotBunny'],
  },
  brands: {
    headline: 'Brands that grew with Affnook.',
    cases: ['gamegram', 'slotBunny', 'unicon365'],
  },
  networks: {
    headline: 'Built for networks at scale.',
    cases: ['platform', 'unicon365', 'gamegram'],
  },
};

/** Before side: four scattered spreadsheet exports (Figma rotations, in degrees). */
export const BEFORE_SHEETS = [4, -3, 2, -5] as const;
/** After side: mini bar chart heights (Figma, px of a 140px column). */
export const AFTER_BARS = [40, 52, 48, 66, 74, 90, 104, 122, 140] as const;
