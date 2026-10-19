# Staging deployment (Vercel) — readiness checklist

Status: **not deployed**. Nothing has been pushed to a remote or deployed. Each step marked
"owner" needs an account, access or an approval that the project does not have yet.

## 1. Prerequisites (owner)

- [ ] GitHub repository created in the agreed organisation; push of `main` approved.
- [ ] Vercel team/project owner identified; project linked to that repository.
- [ ] Decide the staging hostname (default `*.vercel.app`, or a staging subdomain — DNS change
      needs separate approval). No production domain is attached at this stage.
- [ ] Decide who may view staging (Vercel Deployment Protection on/off). Lighthouse and the
      Playwright suite need either a public URL or a protection-bypass token.

## 2. Project settings

| Setting                 | Value                                                             |
| ----------------------- | ----------------------------------------------------------------- |
| Framework preset        | Next.js (auto-detected)                                           |
| Node.js version         | 22.x (matches `.nvmrc` / `engines`)                               |
| Install / build command | `npm ci` / `npm run build` (defaults)                             |
| Output                  | Static prerendered routes (`/`, `/brands`, `/affiliate-networks`) |
| `SITE_ENV`              | `staging` (Preview **and** the staging branch)                    |
| `SITE_URL`              | the staging origin, e.g. `https://affnook-homepage.vercel.app`    |
| Secrets                 | none required — the site has no API keys or integrations          |

`SITE_ENV=staging` keeps every page `noindex` (robots meta, `robots.txt` and an
`X-Robots-Tag` header). Never set `SITE_ENV=production` on staging.

## 3. Verify after the first deploy

- [ ] `curl -I <url>` shows `x-robots-tag: noindex, nofollow`; `<url>/robots.txt` disallows all.
- [ ] Canonical and sitemap URLs use the staging origin.
- [ ] Run the browser suite against it:
      `E2E_BASE_URL=<url> CI=1 npx playwright test` (expect the same pass/skip counts as
      [docs/qa.md](qa.md)).
- [ ] Lighthouse (mobile, simulated throttling, 3 runs per route; record the median):
      `npx lighthouse <url>/ --preset=perf --form-factor=mobile` etc., or PageSpeed Insights.
      Targets: Performance ≥ 90; Accessibility, Best Practices, SEO ≥ 95 (SEO is expected to
      be lower on staging because pages are deliberately `noindex`); LCP ≤ 2.5 s; CLS ≤ 0.1.
- [ ] Spot-check Safari (macOS/iOS) and Firefox, which the local suite does not cover.
- [ ] Record results, URL and commit SHA in the evidence log in [docs/qa.md](qa.md).

## 4. Rollback

Vercel keeps every deployment: promote the previous deployment ("Instant Rollback") or
revert the commit and redeploy. Staging has no data or integrations to migrate.

## 5. Out of scope for staging

Production domain cutover, DNS, analytics/consent tooling, forms, newsletter, CRM and lead
APIs — each needs its own requirements and approval.
