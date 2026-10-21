# Staging deployment (Vercel)

Status: **deployed to staging** on 2026-10-21 — https://affnook-homepage-staging.vercel.app
(Vercel project `affnook-homepage-staging` on a personal Hobby account, connected to the
GitHub repository `amannchoudharyy/affnook-homepage-2`, branch `main`). Not production: no
custom domain, DNS or cutover. Pre-deployment audit, staging checks and Lighthouse results are
in [qa.md](qa.md). Moving the repository and project to company-owned GitHub/Vercel accounts
(Vercel's Hobby plan is for non-commercial use) is an open owner decision.

## 1. Prerequisites (owner)

- [ ] GitHub repository created in the agreed organisation; push of `main` approved.
- [ ] Vercel team/project owner identified; a **dedicated staging project** linked to that
      repository (its "Production" environment is the staging site).
- [ ] Staging hostname decided (default `<project>.vercel.app`, or a staging subdomain — a
      DNS change needs separate approval). No production domain is attached at this stage.
- [ ] Decide who may view staging (Vercel Deployment Protection). For the automated checks,
      enable **Protection Bypass for Automation** and keep the secret out of Git.

## 2. Vercel configuration

| Setting          | Value                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Framework preset | Next.js (auto-detected); no `vercel.json` needed                                                     |
| Node.js version  | 22.x — pinned by `engines` in `package.json` (Vercel reads `engines`, not `.nvmrc`)                  |
| Install command  | Override to `npm ci` (Vercel's default for npm projects is `npm install`)                            |
| Build command    | `npm run build` (default)                                                                            |
| Output           | Static prerendered routes (`/`, `/brands`, `/affiliate-networks`, 404) served from Vercel's edge CDN |
| Headers          | From `next.config.ts`: CSP, COOP, nosniff, referrer and permissions policy, frame denial, noindex    |
| Caching          | HTML: Vercel edge cache, purged on each deploy; `/_next/static`: immutable; `/images`: 1 day + SWR   |
| Images           | Plain `<img>` for SVG art; `next/image` only for the two award PNGs (Vercel Image Optimization)      |

### Environment variables

Both are read **at build time**; changing them needs a redeploy.

| Variable   | Production environment (= staging site)                               | Preview environment                                  |
| ---------- | --------------------------------------------------------------------- | ---------------------------------------------------- |
| `SITE_ENV` | `staging`                                                             | `staging`                                            |
| `SITE_URL` | the stable staging origin, e.g. `https://affnook-homepage.vercel.app` | leave unset: canonicals use the deployment's own URL |

Guardrails in the code: a `*.vercel.app` host is never indexable, and a build with
`SITE_ENV=production` fails unless `SITE_URL` is an `https://` production origin, so the
staging project cannot be indexed or ship localhost canonicals by mistake. No secrets are
required: the site has no API keys, forms or integrations.

For the later production project (not part of staging): `SITE_ENV=production` and
`SITE_URL=https://affnook.com` (today's live site serves the apex domain; `www` redirects to
it). Replacing the live WordPress homepage needs its own URL/redirect plan.

## 3. SEO / indexing on staging

`SITE_ENV=staging` keeps every page `noindex`: robots meta tag, `robots.txt`
(`Disallow: /`) and an `X-Robots-Tag: noindex, nofollow` header. Canonicals are
self-referencing and use `SITE_URL` (or the deployment URL on previews). Lighthouse's SEO
category will flag the deliberate `noindex`, so the SEO ≥ 95 target applies to production
only.

## 4. Verify after the first deploy

- [ ] `curl -sI <url>` shows `x-robots-tag: noindex, nofollow`, the CSP and COOP headers;
      `<url>/robots.txt` disallows all; `<url>/operators` redirects to `/`; an unknown path
      returns the branded 404.
- [ ] Canonical, Open Graph URL and sitemap entries use the staging origin.
- [ ] Browser suite against staging (bypass secret only needed when protection is on):
      `VERCEL_AUTOMATION_BYPASS_SECRET=<secret> E2E_BASE_URL=<url> CI=1 npx playwright test`
      — expect the pass/skip counts in [qa.md](qa.md).
- [ ] Lighthouse (mobile, 3 runs per route, median), e.g.
      `npx lighthouse <url> --form-factor=mobile --extra-headers='{"x-vercel-protection-bypass":"<secret>"}'`.
      Targets: Performance ≥ 90; Accessibility, Best Practices ≥ 95; LCP ≤ 2.5 s; CLS ≤ 0.1.
- [ ] Spot-check Safari (macOS/iOS) and Firefox — not covered by the local suite.
- [ ] Record URL, commit SHA and results in the evidence log in [qa.md](qa.md).

## 5. Open items to clear before QA sign-off

**Design differences from Figma** (full list with reasons: [decisions.md](decisions.md),
"Figma vs. motion prototype" and "Responsive interpretations"):

- Display font TT Firs Neue is not licensed here; headings use a system fallback, so line
  breaks and weight differ from Figma (R2). This is the largest visual gap.
- "Sample data" / "Demo feed" labels instead of "Live" (C21, C43); product demo caption on
  the MCP assistant (C30).
- Contrast-driven colour tweaks: muted-text tokens on raised surfaces and over the hero glow,
  chat label opacity, carousel dots and FAQ selected tab, chip tints.
- Content Figma does not draw (carousel slides 2–3, step windows 01/02/04, capability panels
  2–6, FAQ Migration/Pricing) comes from the approved prototype or published affnook.com
  pages (C37, C40, C42, C50).
- Section-heading per-character entrance not implemented on 7 headings (C55); no visible
  pause control for the logo marquee and hero feeds (C58, WCAG 2.2.2 — open a11y item).

**Unverified marketing content and customer claims**: see "Content flagged for confirmation"
in decisions.md (case-study metrics, stakes statistics, AffPapa award and testimonial,
objection and FAQ answers including the free-trial contradiction, uptime/integration claims,
client logos, SEO copy, share image and favicon).

**Font licensing**: TT Firs Neue webfont licence and files (owner).

**External destinations** (checked 2026-10-21, 54 unique external links on the three
routes): 53 return 200; Facebook rejects scripted requests (HTTP 400) and was checked
manually only. The footer's Billing policy and Terms links were repointed to the live
`/payment-policy/` and `/terms-of-use/` pages (the prototype's slugs return 404). Owner
confirmation still needed for all destinations, in particular "Pricing" / "See pricing"
(`/contact-sales/` today; an unlinked `/pricing/` page exists).

**Security and dependency advisories**: `npm audit` reports 5 high-severity advisories, all
one dev-only chain (`eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch →
braces`); `npm audit --omit=dev` reports 0 and runs in CI. Assessment in decisions.md
("braces assessment"). No secrets in the repository or its history.

**Deferred (not defects this milestone)**: forms, newsletter submission (the footer form is
shown disabled with a "coming soon" note), CRM (HubSpot/Salesforce), lead APIs, analytics and
consent tooling. Components are structured so they can be added in the production phase.

**Known limitations**: Safari/Firefox and real devices not yet tested; carousel controls and FAQ/tab switching need JavaScript (without it all content is
shown in full); headshot, logos, share image and favicon pending.

## 6. Rollback

- **Staging site (the project's Production environment)**: Vercel keeps every deployment —
  use Instant Rollback to the previous production deployment, or promote an older one.
  Rollback restores the build, not environment variables: if a variable change caused the
  problem, change it back and redeploy.
- **Preview deployments**: open the earlier deployment's URL, or revert the commit and push.
- Staging has no data or integrations to migrate, so a rollback has no side effects.

## 7. Troubleshooting

| Symptom                                                                           | Fix                                                                                                                                                                                                                                                           |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build fails in `next/font/google` ("queries have exactly one entry")              | A stale Turbopack build cache (seen locally on 2026-10-20). On Vercel: Redeploy without "Use existing Build Cache". Locally: delete `.next/cache/turbopack`.                                                                                                  |
| Build fails fetching Google Fonts                                                 | The JetBrains Mono download needs network access at build time; retry, or switch to `next/font/local` with the OFL files                                                                                                                                      |
| Build fails with "SITE_ENV=production requires SITE_URL …"                        | Intended guard: use `SITE_ENV=staging` on staging; production needs the https production origin                                                                                                                                                               |
| Pages indexable / canonicals point to the wrong host                              | Check `SITE_ENV`/`SITE_URL` for that environment, then redeploy (build-time variables)                                                                                                                                                                        |
| Vercel: "Deployment Blocked — the commit author did not have contributing access" | Hobby plan + private repository: only commits authored by the Vercel account owner deploy. This repo sets a repo-only Git author (`git config --local user.name/user.email`) to the owner's GitHub account; a company Vercel Pro team removes the restriction |

## 8. Maintenance

- **Dependencies**: review `npm outdated` monthly; update one group at a time (Next/React,
  lint, test tooling) and run `npm run check` plus the browser suite before merging.
  Re-check the braces advisory whenever `eslint-config-next` changes.
- **Node.js**: change `engines`, `.nvmrc`, `@types/node` and the Vercel setting together.
- **Display font**: when licensed files arrive, add them under `src/app/` and load them
  with `next/font/local`, then update `--font-display` / `--font-body` in `tokens.css` and
  re-run the screenshot review.
- **Forms, newsletter, CRM**: add as client islands or server actions in the production
  phase, with approved endpoints, consent and tests; the footer form markup is in place.

## 9. Out of scope for staging

Production domain cutover, DNS, analytics/consent, forms, newsletter, CRM and lead APIs —
each needs its own requirements and approval.
