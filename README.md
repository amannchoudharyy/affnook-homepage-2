# Affnook homepage

Marketing homepage for [Affnook](https://affnook.com), built with Next.js (App Router), React and
TypeScript. One shared set of page sections is rendered for three audiences:

| Audience            | Route                 |
| ------------------- | --------------------- |
| Operators (default) | `/`                   |
| Brands              | `/brands`             |
| Affiliate networks  | `/affiliate-networks` |

Every route is server-rendered, so all content and the audience switcher work without
JavaScript. Interactivity and motion are added on top as small client components.

## Status

In development for QA/staging; pre-deployment audit completed 2026-10-21 (results in [docs/qa.md](docs/qa.md)). All 14 homepage sections are implemented for all three audiences (Operators, Brands, Affiliate networks): header and navigation, hero with product dashboards, logos + awards, problem, stakes, Turn, Affnook MCP demo, Proof, How it works + capability tabs, Customization, Testimonials, Objections + FAQ, Resources, Final CTA and footer. Forms, newsletter and CRM integrations are deferred to the production phase. Staging deployment steps: [docs/deployment.md](docs/deployment.md). The live per-section status is in
[docs/qa.md](docs/qa.md); see also [docs/architecture.md](docs/architecture.md) and
[docs/decisions.md](docs/decisions.md).

**Not in scope for the current milestone** (planned for the production phase): lead forms,
newsletter subscription, CRM integration and any backend submission logic. CTAs link to existing
affnook.com destinations, which still need owner confirmation (see
[docs/decisions.md](docs/decisions.md)); no form simulates a successful submission.

## Requirements

- Node.js 22.x, 22.13 or newer (`engines` and `.nvmrc` pin the major version)
- npm 10+

## Getting started

```bash
npm ci
cp .env.example .env.local   # optional; defaults are safe for local work
npm run dev                  # http://localhost:3000
```

## Scripts

| Command             | What it does                                                    |
| ------------------- | --------------------------------------------------------------- |
| `npm run dev`       | Local development server                                        |
| `npm run build`     | Production build                                                |
| `npm run start`     | Serve the production build                                      |
| `npm run lint`      | ESLint (Next.js, TypeScript and jsx-a11y rules), zero warnings  |
| `npm run format`    | Format with Prettier (`format:check` verifies only)             |
| `npm run typecheck` | Generate Next.js route types, then `tsc --noEmit`               |
| `npm test`          | Unit and component tests (Vitest + Testing Library)             |
| `npm run test:e2e`  | Browser tests (Playwright + axe); run `npm run build` first     |
| `npm run check`     | format check, lint, typecheck, unit tests and build in sequence |

First-time browser test setup: `npx playwright install chromium`.

To run the browser tests against a deployed URL instead of a local build:
`E2E_BASE_URL=https://<staging-url> npm run test:e2e`.

## Environment variables

See [.env.example](.env.example).

| Variable   | Purpose                                                                      |
| ---------- | ---------------------------------------------------------------------------- |
| `SITE_ENV` | `development` \| `staging` \| `production`                                   |
| `SITE_URL` | Absolute origin for canonical URLs, sitemap and Open Graph (no trailing `/`) |

Search indexing is **opt-in**: pages are indexable only when `SITE_ENV=production` _and_
`SITE_URL` is an `https://` URL that is not a `*.vercel.app` host (a production build without
one fails). Every other deployment (local, Vercel previews, staging) sends
`noindex` via the robots meta tag, `robots.txt` and an `X-Robots-Tag` header. These values are
read at build time.

## Project structure

```
src/
  app/                 Routes (one page.tsx per audience), layout, robots, sitemap
  components/          UI components, grouped by feature
  content/             Typed audience content (the "what"), separate from components
  lib/                 Environment and SEO helpers
  styles/tokens.css    Design tokens from the Figma variables
tests/
  unit/                Vitest tests
  e2e/                 Playwright tests (smoke, no-JS, responsive, accessibility)
docs/                  Architecture, decisions and QA records
```
