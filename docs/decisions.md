# Decisions log

Records decisions, source conflicts and accepted risks. Newest entries at the bottom of each
table.

## Sources and precedence

| Topic                      | Source of truth                                                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Layout, structure, content | Figma file `m9O0fqjhbMCf9BjfRuu1aC` — Operators `9765:7467`, Brands `9606:113199`, Affiliate Networks `9606:114462` (1512px desktop frames) |
| Motion and interaction     | Approved HTML motion prototype (not production code; kept outside the repository)                                                           |
| Mobile and tablet          | No design supplied; responsive interpretations documented below                                                                             |

## Architecture decisions

| #   | Decision                                                                            | Reason                                                                                                             |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| A1  | Three statically rendered routes: `/` (Operators), `/brands`, `/affiliate-networks` | Each variant is shareable, indexable and fully usable without JavaScript                                           |
| A2  | Audience switcher implemented as links with `aria-current`                          | Works without JavaScript; correct semantics for navigation between pages                                           |
| A3  | CSS Modules + CSS custom-property tokens; no CSS framework                          | Small output, plain CSS, tokens map 1:1 to Figma variables                                                         |
| A4  | No animation library initially                                                      | The prototype's effects are achievable with CSS + IntersectionObserver                                             |
| A5  | Indexing is opt-in (`SITE_ENV=production` + https `SITE_URL`)                       | Staging and previews can never be indexed by accident                                                              |
| A6  | TypeScript 6.0.x instead of 7.x                                                     | typescript-eslint supports TypeScript `<6.1`                                                                       |
| A7  | ESLint 9.x instead of 10.x                                                          | eslint-plugin-jsx-a11y (used by eslint-config-next) does not yet declare ESLint 10 support                         |
| A8  | SEO titles and descriptions are provisional                                         | Derived from hero copy; require marketing approval before production                                               |
| A9  | Header and footer live in the root layout; current audience is derived from the URL | They persist across audience switches (no flicker) and stay correct when rendered on the server                    |
| A10 | A tiny inline script adds `html.js` before first paint                              | Entrance animations and JS-only controls are scoped to `html.js`; without JS everything renders in its final state |
| A11 | Glow and landscape backgrounds use the Figma SVG exports as `<img>`                 | Exact Figma look; the browser rasterises the blur once, so animating them is cheap                                 |

## Figma vs. motion prototype

Where they differ, Figma governs layout/structure and the prototype governs motion.

| #   | Prototype                                                        | Figma                                                                                                                | Resolution                                                                                                                             |
| --- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | Standalone "Features" tabs section                               | Capability tabs inside "How it works"                                                                                | Follow Figma; reuse the prototype's tab crossfade                                                                                      |
| C2  | Large "big marquee" section before the final CTA                 | Not present                                                                                                          | Omit                                                                                                                                   |
| C3  | Case studies as pinned horizontal scroll on large screens        | Carousel with drag, arrows and dots                                                                                  | Carousel; no scroll pinning                                                                                                            |
| C4  | Feature tabs auto-advance                                        | "Tabs crossfade"                                                                                                     | User-driven; any auto-advance pauses on hover/focus and is disabled with reduced motion                                                |
| C5  | Custom smooth-scrolling wheel handler                            | —                                                                                                                    | Omitted: native scrolling is never intercepted                                                                                         |
| C6  | Newsletter shows a success message without submitting            | —                                                                                                                    | Omitted: no simulated submission (forms are out of scope for this milestone)                                                           |
| C7  | Before/after slider is pointer-only                              | —                                                                                                                    | Rebuilt as a keyboard-operable slider with ARIA values                                                                                 |
| C8  | Content injected by JavaScript                                   | —                                                                                                                    | Server-rendered markup                                                                                                                 |
| C9  | Hero H1 animates per character (22ms stagger)                    | Layer note: words rise, 40ms stagger                                                                                 | Prototype motion kept (motion follows the prototype)                                                                                   |
| C10 | Landscape lines drawn on a per-frame `<canvas>` loop             | Static SVG ridges, "drift 20s loop"                                                                                  | Figma SVG with a CSS 20s drift; no JavaScript animation loop                                                                           |
| C11 | Nav hide/show and progress bar run in a perpetual rAF loop       | —                                                                                                                    | Passive, rAF-throttled scroll listener for the nav; CSS scroll-driven progress bar                                                     |
| C12 | Footer wordmark rise driven by JavaScript on every frame         | "Letters rise in on view"                                                                                            | CSS scroll-driven animation (`animation-timeline: view()`); browsers without support show the letters statically                       |
| C13 | Dropdown panels anchored under each trigger                      | —                                                                                                                    | Panels centred under the header bar so the 880px Platform panel never overflows at 1024px                                              |
| C14 | Audience switch replaces page HTML and scrolls to top            | —                                                                                                                    | Real route change with the same 0.35s cross-fade; the hero entrance replays on the new page                                            |
| C15 | Newsletter form with fake success                                | Newsletter form shown                                                                                                | Form shown but disabled and dimmed, with "Newsletter sign-up is coming soon."                                                          |
| C16 | One generic dashboard per audience (same layout, different data) | Three distinct product stages                                                                                        | Figma: separate Operators / Brands / Networks dashboards and floating cards; prototype motion applied to each                          |
| C17 | Dashboard tilt and card parallax driven by a per-frame JS loop   | "Window rises / slides; cards parallax 0.9× / 1.1×"                                                                  | CSS scroll-driven animations (`animation-timeline: view()`), ≥768px tilt and ≥1280px parallax only; static in browsers without support |
| C18 | Same entrance for every audience                                 | Operators: window rises; Brands: window from left, cards from right; Networks: window from right, cards drop in left | Figma's per-audience entrances                                                                                                         |
| C19 | —                                                                | Brands heatmap title overlaps the "D0" column label                                                                  | Column labels moved to their own row (Figma defect)                                                                                    |
| C20 | Feeds and timers keep running when hidden                        | —                                                                                                                    | Feeds tick only while on screen and the tab is visible; all stage animations pause off screen; none under reduced motion               |

## Responsive interpretations (no mobile/tablet designs supplied)

| Area         | Decision                                                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header       | ≥1024px: full desktop nav (Contact sales hidden ≤1180px). <1024px: logo + compact CTA + menu button. ≤480px: CTA moves into the menu.                                         |
| Mobile menu  | Full-width panel under the bar, accordion sections, CTAs at the bottom; locks page scroll, closes on Escape/link/route change/resize to desktop, returns focus to the toggle. |
| No-JS mobile | The menu button is replaced by a "Menu" link to the footer sitemap.                                                                                                           |
| Hero         | Fluid H1 (40px → 88px); CTAs stack full-width below 768px; switcher hides icons ≤480px so all three options fit at 320px; award chip compacts ≤360px.                         |
| Footer       | Brand block above links ≤1180px; links in 3 columns ≤860px and 2 columns ≤560px; legal row stacks.                                                                            |

## Content flagged for confirmation

| Item                                                                                                                            | Status                                        |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Client logo row (Figma: "replace with real logos")                                                                              | Needs logo files and usage permission         |
| Brands case studies (Gamegram, Slot Bunny); Networks case card is a placeholder                                                 | Needs approval                                |
| AffPapa award claims                                                                                                            | Needs confirmation                            |
| Stakes figures ("as cited in Affnook's 2026 Tech Playbook")                                                                     | Needs source link/approval                    |
| Dashboard and activity values                                                                                                   | Displayed as labelled sample data             |
| Link destinations taken from the prototype (all affnook.com pages, Vimeo tour, AffPapa award, API docs, social profiles)        | Need owner confirmation before production     |
| "Pricing" links to `/contact-sales/` (no pricing page exists)                                                                   | Confirm intended destination                  |
| Footer "Fraud Shield" / "Commission bundling" use the specific platform pages from the nav (prototype footer used the homepage) | Confirm                                       |
| Footer "Career"                                                                                                                 | No URL known; rendered as text until supplied |

## Accepted risks

| #   | Risk                                                                                                                | Assessment                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| R1  | `npm audit`: GHSA-vfj7-8cjw-p6xm (high, CWE-674 stack exhaustion on deeply nested brace patterns) in `braces@3.0.3` | See [braces assessment](#braces-assessment). Development-only; not reachable by untrusted input; no fixed release exists. |
| R2  | Display font TT Firs Neue is commercial and not yet licensed for web use here                                       | System font fallback until licensed files are supplied; visual fidelity of headings is reduced until then                 |

### braces assessment

Verified on the installed tree (`npm ls braces --all`, `npm explain braces`):

- Single path: `eslint-config-next@16.4.2 → @next/eslint-plugin-next@16.4.2 → fast-glob@3.3.1 → micromatch@4.0.8 → braces@3.0.3`, installed as a **dev** dependency. `npm ls braces --omit=dev` is empty and `npm audit --omit=dev` reports 0 vulnerabilities, so nothing in the production build or runtime depends on it.
- The only use of `fast-glob` in `@next/eslint-plugin-next` is `utils/get-root-dirs.js`, called by the `no-html-link-for-pages` rule to expand `settings.next.rootDir` from the ESLint config. This project does not set `rootDir`, so the glob is never evaluated; even if it were, the pattern comes from our own committed config, never from user or network input. The vulnerability requires an attacker-controlled pattern.
- Next.js's runtime bundles `picomatch` (not `braces`) under `next/dist/compiled`; it is not affected by this advisory.
- No safer compatible version exists: `braces@3.0.3` is the latest release; `fast-glob@3.3.3` still depends on `micromatch@^4.0.8 → braces@^3.0.3`. npm's suggested fix is a downgrade to `eslint-config-next@14`, which is incompatible with Next.js 16. No override or forced install has been applied.
- Residual risk: low (local/CI lint only). Re-check whenever `eslint-config-next` is updated.

## Accessibility notes

- **Product stages** are illustrations with sample data. Each is a `<figure>` with a text description (`figcaption`); the decorative dashboard markup and simulated live feeds are hidden from screen readers so they are not read out number by number or announced as they change.
- **Muted H1 line** (`#7A84B0`, Figma `text/muted`) over the indigo glow: measured on rendered pixels at the glow's brightest frame, worst case **3.59:1** (390/1440/1920px, all three audiences). This passes WCAG 2.2 AA for large text (≥3:1; the H1 is 40–88px semibold) but would not pass the 4.5:1 normal-text level. Kept as designed; covered by `tests/e2e/contrast.spec.ts`.
