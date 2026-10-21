# Architecture

## Goals

- One homepage design, three audiences (Operators, Brands, Affiliate networks), without
  duplicating page layouts.
- All content visible and navigable without JavaScript; motion is an enhancement only.
- Responsive from 320px to 2560px, keyboard accessible, respects `prefers-reduced-motion`.
- Minimal client-side JavaScript.

## Rendering model

The app uses the Next.js App Router. Components are **React Server Components by default**:
they run at build time and ship HTML, not JavaScript. Only components that need browser
behaviour (the animated audience transition, carousel, tabs, FAQ disclosure, mobile menu,
scroll-triggered motion) are marked `'use client'`, and each is kept as small as possible
("client islands").

All three routes are statically prerendered.

## Audience model

```
src/app/page.tsx                    → <AudienceHomePage audience="operators" />
src/app/brands/page.tsx             → <AudienceHomePage audience="brands" />
src/app/affiliate-networks/page.tsx → <AudienceHomePage audience="networks" />
```

- `src/content/audiences.ts` is the registry: id, label, route, hero and SEO copy. The
  `AudienceId` type (`'operators' | 'brands' | 'networks'`) is used throughout so a missing
  variant is a compile error.
- `AudienceHomePage` composes the shared sections in Figma order and passes the audience id down.
- Sections whose structure is the same for every audience read audience-specific copy from the
  content layer. Sections whose structure genuinely differs (hero product stage, Problem, Proof,
  How it works) get a variant component per audience behind one shared section wrapper.
- The audience switcher is a list of ordinary links (`aria-current="page"` on the active one),
  so switching works without JavaScript and every variant has its own URL.

## Code map

```
src/app/                      layout (header, footer, skip link, js flag + failsafe), one page.tsx per
                              audience, not-found.tsx, error.tsx, global-error.tsx, robots.ts, sitemap.ts
src/components/page/          AudienceHomePage — composes the sections in Figma order; StatusPage (404/error)
src/components/layout/        SiteHeader (HeaderShell, DesktopNav, MobileMenu), SiteFooter
src/components/sections/      hero/ (+ stage/ product dashboards), logos/, problem/, stakes/,
                              turn/, mcp/ (scripted assistant demo), proof/ (case
                              carousel, before/after slider), how/ (step explorer,
                              flow diagram, capability tabs), customization/,
                              testimonials/, objections/ (FAQ explorer), resources/,
                              final-cta/
src/components/audience/      AudienceSwitcher, AudienceLink, AudienceSwapReset
src/components/motion/        client islands: CountUp, LineField, LiveFeed, MotionRegion, Reveal, ScrubWords,
                              StagedSequence
src/components/ui/            ButtonLink, Eyebrow, SectionHeading, NewTabHint, icons
src/components/brand/         Logo, GiantLogo (path data from Figma)
src/content/                  audiences, navigation, links, dashboards (sample data), sections,
                              guide (Turn + MCP), proof (cases), how (steps, tabs),
                              closing (sections 9–13)
src/lib/                      site/SEO helpers, audience transition, motion helpers
```

Client components are limited to the files under `motion/`, `audience/`, the header shell, the
dashboard feeds, the MCP assistant demo, the case carousel and slider, the step explorer, the capability tabs,
the FAQ explorer, the header menus and the error boundaries (`app/error.tsx`,
`app/global-error.tsx`); everything else renders on the server.

## Styling

- CSS Modules, co-located with the components. Most components have their own stylesheet; a
  few sections share one module across their sub-components (How it works: 6 components in
  `HowItWorks.module.css`; header: 5 in `SiteHeader.module.css`; hero stage: `Dashboard` and
  `Charts`). Splitting those is a planned post-staging refactor.
- `src/styles/tokens.css` holds design tokens as CSS custom properties: Figma colour variables
  (plus three accessibility variants of `text/muted`), layout (container, gutter, header),
  pill radius, easing and z-index. Spacing, radius and type scales are not tokenised
  yet: those values are Figma-measured literals in the modules, and many colours are `rgba()`
  tints of the tokens (a planned post-staging clean-up).
- Desktop-first breakpoints (`max-width` media and container queries) with fluid `clamp()` /
  `minmax()` sizing, reflowing rather than scaling the desktop composition. No official
  mobile/tablet designs exist; responsive interpretations are recorded in
  [decisions.md](decisions.md).
- Elements that clip decorative overflow use `overflow: clip` rather than `hidden`, because
  `hidden` creates a scroll container and breaks `position: sticky` and CSS `view()` timelines.

## Motion

- CSS transitions/keyframes where sufficient; small IntersectionObserver-based islands for
  scroll-triggered effects (`Reveal`, `ScrubWords`, `CountUp`, `LiveFeed`, `MotionRegion`).
  The Final CTA line field (`LineField`) is a canvas drawn with requestAnimationFrame only
  while it is on screen; the Proof carousel pins and follows the page scroll on desktop.
  Scroll-linked tilt, parallax, progress bar and footer wordmark use CSS scroll-driven
  animations. No animation library.
- Reveal and word-highlight effects arm only after hydration, and reveal anything already on
  screen immediately.
- Content is never hidden waiting for JavaScript: initial styles are the final, visible state,
  and entrance animations are only armed once JavaScript has run.
- `prefers-reduced-motion: reduce` disables decorative loops, parallax and auto-advancing UI.
- Continuous animations pause when off-screen (`MotionRegion` / `Reveal` set
  `data-offscreen`). Scroll-driven effects (hero tilt and parallax, footer wordmark, progress
  bar) run on the compositor and simply do not move when off screen. Native scrolling is never
  intercepted.

## Assets and fonts

- Images and illustrations are exported from Figma, optimised, and stored under `public/`.
  No runtime references to Figma URLs; no large base64 payloads in source.
- JetBrains Mono comes from `next/font/google`: it is downloaded **at build time** and then
  served from this site (no runtime request to Google), so the build needs network access to
  Google Fonts. The display face (TT Firs Neue) will be loaded via `next/font/local` once
  licensed webfont files are available; system fonts are used until then.

## SEO and environments

`src/lib/site.ts` decides whether a build is indexable (`SITE_ENV=production` and an `https`
`SITE_URL` that is not a `*.vercel.app` host). A `SITE_ENV=production` build without such a
URL fails in `next.config.ts`. Without `SITE_URL`, canonicals fall back to the Vercel
deployment URL (or localhost locally). `src/lib/seo.ts` builds per-route metadata: title,
description, self-referencing canonical, Open Graph/Twitter and robots. On every
non-production build `robots.txt` disallows crawling and an `X-Robots-Tag: noindex, nofollow`
header plus the robots meta tag keep pages out of search indexes.

`next.config.ts` also sends security headers (CSP, COOP, nosniff, referrer and permissions
policy, frame denial), gives `public/images` a one-day cache lifetime and redirects
`/operators` to `/`.

## Error handling

- `app/not-found.tsx`: branded 404 inside the normal header and footer, with a `main`
  landmark and links to the three audience pages.
- `app/error.tsx`: if a client component throws, a branded "Something went wrong" page with
  "Try again" replaces the page content; `app/global-error.tsx` covers the root layout.
- Islands feature-detect `IntersectionObserver` / `ResizeObserver` and fall back to static
  content.
- The inline `html.js` script has a failsafe: if a Next.js chunk fails to load or the app has
  not hydrated within 8 s, the class is removed and the no-JS presentation takes over.

## Integrations

Forms, newsletter, CRM and analytics are out of scope for the current milestone. CTAs are plain
links; components are structured so a form or tracking layer can be added later without
reshaping the sections.

## Testing

| Layer   | Tool                                          | Covers                                              |
| ------- | --------------------------------------------- | --------------------------------------------------- |
| Unit    | Vitest + Testing Library                      | content registry, environment/SEO logic, components |
| Browser | Playwright (Chromium desktop and mobile)      | routes, switcher, no-JS rendering, overflow matrix  |
| A11y    | @axe-core/playwright                          | automated WCAG 2.2 A/AA checks per route            |
| Static  | TypeScript, ESLint (incl. jsx-a11y), Prettier | types, code and formatting rules                    |

CI (`.github/workflows/ci.yml`) is configured to run all of the above (plus
`npm audit --omit=dev`) on pushes to `main` and on pull requests. It has not run yet because
the repository has no remote.
