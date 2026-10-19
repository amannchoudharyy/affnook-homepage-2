# QA plan and evidence

## Scope

Three audience routes (`/`, `/brands`, `/affiliate-networks`), all 14 homepage sections.
Forms, newsletter, CRM and backend lead processing are out of scope for the current milestone
and are not counted as defects.

## Section completion

Figma order. ✅ implemented and tested · ⏳ not started.

| #   | Section                                   | Operators | Brands | Affiliate networks |
| --- | ----------------------------------------- | --------- | ------ | ------------------ |
| 1   | Hero (nav, copy, switcher, product stage) | ✅        | ✅     | ✅                 |
| 2   | Logos + awards                            | ✅        | ✅     | ✅                 |
| 3   | Problem                                   | ✅        | ✅     | ✅                 |
| 4   | Stakes                                    | ✅        | ✅     | ✅                 |
| 5   | Turn — Affnook as your guide              | ⏳        | ⏳     | ⏳                 |
| 6   | Affnook MCP — AI assistant                | ⏳        | ⏳     | ⏳                 |
| 7   | Proof — case studies                      | ⏳        | ⏳     | ⏳                 |
| 8   | How it works + capability tabs            | ⏳        | ⏳     | ⏳                 |
| 9   | Customization bento                       | ⏳        | ⏳     | ⏳                 |
| 10  | Testimonials                              | ⏳        | ⏳     | ⏳                 |
| 11  | Objections + FAQ                          | ⏳        | ⏳     | ⏳                 |
| 12  | Resources                                 | ⏳        | ⏳     | ⏳                 |
| 13  | Final CTA                                 | ⏳        | ⏳     | ⏳                 |
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

Playwright reports some tests as skipped by design; none are skipped because they fail.

| Spec                                                         | Skipped in                      | Reason                                                                       |
| ------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------------------------- |
| `screenshots.spec.ts`                                        | all runs unless `SCREENSHOTS=1` | Produces review images, not assertions                                       |
| `responsive.spec.ts`, stage width matrix, `contrast.spec.ts` | mobile project                  | They set their own viewport sizes, so running them twice adds nothing        |
| `header-desktop.spec.ts`                                     | mobile project                  | Desktop navigation is not shown on a phone; the mobile menu has its own spec |

## Release targets (measured on a deployed staging URL)

- Lighthouse mobile: Performance ≥ 90; Accessibility, Best Practices, SEO ≥ 95
- LCP ≤ 2.5 s, CLS ≤ 0.1

## Evidence log

Record command, date, commit, environment and result. "Not run" is recorded as such.

| Date       | Commit    | Check                                                                                                                                                                                                                                                                                   | Environment                                         | Result |
| ---------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------ |
| 2026-10-19 | e1747ba   | format, lint, typecheck, unit (12), build, e2e (57 passed / 27 skipped)                                                                                                                                                                                                                 | local, Chromium 1440 + Pixel 7 emulation            | Pass   |
| 2026-10-19 | (Phase 1) | format, lint, typecheck, unit (17), build, e2e (87 passed / 73 skipped by design), screenshots 3 audiences × 7 widths reviewed                                                                                                                                                          | local prod build, Chromium 1440 + Pixel 7 emulation | Pass   |
| 2026-10-19 | (Phase 2) | format, lint, typecheck, unit (21), build, e2e (143 passed / 115 skipped by design), CLS ≤ 0.0008 all routes, muted-H1 contrast ≥ 3.59:1, 39/39 external links 200, screenshots 3 audiences × 7 widths + Figma-width stage close-ups reviewed                                           | local prod build, Chromium 1440 + Pixel 7 emulation | Pass   |
| 2026-10-19 | (Phase 3) | format, lint, typecheck, unit (21), build, e2e (190 passed / 142 skipped by design) incl. axe on all routes (desktop + mobile), CLS 0.0000 all routes, CTA destination titles verified, mobile type audit (body ≥13px), screenshots 3 audiences × 7 widths + section close-ups reviewed | local prod build, Chromium 1440 + Pixel 7 emulation | Pass   |
