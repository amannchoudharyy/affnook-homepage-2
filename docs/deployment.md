# Staging deployment (Vercel) — pre-deployment checklist

Status: **not deployed**. Nothing has been pushed to a remote or deployed. Items marked
"owner" need an account, access or an approval the project does not have yet. Lighthouse
has **not** been measured; it needs a deployed URL.

## 1. Prerequisites (owner)

- [ ] GitHub repository created in the agreed organisation; push of `main` approved.
- [ ] Vercel team/project owner identified; project linked to that repository.
- [ ] Staging hostname decided (default `*.vercel.app`, or a staging subdomain — a DNS change
      needs separate approval). No production domain is attached at this stage.
- [ ] Decide who may view staging (Vercel Deployment Protection). Lighthouse and the
      Playwright suite need a public URL or a protection-bypass token.

## 2. Vercel configuration

| Setting                 | Value                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------- |
| Framework preset        | Next.js (auto-detected); no `vercel.json` needed                                   |
| Node.js version         | 22.x (matches `.nvmrc` / `engines`)                                                |
| Install / build command | `npm ci` / `npm run build` (defaults)                                              |
| Output                  | Static prerendered routes (`/`, `/brands`, `/affiliate-networks`)                  |
| Security headers        | Set in `next.config.ts` (nosniff, referrer policy, frame deny, permissions policy) |

### Environment variables

| Variable   | Staging value                                                  | Notes                                   |
| ---------- | -------------------------------------------------------------- | --------------------------------------- |
| `SITE_ENV` | `staging` (Preview **and** the staging branch)                 | Never `production` on staging           |
| `SITE_URL` | the staging origin, e.g. `https://affnook-homepage.vercel.app` | Canonicals, sitemap, Open Graph; no `/` |

No secrets are required: the site has no API keys, forms or integrations.

## 3. SEO / indexing on staging

`SITE_ENV=staging` keeps every page `noindex`: robots meta tag, `robots.txt`
(`Disallow: /`) and an `X-Robots-Tag: noindex, nofollow` header. Canonicals are
self-referencing and use `SITE_URL` — a build without `SITE_URL` falls back to
`http://localhost:3000`, so it must be set on Vercel.

## 4. Verify after the first deploy

- [ ] `curl -I <url>` shows `x-robots-tag: noindex, nofollow`; `<url>/robots.txt` disallows all.
- [ ] Canonical and sitemap URLs use the staging origin.
- [ ] Browser suite against staging: `E2E_BASE_URL=<url> CI=1 npx playwright test`
      (expect the pass/skip counts in [docs/qa.md](qa.md)).
- [ ] Lighthouse (mobile, 3 runs per route, median): Performance ≥ 90; Accessibility,
      Best Practices ≥ 95; SEO is expected to be lower on staging because pages are
      deliberately `noindex`. LCP ≤ 2.5 s, CLS ≤ 0.1.
- [ ] Spot-check Safari (macOS/iOS) and Firefox — not covered by the local suite.
- [ ] Record URL, commit SHA and results in the evidence log in [docs/qa.md](qa.md).

## 5. Open items to clear before QA sign-off

**Design differences from Figma** (full list with reasons: [decisions.md](decisions.md),
tables "Figma vs. motion prototype" and "Responsive interpretations"):

- Display font TT Firs Neue is not licensed here; headings use a system fallback, so line
  breaks and weight differ from Figma (R2). This is the largest visual gap.
- "Sample data" / "Demo feed" labels instead of "Live" (C21, C43); product demo caption on
  the MCP assistant (C30).
- Contrast-driven colour tweaks: muted text on raised surfaces (#7F89B5 / #8B95C0), chat
  label opacity, chip tints.
- Content Figma does not draw (carousel slides 2–3, step windows 01/02/04, capability panels
  2–6, FAQ Migration/Pricing) comes from the approved prototype or published affnook.com
  pages (C37, C40, C42, C50).
- Equal-width pills in the Problem deposit and Networks flow diagrams (C33, C44).

**Unverified marketing content and customer claims** (see "Content flagged for confirmation"
in decisions.md): case-study metrics (Unicon365, Gamegram, Slot Bunny), the Networks platform
card, stakes statistics and sources, AffPapa award usage and the testimonial (headshot and
permission), objection-card claims, FAQ answers, uptime/integration claims, client logo
wordmarks (placeholders), SEO titles/descriptions.

**Font licensing**: TT Firs Neue webfont licence and files (owner).

**External CTA and resource destinations**: 51 unique external links checked on all three
routes — all returned HTTP 200 (2026-10-19). Destinations still need owner confirmation:
book demo, contact sales ("Pricing" and "See pricing" also go there — no pricing page), why
Affnook, Vimeo tour, AffPapa award, case-study pages, `/affnook-mcp/`, `/24-7-support/`,
`/seamless-migration/`, `/features-on-request/`, `/career/`, and the resource articles
(Brands card 3 falls back to `/industry-reports/`).

**Security and dependency advisories**: `npm audit` reports 5 high-severity advisories, all
one dev-only chain (`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch →
braces`); `npm audit --omit=dev` reports 0. Assessment in decisions.md ("braces
assessment"). No secrets in the repository.

**Deferred (not defects this milestone)**: forms, newsletter submission (the footer form is
shown disabled with a "coming soon" note), CRM (HubSpot/Salesforce), lead APIs, analytics and
consent tooling. Components are structured so they can be added in the production phase.

**Known limitations**: Lighthouse not yet measured; Safari/Firefox and real devices not yet
tested; FAQ category tabs and carousel controls need JavaScript (without it all content is
shown in full); headshot/logos pending.

## 6. Rollback

Vercel keeps every deployment: promote the previous one ("Instant Rollback") or revert the
commit and redeploy. Staging has no data or integrations to migrate.

## 7. Out of scope for staging

Production domain cutover, DNS, analytics/consent, forms, newsletter, CRM and lead APIs —
each needs its own requirements and approval.
