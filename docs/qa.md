# QA plan and evidence

## Scope

Three audience routes (`/`, `/brands`, `/affiliate-networks`), all 14 homepage sections.
Forms, newsletter, CRM and backend lead processing are out of scope for the current milestone
and are not counted as defects.

## Section completion

Figma order. ✅ implemented and tested. **All 14 sections are implemented for all three audiences.**

| #   | Section                                   | Operators | Brands | Affiliate networks |
| --- | ----------------------------------------- | --------- | ------ | ------------------ |
| 1   | Hero (nav, copy, switcher, product stage) | ✅        | ✅     | ✅                 |
| 2   | Logos + awards                            | ✅        | ✅     | ✅                 |
| 3   | Problem                                   | ✅        | ✅     | ✅                 |
| 4   | Stakes                                    | ✅        | ✅     | ✅                 |
| 5   | Turn — Affnook as your guide              | ✅        | ✅     | ✅                 |
| 6   | Affnook MCP — AI assistant                | ✅        | ✅     | ✅                 |
| 7   | Proof — case studies                      | ✅        | ✅     | ✅                 |
| 8   | How it works + capability tabs            | ✅        | ✅     | ✅                 |
| 9   | Customization bento                       | ✅        | ✅     | ✅                 |
| 10  | Testimonials                              | ✅        | ✅     | ✅                 |
| 11  | Objections + FAQ                          | ✅        | ✅     | ✅                 |
| 12  | Resources                                 | ✅        | ✅     | ✅                 |
| 13  | Final CTA                                 | ✅        | ✅     | ✅                 |
| 14  | Footer                                    | ✅        | ✅     | ✅                 |

## Viewport matrix (CSS px)

| Tier    | Widths                     |
| ------- | -------------------------- |
| Mobile  | 320, 360, 375, 390, 430    |
| Tablet  | 768, 820, 1024 (landscape) |
| Desktop | 1280, 1440, 1512           |
| Wide    | 1920, 2560                 |

Automated overflow checks run at 320, 360, 390, 768, 1024, 1280, 1440, 1920 and 2560 for every
route. Visual review uses screenshots at mobile, tablet and desktop widths for each audience.

## Checks per phase

- `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
- `npm run test:e2e` (Chromium desktop + mobile emulation)
- Manual: keyboard walk-through, reduced-motion, JavaScript disabled, screenshots

## Intentionally skipped tests

Playwright reports some tests as skipped by design; none are skipped because they fail, and every
skipped mobile-project test runs in the desktop project. Current breakdown (191 of 486):

| Spec                            | Skipped | Where                                 | Reason                                                                       |
| ------------------------------- | ------- | ------------------------------------- | ---------------------------------------------------------------------------- |
| `screenshots.spec.ts`           | 54      | both projects, unless `SCREENSHOTS=1` | Produces review images, not assertions (desktop-only when enabled)           |
| `responsive.spec.ts`            | 27      | mobile project                        | Sets its own viewport sizes, so running it twice adds nothing                |
| `sections.spec.ts` width matrix | 27      | mobile project                        | Sets its own viewport sizes                                                  |
| `stage.spec.ts` width matrix    | 27      | mobile project                        | Sets its own viewport sizes                                                  |
| `contrast.spec.ts`              | 18      | mobile project                        | Sets its own viewport sizes                                                  |
| `regressions.spec.ts`           | 18      | mobile project                        | Audit regression tests; set their own viewport sizes                         |
| `motion-parity.spec.ts`         | 15      | mobile project                        | Prototype motion-parity tests; set their own viewport sizes                  |
| `header-desktop.spec.ts`        | 4       | mobile project                        | Desktop navigation is not shown on a phone; the mobile menu has its own spec |
| `proof-how.spec.ts` mouse drag  | 1       | mobile project                        | Phones swipe the native scroller; click-and-drag is a desktop enhancement    |

## Pre-deployment audit (2026-10-21)

Independent audit by 17 specialist reviewers (architecture, documentation, Figma fidelity ×3,
motion vs prototype, responsive, accessibility, performance + SEO, security + deployment,
content + links, tests), with each medium-or-higher finding re-reproduced by a separate
verifier. Fixed in the audit commit, each covered by `tests/e2e/regressions.spec.ts` or a unit
test where practical:

- Header "Affnook MCP" promo linked to a missing `#mcp` anchor (all routes).
- Networks Problem statement never pinned; hero tilt/parallax and footer wordmark never moved
  (`overflow: hidden` created scroll containers → `overflow: clip`).
- Brands Problem cards overlapped each other below 768px.
- Hero dashboard cut off by the hero at 1280–1454px (Networks/Operators); KPI deltas wrapped
  unevenly.
- Header links and actions overlapped at 1181–1268px; footer social icons overflowed.
- Footer Billing policy and Terms links returned 404.
- How it works: tier pills squashed, phone table/hub overflow, stepper skipped steps 01–02,
  capability tabs not scrolled into view on phones.
- Keyboard and contrast: carousel arrows dropped focus at the ends, focus could hide under
  the fixed header, dropdown hover/click conflict, switcher label and non-text contrast,
  missing new-tab cues.
- Robustness: rapid audience switching could land on the wrong audience; no error
  boundaries or branded 404; a JS-load failure hid FAQ answers and the mobile menu.
- Deployment: Node pinned to 22.x, indexing guard for `*.vercel.app` and misconfigured
  production builds, CSP/COOP headers, image cache lifetime, CI action versions and
  `npm audit --omit=dev` in CI, docs corrected.

Open items that need a decision (not fixed): see "Content flagged for confirmation" and C55,
C58 in [decisions.md](decisions.md), and section 5 of [deployment.md](deployment.md).
Lighthouse was measured on staging after deployment (see the evidence log).

## Release targets (measured on a deployed staging URL)

- Lighthouse mobile: Performance ≥ 90; Accessibility, Best Practices, SEO ≥ 95
- LCP ≤ 2.5 s, CLS ≤ 0.1

## Evidence log

Record command, date, commit, environment and result. "Not run" is recorded as such.

| Date       | Commit                | Check                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Environment                                            | Result          |
| ---------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | --------------- |
| 2026-10-19 | e1747ba               | format, lint, typecheck, unit (12), build, e2e (57 passed / 27 skipped)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | local, Chromium 1440 + Pixel 7 emulation               | Pass            |
| 2026-10-19 | 6790be5               | format, lint, typecheck, unit (17), build, e2e (87 passed / 73 skipped by design), screenshots 3 audiences × 7 widths reviewed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | local prod build, Chromium 1440 + Pixel 7 emulation    | Pass            |
| 2026-10-19 | bf3ce58               | format, lint, typecheck, unit (21), build, e2e (143 passed / 115 skipped by design), CLS ≤ 0.0008 all routes, muted-H1 contrast ≥ 3.59:1, 39/39 external links 200, screenshots 3 audiences × 7 widths + Figma-width stage close-ups reviewed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | local prod build, Chromium 1440 + Pixel 7 emulation    | Pass            |
| 2026-10-19 | c8f7731               | format, lint, typecheck, unit (21), build, e2e (190 passed / 142 skipped by design) incl. axe on all routes (desktop + mobile), CLS 0.0000 all routes, CTA destination titles verified, mobile type audit (body ≥13px), screenshots 3 audiences × 7 widths + section close-ups reviewed                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | local prod build, Chromium 1440 + Pixel 7 emulation    | Pass            |
| 2026-10-19 | 15a8dca               | format, lint, typecheck, unit (21), build, e2e (208 passed / 148 skipped by design) incl. axe on all routes, new turn/MCP spec (content, links, keyboard chips, live animation script, reduced motion, no-JS), CLS 0.0000 with motion (390/1440, all routes), overflow audit 320–2560, screenshots 3 audiences × 7 widths + section close-ups vs Figma                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | local prod build, Chromium 1440 + Pixel 7 emulation    | Pass            |
| 2026-10-19 | 30f9e1f               | format, lint, typecheck, unit (21), build, e2e (233 passed / 149 skipped by design) incl. axe on all routes plus an axe sweep of every capability tab, step window and carousel slide (clean), new proof/how spec (content, links, carousel arrows/dots/drag, slider keyboard/pointer/sweep, steps click/keyboard/scroll, ARIA tabs, flow animation pause, reduced motion, no-JS), whole-page CLS 0.0000 with motion (390/1440, all routes), screenshots 3 audiences × 7 widths + section close-ups vs Figma                                                                                                                                                                                                                                                                                                                                                                                                                     | local prod build, Chromium 1440 + Pixel 7 emulation    | Pass            |
| 2026-10-19 | 3eb905e               | format, lint, typecheck, unit (21), build, e2e (260 passed / 158 skipped by design, 0 failed) incl. axe on all routes plus an axe sweep of every FAQ category and open answer (clean), new closing spec (content, links per audience, FAQ keyboard tabs + accordion, chip snap, URL type-out, drag loop pause, quote scrub, CTA loops pause, reduced motion, no-JS), Final CTA muted-line contrast ≥ 3.93:1, whole-page CLS 0.0000 with motion (390/1440, all routes), 51/51 external links 200, screenshots 3 audiences × 7 widths + section close-ups vs Figma                                                                                                                                                                                                                                                                                                                                                                 | local prod build, Chromium 1440 + Pixel 7 emulation    | Pass            |
| 2026-10-21 | audit fix             | format, lint, typecheck, unit (24), build, e2e (278 passed / 176 skipped by design, 0 failed, no retries) incl. 18 new regression tests (layout, focus, switching, 404, JS-failure fallback, axe on menus/widgets/404); fix-verification script (55 checks: anchors, sticky, overlaps 320–1512, hero cut-off sweep, scroll-driven motion, KPI rows, focus, rapid switching, 404, JS-failure fallback, console/CSP errors on all routes at 390/1440); 54 external links: 53 × 200, Facebook blocks scripted requests (400); `npm audit --omit=dev` 0                                                                                                                                                                                                                                                                                                                                                                              | local prod build, Chromium 1440 + Pixel 7 emulation    | Pass            |
| 2026-10-21 | d5a1774               | **Staging** https://affnook-homepage-staging.vercel.app: noindex meta + `X-Robots-Tag` + `robots.txt` Disallow; canonical, Open Graph URL and sitemap on the staging origin; CSP, COOP, HSTS; `/operators` 308; branded 404; `/images` cache 1 day. E2E against staging: 273 passed / 176 skipped / 4 flaky (35 s network timeouts, passed on retry) / 1 failed (the JS-failure test's route pattern did not match Vercel's `/_next/static/immutable/` chunk path; test fixed). **Lighthouse 13.5.0, mobile, median of 3 runs (Networks 4)** — Performance: Operators 96, Brands 98, Networks 98; Accessibility 97; Best Practices 96 (`/favicon.ico` 404); SEO 69 (expected: staging is `noindex`); LCP 2.51 / 2.12 / 2.06 s; TBT 24–35 ms; CLS 0. Accessibility finding (dimmed scroll-highlight words 1.5:1) fixed after this run                                                                                             | Vercel (Hobby) staging, Lighthouse with local Chromium | Pass with notes |
| 2026-10-21 | 85b7a56               | **Staging re-check** after the scroll-highlight contrast fix. **Lighthouse 13.5.0, mobile, median of 3 runs** — Performance: Operators 99, Brands 98, Networks 98; Accessibility 100 (all routes); Best Practices 96 (only `/favicon.ico` 404); SEO 69 (expected: staging is `noindex`); LCP 1.71 / 1.85 / 2.02 s; TBT 22–38 ms; CLS 0. All mobile targets met (Performance ≥ 90, Accessibility and Best Practices ≥ 95, LCP ≤ 2.5 s, CLS ≤ 0.1); SEO target applies to production only                                                                                                                                                                                                                                                                                                                                                                                                                                          | Vercel (Hobby) staging, Lighthouse with local Chromium | Pass            |
| 2026-10-21 | motion parity (local) | Animation parity with the prototype (Proof/How heading character rise on all 3 routes; capability-tab 7s timer; Final CTA canvas line field; hybrid pinned Proof carousel; footer wordmark hover clipping). Prototype vs build recorded side by side (`.screenshots-local/recordings/`, git-ignored) at 1440 for all 3 audiences and 390; numeric samples match (heading first-char offset 17.0→7.2→2.1→0.1px vs prototype 17.4→8.3→2.4→0.1px; tabs advance every 7s; pinned travel 2248px vs prototype 2400px with its extra card). Pinned stage fits at 1280×860–2560×1440; CLS 0.0000 at 390/1440 on all routes; no listener/observer growth after 9 audience switches; keyboard focus and touch drag verified in pinned mode. format, lint, typecheck, unit (24), build, e2e 295 passed / 191 skipped / 0 failed incl. 15 new parity tests. Lighthouse not re-measured for this change (earlier staging scores do not apply) | local prod build, Chromium                             | Pass            |

Note: the Phase 5–6 rows' "axe sweep of every capability tab, step window, carousel slide,
FAQ category and open answer" and the whole-page CLS figures were scripted one-off checks run
next to the suite; the committed suite runs axe on every route in both projects (`smoke.spec.ts`) and, since
the audit, with the menus open and widgets switched (`regressions.spec.ts`).
