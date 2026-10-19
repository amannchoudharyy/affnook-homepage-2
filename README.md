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

In development for QA/staging. Implemented for all three audiences: header and navigation,
hero with the audience-specific product dashboards, logos + awards, problem, stakes, Turn
("Affnook as your guide"), the Affnook MCP assistant demo and footer. Sections 7–13 (Proof, How it
works, Customization, Testimonials, Objections + FAQ, Resources, Final CTA) are in progress. The live per-section status is in
[docs/qa.md](docs/qa.md); see also [docs/architecture.md](docs/architecture.md) and
[docs/decisions.md](docs/decisions.md).

**Not in scope for the current milestone** (planned for the production phase): lead forms,
newsletter subscription, CRM integration and any backend submission logic. CTAs link to approved
existing destinations or are marked as pending; no form simulates a successful submission.

## Requirements

- Node.js 22.13 or newer (`.nvmrc` pins the major version)
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
`SITE_URL` is an `https://` URL. Every other deployment (local, Vercel previews, staging) sends
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
