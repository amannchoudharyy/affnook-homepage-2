# QA plan and evidence

## Scope

Three audience routes (`/`, `/brands`, `/affiliate-networks`), all 14 homepage sections.
Forms, newsletter, CRM and backend lead processing are out of scope for the current milestone
and are not counted as defects.

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

## Release targets (measured on a deployed staging URL)

- Lighthouse mobile: Performance ≥ 90; Accessibility, Best Practices, SEO ≥ 95
- LCP ≤ 2.5 s, CLS ≤ 0.1

## Evidence log

Record command, date, commit, environment and result. "Not run" is recorded as such.

| Date | Commit | Check | Environment | Result |
| ---- | ------ | ----- | ----------- | ------ |
