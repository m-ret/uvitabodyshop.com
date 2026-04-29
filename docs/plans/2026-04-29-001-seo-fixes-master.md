---
title: "SEO Fixes — Master Orchestrator"
type: refactor
status: active
date: 2026-04-29
origin: 2026-04-29 multi-agent SEO audit
---

# SEO Fixes — Master Orchestrator

> **For agentic workers:** Each sub-plan can be executed by a dedicated session. This master file is the index — read it first, then descend into the relevant sub-plan.

## Goal

Resolve every finding from the 2026-04-29 multi-agent SEO audit (10 specialized auditors covering crawlability, hreflang, schema, on-page, local SEO, performance, internal links, content quality, URL hygiene). The audit identified ~50 issues across 38 indexable URLs (`es` default + `en /en/...`).

## Architecture

Five themed sub-plans, sequenced. Each is a self-contained PR with its own branch, verification suite, and acceptance gate. One commit per task within a plan; one merge per plan into `main`.

```
Plan A (metadata + titles)
   └─→ Plan B (schema enrichment)
         └─→ Plan C (on-page content)         } can parallelize after Plan B merges
         └─→ Plan D (internal links + privacy)} 
               └─→ Plan E (performance + cleanup)
```

Execution can be sequential (recommended for solo work) or parallel-after-A (for multiple sessions). Plans B and beyond depend on Plan A's `pathnameWithLocale` fix, which is a single-file change; once it's merged, the rest can run in any order.

## Tech stack

- Next.js 15 App Router
- next-intl 3.x (`localePrefix: 'as-needed'`, defaultLocale `es`, locales `['es','en']`)
- Tailwind CSS v4
- Playwright e2e (existing `tests/e2e/page-chrome-hierarchy.spec.ts` is the regression guard)
- ImageMagick for AVIF re-encoding (Plan E)

## Sub-plan index

| # | Plan | Owner branch | Audit findings resolved |
|---|---|---|---|
| 002 | [Plan A — Metadata + titles](./2026-04-29-002-seo-metadata-and-titles.md) | `seo/02-metadata-titles` | C1, C2, C3, C5, C8, C10 + 14 stub-desc Mediums |
| 003 | [Plan B — Schema enrichment](./2026-04-29-003-seo-schema-enrichment.md) | `seo/03-schema` | C4, C6 + 6 High schema items + areaServed cleanup |
| 004 | [Plan C — On-page content](./2026-04-29-004-seo-onpage-content.md) | `seo/04-content` | thin zones, generic service H1/H2, FAQ summary-only, AI patterns, EN translation parity, PPG removal |
| 005 | [Plan D — Internal links + privacy](./2026-04-29-005-seo-internal-links-and-privacy.md) | `seo/05-links-privacy` | C7 (privacy page), home → service tiles, service↔guide↔zone cross-links, footer NAP, generic anchors |
| 006 | [Plan E — Performance + cleanup](./2026-04-29-006-seo-performance-and-cleanup.md) | `seo/06-perf-cleanup` | C9 (LCP), not-found dedup, dateModified + bylines, dead asset removal, host directive, aria |

## Cross-plan invariants

These rules apply to every sub-plan. Violating any of them is a review-blocker.

1. **Use existing `buildPageMetadata` helper** (`src/lib/metadata.ts`) — never bypass it; never hardcode canonical or alternates.
2. **Use existing `Link` from `@/i18n/navigation`** for internal links — preserves locale prefix automatically.
3. **`business` object in `src/data/business.ts` is the single source of truth for NAP, services, zones, guides, hours**. Never hardcode phone, address, or hours in components.
4. **New JSON-LD graphs go through new builders in `src/lib/schema.ts`** — never inline JSON.stringify in page components.
5. **All user-facing copy lives in `messages/{es,en}/*.json`** — never hardcode strings in TSX.
6. **Run `pnpm typecheck` and `pnpm lint` before every commit.** Both must be clean (the one pre-existing `_og-image.tsx` `<img>` warning is acceptable; no new warnings).

## Branch & commit conventions

- One feature branch per plan, named per the index above.
- Conventional commits: `type(scope): description` — e.g. `fix(metadata): strip trailing slash from EN home canonical`.
- Commit per logical task within a plan (10-20 commits per plan is normal).
- Co-Authored-By footer per project CLAUDE.md.
- PR title: `seo: <plan-letter> — <one-line summary>`.
- PR body: paste the verification snippets and their actual outputs.

## Acceptance gate (per plan, before merge)

Each plan's PR must pass:

```bash
pnpm typecheck        # exits 0
pnpm lint             # only the pre-existing _og-image warning
pnpm exec playwright test   # all e2e green
```

Plus the curl-based verification snippets defined in that plan's `Verification` section, with outputs pasted into the PR description.

## Cross-plan acceptance (only after all 5 PRs merged)

1. Sitemap valid: `curl -s https://uvitabodyshop.com/sitemap.xml | xmllint --noout -` exits 0.
2. Google Rich Results Test on 5 sample URLs (manual): home, `/servicios/enderezado`, `/guias/cuanto-cuesta-...`, `/preguntas-frecuentes`, `/zonas/uvita`. Each must produce zero errors and the expected schema types.
3. Manual SERP preview on staging URL.
4. PageSpeed Insights LCP on `/servicios/enderezado` < 2.5s.

## Out of scope (deliberately deferred)

| Item | Reason |
|---|---|
| English-language slug variants for guides (`/en/how-much-does-painting-cost-...`) | Affects routing config + hreflang clusters; needs separate brainstorm. |
| Hash-fragment migration for `/contacto?servicio=...` | Requires Quote-form component refactor outside SEO scope. |
| Lowercase-redirect middleware enhancement | Defer until first incident; current 404 on uppercase is acceptable. |
| Google Business Profile creation | Outside repo. Plan B populates `sameAs` once GBP URL is known. |
| Image-CDN migration | Outside repo. Plan E does in-repo re-encoding only. |
| New automated test files (Playwright or Vitest) | User chose curl-only verification. Existing `page-chrome-hierarchy.spec.ts` is the only e2e guard. |

## Rollback plan

Each plan is its own PR, so rollback is one revert per plan:

```bash
git revert -m 1 <merge-commit-sha>
git push origin main
```

Plans depend in order on `pathnameWithLocale` (from Plan A); reverting A would require re-doing later URL-shape fixes manually. Plans B-E are mostly independent of each other once A is in.

## Verification (master)

After every sub-plan is merged, run from the repo root:

```bash
pnpm dev   # in another terminal
curl -sI http://localhost:3000/en           # expect 200, no redirect
curl -s http://localhost:3000/sitemap.xml | head -10      # expect <urlset xmlns:xhtml=...>
curl -s http://localhost:3000/en | grep -E '(canonical|alternate)' | head -10
curl -s http://localhost:3000/zonas/uvita | grep -c 'application/ld+json'   # expect ≥2
curl -sI http://localhost:3000/privacidad   # expect 200
curl -sI http://localhost:3000/en/privacidad   # expect 200
ls -la public/images/services/enderezado.avif   # expect ≤350KB
test ! -f public/images/craft.avif && echo OK   # expect OK
pnpm typecheck && pnpm lint && pnpm exec playwright test
```

All green = audit closed.
