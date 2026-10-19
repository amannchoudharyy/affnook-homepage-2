import type { AudienceId } from './audiences';
import type { Tone } from './dashboards';

/**
 * Copy for the Logos, Problem and Stakes sections, from the Figma frames
 * (Operators 9765:7666/7724/7860, Brands 9606:113401/113459/113579,
 * Networks 9606:114665/114723/114910).
 */

/* ----------------------------------------------------------------- logos */

export const LOGOS = {
  heading: 'Trusted by iGaming operators, brands and networks in 20+ countries',
  /** Figma placeholder wordmarks ("replace with real logos"); see docs/decisions.md. */
  wordmarks: [
    'Unicon365',
    'Funexch',
    'Sixty',
    'Koretbet',
    'MaxDuel',
    'Lucky.co',
    'SpinsAmerica',
    'Bwinners',
    'Hyperedge',
    'Epicsweep',
  ],
  awards: [
    {
      title: 'Rising Star 2024',
      issuer: 'FinancesOnline',
      image: '/images/awards/rising-star-2024-financesonline.png',
      alt: 'FinancesOnline Rising Star 2024 award badge',
    },
    {
      title: 'Winner 2024',
      issuer: 'AffPapa iGaming Awards',
      image: '/images/awards/affpapa-winner-2024.png',
      alt: 'AffPapa iGaming Awards 2024 winner badge',
    },
  ],
} as const;

/* --------------------------------------------------------------- problem */

export interface ProblemCard {
  title: string;
  text: string;
}

export interface ProblemContent {
  headline: readonly [string, string];
  intro: string;
  cards: readonly [ProblemCard, ProblemCard, ProblemCard, ProblemCard];
  closing: readonly [string, string];
}

/** Figma uses the same closing line on all three variants (flagged for review). */
const CLOSING = [
  'Got increasingly more brands to manage?',
  'Keep track of every single affiliate’s performance without breaking a sweat.',
] as const;

export const PROBLEM: Record<AudienceId, ProblemContent> = {
  operators: {
    headline: ['Your brands keep growing.', 'Your view of them doesn’t.'],
    intro:
      'Running several casinos, sportsbooks and poker rooms usually breaks down in the same four places.',
    cards: [
      {
        title: 'Too many panels',
        text: 'Casino, sportsbook and poker each report in their own tool, so no one sees the whole portfolio.',
      },
      {
        title: 'No clear winner',
        text: 'It’s hard to tell which brand, market or affiliate is really driving NGR.',
      },
      {
        title: 'Every launch starts from zero',
        text: 'A new brand means a new setup, new partner onboarding and new reports.',
      },
      {
        title: 'Fraud slips between tools',
        text: 'Bots, proxy IPs and fake sign-ups hide where your data doesn’t connect.',
      },
    ],
    closing: CLOSING,
  },
  brands: {
    headline: ['Your partners drive growth.', 'You can’t see which ones.'],
    intro: 'Most iGaming brands lose sight of their partners in the same four places.',
    cards: [
      {
        title: 'Dashboard hopping',
        text: 'Tracking, partner chats, payouts and reports sit in different tools. Every answer needs four logins.',
      },
      {
        title: 'Deposits without a source',
        text: 'Clicks and sign-ups are easy to count. Tracing a deposit back to its partner isn’t.',
      },
      {
        title: 'Payouts by spreadsheet',
        text: 'Commission maths by hand means late or wrong payouts, and wrong payouts sour your best partners.',
      },
      {
        title: 'Paying for bots',
        text: 'Fake sign-ups, data-centre traffic and bonus abuse look like growth until the invoice arrives.',
      },
    ],
    closing: CLOSING,
  },
  networks: {
    headline: ['Your network keeps growing.', 'Your ops team can’t.'],
    intro:
      'More brands and more publishers should mean more revenue. Without the right platform, it mostly means more manual work in four places.',
    cards: [
      {
        title: 'Commission rules by hand',
        text: 'Tiered, hybrid and brand-specific deals need manual maths every payout cycle.',
      },
      {
        title: 'Brands × tiers × publishers',
        text: 'Every new brand multiplies the deals, links and reports your team has to track.',
      },
      {
        title: 'Reconciliation that never ends',
        text: 'Matching your conversions to every operator’s report, by hand, every month.',
      },
      {
        title: 'Fraud across every campaign',
        text: 'Bots, IP intrusions and device fraud spread across brands before anyone spots them.',
      },
    ],
    closing: CLOSING,
  },
};

/** Brands "player journey" funnel (sample data, labelled in the UI). */
export const BRANDS_FUNNEL = {
  title: 'Player journey · last 30 days',
  steps: [
    {
      label: 'Clicks',
      value: '1.28M',
      width: 100,
      color: 'rgba(79, 70, 219, 0.85)',
      leak: 'Leak: Bot clicks',
    },
    {
      label: 'Sign-ups',
      value: '42,610',
      width: 76.5,
      color: 'rgba(140, 134, 255, 0.85)',
      leak: 'Leak: Fake sign-ups & bonus abuse',
    },
    {
      label: 'First deposits',
      value: '6,904',
      width: 52.9,
      color: 'rgba(237, 116, 188, 0.85)',
      leak: 'Leak: Untracked promo codes',
    },
    { label: 'Repeat deposits', value: '2,310', width: 32.4, color: 'rgba(0, 209, 127, 0.85)' },
  ],
  callout: {
    title: 'Which partners brought these players?',
    text: 'Without partner-level tracking, the funnel leaks where you can’t see it.',
  },
} as const;

/* ---------------------------------------------------------------- stakes */

export interface Stat {
  value: number;
  suffix: string;
  text: string;
  source: string;
  tone: Tone;
}

export interface StakesContent {
  headline: readonly [string, string];
  /** In visual (left → right) order. */
  stats: readonly [Stat, Stat, Stat];
}

const FRAUD_HIT: Stat = {
  value: 83,
  suffix: '%',
  text: 'of iGaming operators were hit by fraud in the past year',
  source: 'Source: Sumsub',
  tone: 'error',
};
const FRAUD_RISE: Stat = {
  value: 64,
  suffix: '%',
  text: 'year-on-year rise in iGaming fraud',
  source: 'Source: Sumsub, 2024',
  tone: 'orchid',
};
const AD_FRAUD = (tone: Tone): Stat => ({
  value: 50,
  suffix: '%',
  text: 'of online gambling ad traffic can be fraudulent',
  source: 'Source: RockApp',
  tone,
});

export const STAKES_EYEBROW = 'What it costs';
export const STAKES_FOOTNOTE =
  'Third-party figures, as cited in Affnook’s 2026 Tech Playbook for iGaming affiliate networks.';

export const STAKES: Record<AudienceId, StakesContent> = {
  operators: {
    headline: ['Fraud isn’t a rounding error.', 'It’s a line item.'],
    stats: [FRAUD_HIT, FRAUD_RISE, AD_FRAUD('gold')],
  },
  brands: {
    headline: ['Fake traffic isn’t a rounding error.', 'It’s budget you don’t get back.'],
    stats: [AD_FRAUD('gold'), FRAUD_RISE, FRAUD_HIT],
  },
  networks: {
    headline: ['Custom deals win partners.', 'Manual maths can’t keep up.'],
    stats: [
      {
        value: 62,
        suffix: '%',
        text: 'of high-performing iGaming affiliate networks offer customised commission models',
        source: 'Source: Captiv8, 2025',
        tone: 'gold',
      },
      {
        value: 19,
        suffix: '%',
        text: 'rise in affiliate onboarding and retention with multi-tier programs',
        source: 'Source: Business of Apps, 2024',
        tone: 'orchid',
      },
      AD_FRAUD('error'),
    ],
  },
};
