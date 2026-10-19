import type { AudienceId } from './audiences';
import type { Tone } from './dashboards';

/**
 * How it works + capability tabs (Figma Operators 9765:8163, Brands 9606:113882, Networks
 * 9606:115213). Figma draws step 03 and the first capability tab of each audience; the
 * other step windows and tab panels use the approved motion prototype's content in the
 * same visual language. All figures are sample data and labelled as such.
 */

export const HOW_EYEBROW = 'How it works';

export const STEP_TITLES = [
  'Book a free demo',
  'Sign up & onboard',
  'Migrate, integrate, launch',
  'Set up, optimise & scale',
] as const;

export type HowLayout = 'pinned' | 'timeline' | 'flow';

export interface HowContent {
  layout: HowLayout;
  headline: string;
  /** Networks: subheading above the timeline (the flow diagram comes first). */
  stepsHeading?: string;
  steps: readonly [string, string, string, string];
  /** Onboarding checklist labels (step 02 window). */
  checklist: readonly [string, string, string, string];
  tabsHeading: string;
  tabs: readonly CapabilityId[];
}

export const HOW: Record<AudienceId, HowContent> = {
  operators: {
    layout: 'pinned',
    headline: 'From demo to live in four steps.',
    steps: [
      'Walk through your brands and workflows with an Affnook expert.',
      'Your CSM sets up brands, tracking domains and partner groups with you.',
      'Move data by API, OAuth, CSV or FTP, connect your platform provider, and go live.',
      'Tune commissions, dashboards and fraud rules as your portfolio grows.',
    ],
    checklist: ['Brands added', 'Tracking domains', 'Partner groups', 'Commission plans'],
    tabsHeading: 'Everything an operator needs, in one platform',
    tabs: ['reporting', 'attribution', 'fraud', 'invoicing', 'tiered', 'api'],
  },
  brands: {
    layout: 'timeline',
    headline: 'From demo to live in four steps.',
    steps: [
      'Walk through your partners, promo codes and payouts with an Affnook expert.',
      'Your CSM sets up tracking links, promo codes and partner groups with you.',
      'Move data by API, OAuth, CSV or FTP, connect your platform provider, and go live.',
      'Tune commissions, payout schedules and fraud rules as your program grows.',
    ],
    checklist: ['Tracking links', 'Promo codes', 'Partner groups', 'Payout schedules'],
    tabsHeading: 'Everything a brand needs, in one platform',
    tabs: ['attribution', 'ltv', 'fraud', 'invoicing', 'tiered', 'api'],
  },
  networks: {
    layout: 'flow',
    headline: 'How it all comes together.',
    stepsHeading: 'From demo to live in four steps',
    steps: [
      'Walk through your brands, publisher tiers and payout rules with an Affnook expert.',
      'Your CSM sets up brands, publisher groups and tracking domains with you.',
      'Move data by API, OAuth, CSV or FTP, connect your platform provider, and go live.',
      'Tune commission rules, payout schedules and fraud checks as the network grows.',
    ],
    checklist: ['Brand partners', 'Publisher groups', 'Tracking domains', 'Commission rules'],
    tabsHeading: 'Everything a network needs, in one platform',
    tabs: ['tiered', 'bundling', 'fraud', 'invoicing', 'attribution', 'api'],
  },
};

/* ----------------------------------------------------------- step windows */

export const STEP_WINDOWS = {
  urls: [
    'app.affnook.com/demo',
    'app.affnook.com/onboarding',
    'app.affnook.com/migration',
    'app.affnook.com/optimise',
  ],
  demo: {
    title: 'Book a free demo',
    subtitle: 'Pick a time that suits you · 30 minutes',
    weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    /** 21 days starting on the 6th; index 10 is picked, these are available. */
    firstDay: 6,
    picked: 10,
    available: [3, 4, 8, 9, 11, 15, 16, 17],
    slot: 'Thu, Oct 16 · 10:30',
    slotText: 'Free guided demo with an Affnook expert',
    slotStatus: 'Confirmed',
  },
  onboarding: { title: 'Onboarding', subtitle: 'Your CSM sets this up with you' },
  migration: {
    title: 'Migration',
    subtitle: 'From your previous platform to Affnook',
    methods: ['API', 'OAuth', 'CSV', 'FTP'],
    rows: [
      { name: 'Affiliates', records: '4,812 records', progress: 100, status: 'Done' },
      { name: 'Players', records: '1.9M records', progress: 100, status: 'Done' },
      { name: 'Transactions', records: '38.2M records', progress: 86, status: '86%' },
      { name: 'Commission plans', records: 'queued', progress: 0, status: 'Queued' },
    ],
    badge: '0 rows lost · 500TB migrated to Affnook so far',
  },
  optimise: {
    title: 'Optimise & scale',
    subtitle: 'Tune it as you grow',
    chartTitle: 'NGR · last 10 weeks',
    chartBadge: '+220%',
    chart: [20, 24, 22, 30, 34, 33, 42, 48, 55, 64],
    toggles: ['Fraud rules', 'Weekly payouts', 'Custom dashboard'],
  },
} as const;

/* -------------------------------------------------------------- flow (nets) */

export const FLOW = {
  brandsLabel: 'Brand partners',
  publishersLabel: 'Publishers',
  brands: [
    { label: 'Brand A · Casino', tone: 'indigo' },
    { label: 'Brand B · Sportsbook', tone: 'mint' },
    { label: 'Brand C · Poker', tone: 'orchid' },
    { label: 'Brand D · Bingo', tone: 'gold' },
    { label: '+ 32 more brands', tone: 'muted' },
  ] satisfies { label: string; tone: Tone }[],
  hub: {
    title: 'Your network on Affnook',
    badge: 'One login',
    capabilities: [
      { title: 'Tracking links & postbacks', text: 'Brand- and network-level', tone: 'indigo' },
      { title: 'Commission rules & tiers', text: 'CPA, rev share, hybrid', tone: 'gold' },
      { title: 'Fraud checks', text: 'Bots, proxy IPs, device fraud', tone: 'error' },
      { title: 'Invoices & payouts', text: 'Auto-scheduled, 50+ currencies', tone: 'mint' },
    ] satisfies { title: string; text: string; tone: Tone }[],
  },
  tiers: [
    { label: 'Tier 1 · 42 publishers', tone: 'gold', dots: 3 },
    { label: 'Tier 2 · 318 publishers', tone: 'orchid', dots: 8 },
    { label: 'Tier 3 · 888 publishers', tone: 'indigo', dots: 14 },
  ] satisfies { label: string; tone: Tone; dots: number }[],
  inLabel: 'Conversions in',
  outLabel: 'Links & payouts out',
} as const;

/* ------------------------------------------------------- capability tabs */

export type CapabilityId =
  'reporting' | 'attribution' | 'fraud' | 'invoicing' | 'tiered' | 'api' | 'ltv' | 'bundling';

export type Trend = 'up' | 'flat' | 'down';

export interface TableVisual {
  kind: 'table';
  label: string;
  columns: readonly [string, string, string, string, string];
  rows: readonly { cells: readonly [string, string, string, string]; trend: Trend; tone: Tone }[];
}
export interface LogVisual {
  kind: 'log';
  label: string;
  rows: readonly { title: string; detail: string; status: string; tone: Tone }[];
}
export interface InvoiceVisual {
  kind: 'invoice';
  label: string;
}
export interface LtvVisual {
  kind: 'ltv';
  label: string;
}

export interface Capability {
  tab: string;
  title: string;
  text: string;
  ticks: readonly [string, string, string];
  visual: TableVisual | LogVisual | InvoiceVisual | LtvVisual;
}

export const CAPABILITIES: Record<CapabilityId, Capability> = {
  reporting: {
    tab: 'Multi-brand reporting',
    title: 'See every brand side by side',
    text: 'Compare NGR, GGR, FTDs and conversion across casinos, sportsbooks and poker rooms, then drill into any market or affiliate.',
    ticks: [
      'One login for every brand and region',
      'Reports by NGR, GGR, FTD and wager amount',
      'Spot top-performing brands and affiliates fast',
    ],
    visual: {
      kind: 'table',
      label: 'Brand comparison',
      columns: ['Brand', 'NGR', 'FTDs', 'Conv.', 'Trend'],
      rows: [
        { cells: ['Casino', '$572K', '1,604', '4.8%'], trend: 'up', tone: 'indigo' },
        { cells: ['Sportsbook', '$384K', '1,122', '4.1%'], trend: 'up', tone: 'mint' },
        { cells: ['Poker', '$186K', '498', '3.2%'], trend: 'flat', tone: 'orchid' },
        { cells: ['Live casino', '$98K', '258', '2.7%'], trend: 'down', tone: 'gold' },
        { cells: ['Bingo', '$41K', '112', '2.1%'], trend: 'down', tone: 'white' },
      ],
    },
  },
  attribution: {
    tab: 'Attribution tracking',
    title: 'Trace every deposit to its partner',
    text: 'Server-to-server and pixel tracking tie every sign-up, first deposit and repeat deposit to the partner, link or promo code behind it.',
    ticks: [
      'A unique tracking link or promo code per partner',
      'Reports by NGR, GGR, FTDs and deposits',
      'Data refreshed every minute',
    ],
    visual: {
      kind: 'table',
      label: 'Partner performance',
      columns: ['Partner', 'NGR', 'FTDs', 'Conv.', 'Trend'],
      rows: [
        { cells: ['Partner A · SEO', '$57.2K', '604', '4.8%'], trend: 'up', tone: 'indigo' },
        { cells: ['Partner B · Streamer', '$38.4K', '422', '4.1%'], trend: 'up', tone: 'mint' },
        { cells: ['Promo WELCOME50', '$18.6K', '198', '3.2%'], trend: 'flat', tone: 'orchid' },
        { cells: ['Partner C · Telegram', '$9.8K', '158', '2.7%'], trend: 'down', tone: 'gold' },
        { cells: ['Partner D · PPC', '$4.1K', '72', '2.1%'], trend: 'down', tone: 'white' },
      ],
    },
  },
  fraud: {
    tab: 'Fraud Shield',
    title: 'Pay for players, not bots',
    text: 'A built-in fraud shield checks every click and conversion before it reaches a payout, at no extra cost.',
    ticks: [
      'Block data-centre traffic',
      'Blacklist suspicious IPs and keep repeat offenders out',
      'Filter conversions from unknown devices',
    ],
    visual: {
      kind: 'log',
      label: 'Fraud check log',
      rows: [
        {
          title: 'Click rejected',
          detail: 'Proxy IP · 185.220.x.x',
          status: 'Blocked',
          tone: 'error',
        },
        {
          title: 'Conversion held',
          detail: 'Data-centre IP · AS14061',
          status: 'Review',
          tone: 'gold',
        },
        {
          title: 'Sign-up flagged',
          detail: 'Same device ×4 · bonus claim',
          status: 'Blocked',
          tone: 'error',
        },
        { title: 'FTD approved', detail: 'Partner #2231 · DE', status: 'Paid', tone: 'mint' },
      ],
    },
  },
  invoicing: {
    tab: 'Automated invoicing',
    title: 'Invoices that send themselves',
    text: 'Generate invoices at a set frequency and threshold, in 50+ currencies, and pay through pre-integrated gateways or your own.',
    ticks: [
      'Recurring invoices on your schedule',
      '50+ currencies supported',
      'Custom invoice settings per affiliate',
    ],
    visual: { kind: 'invoice', label: 'Scheduled invoice' },
  },
  tiered: {
    tab: 'Tiered payouts',
    title: 'Commission rules that apply themselves',
    text: 'Set CPA, rev share or hybrid plans per publisher group and brand. Affnook applies them to every conversion and schedules the payouts.',
    ticks: [
      'Tiered publisher groups with their own payout plans',
      'Negative carryover on or off, per partner',
      'Auto payouts on your schedule, in 50+ currencies',
    ],
    visual: {
      kind: 'table',
      label: 'Publisher groups',
      columns: ['Group', 'Payout', 'Publishers', 'Model', 'Trend'],
      rows: [
        { cells: ['Tier 1 · Brand A', '$60 CPA', '42', 'CPA'], trend: 'up', tone: 'indigo' },
        { cells: ['Tier 2 · Brand B', '$40 + 25%', '318', 'Hybrid'], trend: 'up', tone: 'mint' },
        {
          cells: ['Tier 3 · all brands', '30% NGR', '888', 'Rev share'],
          trend: 'flat',
          tone: 'orchid',
        },
        { cells: ['Streamers · Brand C', '$45 CPA', '56', 'CPA'], trend: 'down', tone: 'gold' },
        {
          cells: ['Sub-affiliates', '5% of tier', '212', 'Referral'],
          trend: 'down',
          tone: 'white',
        },
      ],
    },
  },
  api: {
    tab: 'Two-way API',
    title: 'Push and pull data in real time',
    text: 'Connect your platform provider and the rest of your stack with two-way APIs, so every player action flows into your reports within minutes.',
    ticks: [
      'Platform provider integrations',
      '100+ two-way integrations',
      'Admin and affiliate API docs',
    ],
    visual: {
      kind: 'log',
      label: 'API activity',
      rows: [
        { title: 'GET /reports/affiliates', detail: '200 OK · 84 ms', status: 'OK', tone: 'mint' },
        { title: 'POST /postback/ftd', detail: '200 OK · 112 ms', status: 'OK', tone: 'mint' },
        { title: 'GET /players/ltv', detail: '200 OK · 96 ms', status: 'OK', tone: 'mint' },
        { title: 'POST /invoices/run', detail: '202 Accepted', status: 'Queued', tone: 'indigo' },
      ],
    },
  },
  ltv: {
    tab: 'Player LTV',
    title: 'See what each partner’s players are worth',
    text: 'Lifetime value by partner, cohort and campaign, so you pay more for partners whose players stay and deposit again.',
    ticks: [
      'LTV by sign-up week and partner',
      'Repeat deposits tracked to the source',
      'Spot partners who send one-time players',
    ],
    visual: { kind: 'ltv', label: 'Player LTV by partner over 90 days' },
  },
  bundling: {
    tab: 'Commission bundling',
    title: 'One payout for many deals',
    text: 'Bundle commissions across brands and affiliate groups, so a partner gets one invoice and one payout for every deal they run.',
    ticks: [
      'Group affiliates across brands',
      'One invoice per partner per cycle',
      'Rules applied per group automatically',
    ],
    visual: {
      kind: 'table',
      label: 'Commission bundles',
      columns: ['Bundle', 'Brands', 'Partners', 'Cycle', 'Trend'],
      rows: [
        { cells: ['Streamers · all brands', '4', '56', 'Weekly'], trend: 'up', tone: 'gold' },
        { cells: ['SEO partners', '3', '212', 'Monthly'], trend: 'up', tone: 'indigo' },
        { cells: ['Tier 1 · Casino + Poker', '2', '42', 'Bi-weekly'], trend: 'flat', tone: 'mint' },
        { cells: ['Telegram groups', '5', '138', 'Monthly'], trend: 'up', tone: 'orchid' },
      ],
    },
  },
};

export const INVOICE = {
  number: 'Invoice INV-1042',
  status: 'Scheduled · Oct 1',
  lines: [
    ['Partner', 'Partner #2231'],
    ['Period', 'Sep 1 – Sep 30, 2026'],
    ['CPA · 142 FTDs × $40', '$5,680.00'],
    ['Rev share · 25% of NGR', '$3,120.00'],
    ['Currency', 'USD · 1 of 50+'],
  ],
  totalLabel: 'Total due',
  total: '$8,800.00',
} as const;

export const LTV = {
  series: [
    { label: 'Partner A · $118', tone: 'mint', points: [20, 38, 52, 70, 92, 118] },
    { label: 'Partner B · $60', tone: 'indigo', points: [18, 30, 38, 46, 54, 60] },
    { label: 'Partner C · $33', tone: 'orchid', points: [16, 22, 26, 29, 31, 33] },
  ] satisfies { label: string; tone: Tone; points: number[] }[],
  xLabels: ['D0', 'D7', 'D14', 'D30', 'D60', 'D90'],
} as const;
