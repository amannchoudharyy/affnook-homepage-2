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

| #   | Decision                                                                            | Reason                                                                                     |
| --- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| A1  | Three statically rendered routes: `/` (Operators), `/brands`, `/affiliate-networks` | Each variant is shareable, indexable and fully usable without JavaScript                   |
| A2  | Audience switcher implemented as links with `aria-current`                          | Works without JavaScript; correct semantics for navigation between pages                   |
| A3  | CSS Modules + CSS custom-property tokens; no CSS framework                          | Small output, plain CSS, tokens map 1:1 to Figma variables                                 |
| A4  | No animation library initially                                                      | The prototype's effects are achievable with CSS + IntersectionObserver                     |
| A5  | Indexing is opt-in (`SITE_ENV=production` + https `SITE_URL`)                       | Staging and previews can never be indexed by accident                                      |
| A6  | TypeScript 6.0.x instead of 7.x                                                     | typescript-eslint supports TypeScript `<6.1`                                               |
| A7  | ESLint 9.x instead of 10.x                                                          | eslint-plugin-jsx-a11y (used by eslint-config-next) does not yet declare ESLint 10 support |
| A8  | SEO titles and descriptions are provisional                                         | Derived from hero copy; require marketing approval before production                       |

## Figma vs. motion prototype

Where they differ, Figma governs layout/structure and the prototype governs motion.

| #   | Prototype                                                 | Figma                                 | Resolution                                                                              |
| --- | --------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------- |
| C1  | Standalone "Features" tabs section                        | Capability tabs inside "How it works" | Follow Figma; reuse the prototype's tab crossfade                                       |
| C2  | Large "big marquee" section before the final CTA          | Not present                           | Omit                                                                                    |
| C3  | Case studies as pinned horizontal scroll on large screens | Carousel with drag, arrows and dots   | Carousel; no scroll pinning                                                             |
| C4  | Feature tabs auto-advance                                 | "Tabs crossfade"                      | User-driven; any auto-advance pauses on hover/focus and is disabled with reduced motion |
| C5  | Custom smooth-scrolling wheel handler                     | —                                     | Omitted: native scrolling is never intercepted                                          |
| C6  | Newsletter shows a success message without submitting     | —                                     | Omitted: no simulated submission (forms are out of scope for this milestone)            |
| C7  | Before/after slider is pointer-only                       | —                                     | Rebuilt as a keyboard-operable slider with ARIA values                                  |
| C8  | Content injected by JavaScript                            | —                                     | Server-rendered markup                                                                  |

## Content flagged for confirmation

| Item                                                                            | Status                                |
| ------------------------------------------------------------------------------- | ------------------------------------- |
| Client logo row (Figma: "replace with real logos")                              | Needs logo files and usage permission |
| Brands case studies (Gamegram, Slot Bunny); Networks case card is a placeholder | Needs approval                        |
| AffPapa award claims                                                            | Needs confirmation                    |
| Stakes figures ("as cited in Affnook's 2026 Tech Playbook")                     | Needs source link/approval            |
| Dashboard and activity values                                                   | Displayed as labelled sample data     |

## Accepted risks

| #   | Risk                                                                                            | Assessment                                                                                                                                                                                                                                                               |
| --- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| R1  | `npm audit` reports a high-severity advisory in `braces` via `eslint-config-next` → `fast-glob` | Development-only lint tooling; it only processes this repository's own glob patterns. No patched `braces` release exists; the suggested fix is a downgrade to `eslint-config-next@14`. `npm audit --omit=dev` reports 0 vulnerabilities. Re-check on dependency updates. |
| R2  | Display font TT Firs Neue is commercial and not yet licensed for web use here                   | System font fallback until licensed files are supplied; visual fidelity of headings is reduced until then                                                                                                                                                                |
