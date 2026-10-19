import type { AudienceId } from './audiences';
import type { Tone } from './dashboards';
import { CTA_LINKS, affnookUrl } from './links';

/**
 * Copy for the last five homepage sections (Figma, all audiences):
 * Customization 9765:8317 / 9606:114038 / 9606:115411 · Testimonials 9765:8400 /
 * 9606:114121 / 9606:115494 · Objections + FAQ 9765:8432 / 9606:114153 / 9606:115526 ·
 * Resources 9765:8555 / 9606:114276 / 9606:115649 · Final CTA 9765:8611 / 9606:114332 /
 * 9606:115705. Customization, Testimonials and Objections + FAQ are identical across
 * audiences; Resources and the Final CTA differ.
 */

/* --------------------------------------------------------- customization */

export const CUSTOMIZATION = {
  eyebrow: 'Make it yours',
  headline: ['Customize everything,', 'not just the colours.'],
  formula: {
    title: 'Your NGR formula',
    text: 'Define what NGR and GGR mean for your business, per brand.',
    terms: [
      { label: 'GGR', tone: 'indigo' },
      { label: 'Bonuses', tone: 'orchid' },
      { label: 'Chargebacks', tone: 'gold' },
      { label: 'Platform fees', tone: 'white' },
    ] satisfies { label: string; tone: Tone }[],
    result: 'NGR',
    note: 'Example formula · set per brand',
  },
  domain: {
    title: 'Your tracking domain',
    text: 'White-label tracking links on your own domain.',
    url: 'track.yourcasino.com/click?aff=2231',
    tags: [
      { label: 'SSL verified', tone: 'mint' },
      { label: 'White-label', tone: 'indigo' },
    ] satisfies { label: string; tone: Tone }[],
  },
  fx: {
    title: 'Your FX rates',
    text: 'Set your own exchange rates for reporting and payouts.',
    rates: [
      { pair: 'EUR → USD', rate: '1.0850' },
      { pair: 'GBP → USD', rate: '1.2710' },
      { pair: 'BRL → USD', rate: '0.1790' },
    ],
    badge: 'Set by you',
  },
  dashboard: {
    title: 'Your dashboard, your KPIs',
    text: 'Put the numbers that define success for your business front and centre.',
    widgets: [
      { label: 'NGR', tone: 'indigo' },
      { label: 'FTDs', tone: 'mint' },
      { label: 'Top affiliates', tone: 'orchid' },
    ] satisfies { label: string; tone: Tone }[],
    /** Figma bar heights (px of a 76px column). */
    bars: [20, 34, 48, 62, 76],
    dragged: { label: 'GGR by market', value: '$2.1M' },
  },
} as const;

/* ---------------------------------------------------------- testimonials */

/** Verbatim from affnook.com/book-free-demo/ ("Yeva Avagyan, Head of Commercial, Affpapa"). */
export const TESTIMONIAL = {
  eyebrow: 'Testimonials',
  headline: ['Don’t take our word for it.', 'Take theirs.'],
  award: {
    title: 'Client Satisfaction of the Year',
    text: 'Winner · AffPapa iGaming Awards 2024',
    href: CTA_LINKS.award,
  },
  tag: 'Industry partner · AffPapa',
  quote:
    'We’ve been working closely with Affnook for over a year now and it’s been nothing but a smooth sailing. Great communication, clear vision and dedication is something that definitely sets Affnook apart. Excited to see what future collaborative efforts we have in store for us!',
  author: 'Yeva Avagyan',
  role: 'Head of Commercial · AffPapa',
  /** Headshot not supplied yet (Figma: "replace with headshot"). */
  initials: 'YA',
  result: { value: '1+ year', label: 'working together' },
} as const;

/* ------------------------------------------------------ objections + FAQ */

export interface Objection {
  tag: string;
  tone: Tone;
  question: string;
  points: readonly [string, string, string];
  link: { label: string; href: string };
}

/** Link destinations from the approved prototype. */
export const OBJECTIONS: readonly Objection[] = [
  {
    tag: 'Migration',
    tone: 'mint',
    question: '“Switching feels risky.”',
    points: [
      '500TB migrated to Affnook with zero data loss',
      'Move data by API, OAuth, CSV or FTP',
      'Your CSM runs the switch with you',
    ],
    link: { label: 'How migration works', href: affnookUrl('/seamless-migration/') },
  },
  {
    tag: 'Pricing',
    tone: 'gold',
    question: '“Will it cost more than we think?”',
    points: [
      'Billing starts when you go live',
      'Pay for payout-triggering events, not clicks or wagers',
      'No extra charge for data access',
    ],
    link: { label: 'See pricing', href: CTA_LINKS.pricing },
  },
  {
    tag: 'Customization',
    tone: 'indigo',
    question: '“Will it fit how we work?”',
    points: [
      'Custom NGR and GGR formulas',
      'White-label domains and custom dashboards',
      'Features built on request',
    ],
    link: { label: 'Explore customization', href: affnookUrl('/features-on-request/') },
  },
];

export const OBJECTIONS_COPY = {
  eyebrow: 'Still deciding?',
  headline: 'Fair questions. Straight answers.',
  faqTitle: 'FAQ',
} as const;

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * Figma draws the General list (first answer open). General and "Fraud & data" answers
 * come from the approved prototype; Migration and Pricing answers are condensed from the
 * FAQs already published on affnook.com (/seamless-migration/, /why-choose-affnook, home).
 * All answers need marketing sign-off.
 */
export const FAQ: readonly { category: string; items: readonly FaqItem[] }[] = [
  {
    category: 'General',
    items: [
      {
        question: 'Who is Affnook for?',
        answer:
          'iGaming operators, brands and affiliate networks that want affiliate tracking, partner management, payouts and fraud prevention in one platform.',
      },
      {
        question: 'Can Affnook work with our existing tech stack?',
        answer:
          'Yes. Affnook connects to your platform provider, payment gateways and marketing tools through 100+ two-way integrations, and the API refreshes in real time, so reports never wait on a sync.',
      },
      {
        question: 'Is there a free trial?',
        answer:
          'Start with a free, guided demo. After it, you can take a trial of the platform before you buy.',
      },
      {
        question: 'How does Affnook stop affiliate fraud?',
        answer:
          'A built-in fraud shield blocks data-centre traffic, blacklists suspicious IPs, keeps repeat offenders out and filters conversions from unknown devices, so you pay only for real players.',
      },
      {
        question: 'Can we request features that aren’t there yet?',
        answer:
          'Yes. Tell your customer success manager what you need, and our engineers build it with a fast turnaround.',
      },
    ],
  },
  {
    category: 'Migration',
    items: [
      {
        question: 'How does migration work when we switch to Affnook?',
        answer:
          'You move customer and affiliate data with zero loss and minimal downtime, by API, OAuth, CSV or FTP, with support and continuous communication from the team throughout.',
      },
      {
        question: 'Can we migrate without losing data?',
        answer:
          'Yes. Transfer methods like FTP or OAuth keep your critical data intact, and you can also self-upload data in simple formats like CSV.',
      },
      {
        question: 'Who handles the migration?',
        answer:
          'Affnook does. After your demo and plan, the team takes care of onboarding, migration and setup, and hands over a platform that is ready to use.',
      },
    ],
  },
  {
    category: 'Pricing',
    items: [
      {
        question: 'Do you charge extra for data access?',
        answer:
          'No. There are no hidden charges for data access: unlimited API pulls, unlimited player records and more.',
      },
      {
        question: 'How do we get started?',
        answer:
          'Book a free demo. An expert walks you through the platform and answers your questions, and you can take a trial before you buy. A dedicated customer success manager then sets up your campaigns, partners and tracking with you.',
      },
    ],
  },
  {
    category: 'Fraud & data',
    items: [
      {
        question: 'How does Affnook stop affiliate fraud?',
        answer:
          'A built-in fraud shield blocks data-centre traffic, blacklists suspicious IPs, keeps repeat offenders out and filters conversions from unknown devices, so you pay only for real players.',
      },
      {
        question: 'Is Affnook GDPR and CCPA compliant?',
        answer: 'Yes. Affnook follows GDPR and CCPA requirements for data privacy and security.',
      },
      {
        question: 'How fresh is the data?',
        answer:
          'Reports refresh every minute, and your first real-time reports are ready in about 10 minutes.',
      },
    ],
  },
];

/* ------------------------------------------------------------- resources */

export interface Resource {
  tag: string;
  title: string;
  href: string;
  tone: 'mint' | 'indigo' | 'orchid';
}

/** Article URLs found on affnook.com; each page title was checked (docs/qa.md). */
const R = {
  compliance: {
    title: 'iGaming Compliance Guide 2026: running a regulated business',
    href: affnookUrl('/igaming-compliance/'),
  },
  audit: {
    title: 'A step-by-step guide to auditing your affiliate program',
    href: affnookUrl('/affiliate-program-audit/'),
  },
  cookieless: {
    title: 'Cookieless tracking in iGaming: attribution after cookies',
    href: affnookUrl('/cookieless-tracking/'),
  },
  roas: {
    title: 'What is the average ROAS in iGaming affiliate marketing?',
    href: affnookUrl('/average-roas-in-igaming-affiliate-marketing/'),
  },
  sportsbook: {
    title: 'The Sportsbook Ads Playbook: make every ad channel feed your affiliate',
    href: affnookUrl('/sportsbook-ads/'),
  },
  coreChannel: {
    title: 'Affiliate marketing as a core channel for iGaming marketers',
    href: null,
  },
  playbook: {
    title: 'A 2026 tech playbook for scalable iGaming affiliate networks',
    href: affnookUrl('/igaming-affiliate-networks/'),
  },
  network: {
    title: 'Building an affiliate network in iGaming: a guide to scaling',
    href: affnookUrl('/building-an-affiliate-network/'),
  },
} as const;

export const RESOURCES_COPY = {
  eyebrow: 'Resources',
  headline: 'Read before you decide.',
  all: { label: 'All resources', href: affnookUrl('/blog') },
} as const;

type ResourceSpec = { tag: string; key: keyof typeof R };

const SETS: Record<AudienceId, readonly [ResourceSpec, ResourceSpec, ResourceSpec]> = {
  operators: [
    { tag: 'Blogs', key: 'compliance' },
    { tag: 'Guide', key: 'audit' },
    { tag: 'Industry report', key: 'cookieless' },
  ],
  brands: [
    { tag: 'Blog', key: 'roas' },
    { tag: 'Guide', key: 'sportsbook' },
    { tag: 'Industry report', key: 'coreChannel' },
  ],
  networks: [
    { tag: 'Industry report', key: 'playbook' },
    { tag: 'Guide', key: 'network' },
    { tag: 'Blog', key: 'audit' },
  ],
};

const TONES = ['mint', 'indigo', 'orchid'] as const;

const resourcesFor = (audience: AudienceId): readonly Resource[] =>
  SETS[audience].map(({ tag, key }, i) => ({
    tag,
    title: R[key].title,
    href: R[key].href ?? affnookUrl('/industry-reports/'),
    tone: TONES[i]!,
  }));

/** Card 3 of Brands has no known article URL; it falls back to the industry reports listing. */
export const RESOURCES: Record<AudienceId, readonly Resource[]> = {
  operators: resourcesFor('operators'),
  brands: resourcesFor('brands'),
  networks: resourcesFor('networks'),
};

/* ------------------------------------------------------------- final CTA */

export const FINAL_CTA: Record<AudienceId, { headline: readonly [string, string]; text: string }> =
  {
    operators: {
      headline: ['Bring every brand', 'into view.'],
      text: 'See Affnook with your own brands and data in a free, guided demo.',
    },
    brands: {
      headline: ['See which partners', 'really pay off.'],
      text: 'See Affnook with your own partners and data in a free, guided demo.',
    },
    networks: {
      headline: ['Grow partnerships,', 'not paperwork.'],
      text: 'See Affnook with your brands and publishers in a free, guided demo.',
    },
  };

export const FINAL_CTA_SHARED = {
  primary: { label: 'Book a free demo', href: CTA_LINKS.bookDemo },
  secondary: { label: 'Talk to sales', href: CTA_LINKS.contactSales },
  checks: [
    'Real-time reports in just 10 minutes',
    'Unlimited customizations',
    '24/7 customer support',
  ],
} as const;
