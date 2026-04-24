---
title: "feat: Locale-aware SEO hardening (metadata, lang, structured data, sitemap)"
type: feat
status: completed
date: 2026-04-24
origin: null
---

# feat: Locale-aware SEO hardening (metadata, lang, structured data, sitemap)

## Overview

Follow-up to a technical SEO review of this repo: the site already has strong foundations (`buildPageMetadata` with canonical + `alternates.languages`, a solid `AutoBodyShop` + `LocalBusiness` JSON-LD graph, `robots.ts` with sitemap + explicit AI crawler allows, and a locale-aware sitemap listing `/` and `/en/...` URLs). The gaps cluster around **the homepage and root shell**, which are still **Spanish-default in metadata and `<html lang>`**, while **`/en` routes** should present **fully English signals** to users, crawlers, and generative engines. This plan scopes work to **close that gap** without rewriting unrelated marketing or design.

## Brainstorm (expanded product / SEO surface)

Use this as the “what else could we do” inventory; **implementation units below are intentionally narrower** so the first ship stays reviewable.

**SERP & social**

- Homepage (`/[locale]` at `/` and `/en`) needs its own `generateMetadata` so title, description, Open Graph `locale`, and Twitter fields match the active locale (today the root `app/layout.tsx` pins Spanish defaults).
- Consider **OG `alternateLocale`** on the homepage metadata when both languages exist, mirroring href intent.
- Optional later: **unique OG images per locale** (same asset is acceptable initially).

**International & HTML**

- `<html lang>` is fixed to `es` in `app/layout.tsx` and corrected only in `DocumentLang` via `useEffect`, so **SSR and non-JS crawlers** can see the wrong language for `/en/*`.
- Preferred directions (pick one during implementation after reading `next-intl` + Next 16 constraints): (a) read **locale from `headers()`** in the root layout if middleware exposes it reliably; (b) **relocate the JSON-LD script** (and optionally other head concerns) into `app/[locale]/layout.tsx` where `locale` is explicit; (c) accept client-only `lang` as a documented limitation **only** if framework constraints block server truth.

**Structured data**

- Global `buildStructuredData()` uses **Spanish-only** `description` and default-locale **service URLs** in `makesOffer` for every page, including `/en`.
- Options: parameterize `buildStructuredData(locale)`; or emit **locale-appropriate `description` / `url` fields** while keeping a single `@id` graph; avoid duplicate conflicting `@id` nodes.
- Longer horizon (out of scope unless pulled in): `WebSite` + `SearchAction`, extra `sameAs`, **GeoCoordinates** if the business agrees to publish coordinates.

**Sitemap & hreflang**

- Today the sitemap emits **separate URL entries per locale** (good for discovery).
- Optional upgrade: **group alternates** using Next’s sitemap `alternates.languages` when supported, so each logical page is explicitly tied across `es`/`en` + `x-default` in the XML (complements, does not replace, `<link rel="alternate">` in HTML).

**Robots & GEO bots**

- Already allows GPTBot, ClaudeBot, PerplexityBot, etc. Optional: add **`ChatGPT-User`** (OpenAI browsing) if policy allows full site fetch.

**On-page consistency**

- Some pages still pass **hardcoded Spanish `keywords`** to `buildPageMetadata` (e.g. contact). Align with locale or drop keywords (Google largely ignores `meta keywords`; low priority).

**Docs & SSOT**

- `AGENTS.md` still says “some English UI labels”; evolving toward **full `next-intl`** should update that line when this work lands to avoid misleading future agents.

## Problem Frame

English routes must not be second-class for **metadata**, **document language**, or **primary structured-data prose**, or the site risks mixed-language SERP snippets, weaker `/en` indexing signals, and avoidable E-E-A-T friction (“English UI, Spanish everything else”). The homepage is the worst offender because it does not use `buildPageMetadata` today.

## Requirements Trace

- **R1.** `/en` homepage (and ideally all `/en/*` entry chrome) exposes **English `<title>`, meta description, and OG/Twitter fields** appropriate to the homepage value proposition.
- **R2.** Document language (`lang`) should **match the active locale on the server-rendered HTML** when technically feasible; if not feasible, the plan documents the constraint and the best available mitigation.
- **R3.** The primary **LocalBusiness / AutoBodyShop JSON-LD** should use **locale-appropriate `description` and service offer URLs** (or a documented, intentional single-language graph) without invalid duplicate `@id` graphs.
- **R4.** Sitemap continues to list all important public URLs; optional improvement adds **explicit locale alternates** per logical page without breaking existing URLs.
- **R5.** Changes are covered by **automated checks** where the stack allows (metadata assertions or e2e), without brittle full-SERP golden tests.

## Scope Boundaries

- **In scope:** Homepage metadata, root vs locale layout concerns for `lang` + JSON-LD placement, `buildStructuredData` locale awareness, sitemap alternates (optional), small keyword cleanups on pages that pass Spanish keywords on `/en`, doc touch to `AGENTS.md` if statements become false.
- **Out of scope (unless explicitly pulled in):** Full rewrite of all `business.ts` strings for EN, new marketing pages, GSC verification, PSI tuning, paid search, backlink work, geo meta tags (`geo.region`), separate OG art per page.

## Context & Research

### Relevant Code and Patterns

- `src/app/layout.tsx` — root metadata defaults, `lang="es"`, global JSON-LD script calling `buildStructuredData()`.
- `src/app/[locale]/layout.tsx` — `NextIntlClientProvider`, `DocumentLang`, no metadata API today.
- `src/app/[locale]/page.tsx` — homepage has **no** `generateMetadata`.
- `src/lib/metadata.ts` — `buildPageMetadata`, `pathnameWithLocale`, `alternates.languages` + `x-default` (good pattern to mirror for homepage).
- `src/data/business.ts` — `buildStructuredData()`, `business.meta` descriptions, service list for `makesOffer`.
- `src/app/sitemap.ts` — `withLocales` helper; extend if adopting sitemap alternates.
- `src/middleware.ts` — `next-intl` middleware; may expose headers useful for root-layout locale detection.
- `messages/en/home.json` / `messages/es/home.json` — already hold hero copy suitable for meta snippets.

### Institutional Learnings

- No `docs/solutions/` hit for this specific topic in-session; treat prior audit notes in chat as informal input only.

### External References

- Next.js `Metadata` / `generateMetadata` and `MetadataRoute.Sitemap` alternates: official Next.js docs for the installed major version.
- `next-intl` App Router guidance for **locale on layout** and any recommended **`html lang`** pattern.

## Key Technical Decisions

- **D1 — Homepage metadata source:** Use `getTranslations` + strings keyed under an existing or new namespace (e.g. extend `Home` in `messages/*/home.json` with `metaTitle` / `metaDesc`, or a tiny `HomeMeta` section) and feed `buildPageMetadata({ locale, pathname: '/', ... })` from `src/app/[locale]/page.tsx`’s `generateMetadata`. **Rationale:** Keeps copy in the same system as the rest of the site and preserves canonical/hreflang behavior already implemented in `buildPageMetadata`.

- **D2 — Where JSON-LD should run:** Prefer moving or splitting structured-data emission so the **active locale is known at render time**, likely `src/app/[locale]/layout.tsx`, instead of only the root layout. **Rationale:** Root layout does not receive `[locale]` params; `buildStructuredData` needs locale to localize description and offer URLs.

- **D3 — Sitemap alternates:** Treat as **optional follow-on** inside the same PR only if low-risk; otherwise a second unit. **Rationale:** Improves international clustering but must not regress sitemap validity.

## Open Questions

### Resolved During Planning

- **Should this plan include geo `<meta name="geo.*">` tags?** **No** — low marginal value vs GBP + JSON-LD; defer unless product asks.

### Deferred to Implementation

- **Exact mechanism for server-correct `html lang`:** Depends on Next 16 + `next-intl` capabilities; implementer verifies whether `headers()`/`cookies()` in root layout is sufficient or whether JSON-LD move unblocks a simpler `lang` strategy.

## Implementation Units

- [x] **Unit 1: Homepage `generateMetadata` (locale-correct SERP + OG)**

**Goal:** `/` and `/en` homepages emit distinct, correct titles and descriptions and reuse canonical + hreflang alternates.

**Requirements:** R1, R5

**Dependencies:** None

**Files:**

- Modify: `src/app/[locale]/page.tsx` (add `generateMetadata`)
- Modify: `messages/es/home.json`, `messages/en/home.json` (add meta strings) *or* a dedicated small namespace—choose one pattern and stick to it
- Test: extend `tests/e2e/home.spec.ts` **or** add `tests/e2e/home-metadata.spec.ts` if separation is cleaner

**Approach:**

- Mirror `generateMetadata` patterns from `src/app/[locale]/contacto/page.tsx` and `buildPageMetadata` usage.
- Keep pathname as `/` for both locales; rely on `pathnameWithLocale` inside `buildPageMetadata`.

**Test scenarios:**

- Happy path: Request metadata for `locale=es` and `locale=en` (via Playwright `page.goto('/en')` + `expect(page).toHaveTitle(...)` or document title assertion with distinct substrings).
- Edge case: Default locale still at `/` (no `/es` prefix) — title must remain correct (assert `/` Spanish title vs `/en` English title).

**Verification:** `npm run build` passes; new/updated e2e passes; manual View Source on `/` and `/en` shows matching `<title>` and `meta name="description"` per language.

---

- [x] **Unit 2: Server-true `html lang` (or documented mitigation)**

**Goal:** Reduce or eliminate SSR `lang` mismatch for English routes.

**Requirements:** R2

**Dependencies:** Unit 1 optional but can land in parallel if files do not conflict

**Files:**

- Modify: `src/app/layout.tsx`, possibly `src/app/[locale]/layout.tsx`, possibly `src/middleware.ts`, `src/components/ui/DocumentLang.tsx`

**Approach:**

- Investigate `next-intl` + Next 16 recommended pattern first.
- Prefer server-driven `lang` over `useEffect`-only updates when possible without breaking the root layout contract.

**Test scenarios:**

- Happy path: `/en/contacto` (or `/en`) HTML source contains `lang="en"` **before** client hydration (Playwright `page.content()` immediately after navigation, or equivalent).
- Edge case: `/` uses `lang="es"`.

**Verification:** Document in PR description if a hard constraint forces partial mitigation; automated assertion where feasible.

---

- [x] **Unit 3: Locale-aware primary JSON-LD (`buildStructuredData`)**

**Goal:** LocalBusiness graph description (and offer URLs if low-effort) respect locale without duplicate conflicting graphs.

**Requirements:** R3

**Dependencies:** Unit 2 if JSON-LD moves to `[locale]/layout.tsx`; otherwise coordinate with Unit 2 to avoid double scripts

**Files:**

- Modify: `src/data/business.ts` (`buildStructuredData` signature + internals)
- Modify: `src/app/layout.tsx` and/or `src/app/[locale]/layout.tsx` (where the script tag lives)
- Test: add a lightweight test only if the repo already has a pattern for server module tests; otherwise e2e **View Source** substring check for English description on `/en` (careful: brittle—prefer asserting absence of a known Spanish-only phrase if that is more stable)

**Approach:**

- Add `locale: 'es' | 'en'` (or `string` constrained at call sites) to `buildStructuredData`.
- Source localized description from `business.meta` (add `descriptionEn` if missing) or reuse existing English marketing strings consistently.
- Ensure `@id` `${siteUrl}#business` remains stable.

**Test scenarios:**

- Happy path: `/en` HTML includes JSON-LD with English description text.
- Integration: Service offer URLs in JSON-LD resolve to canonical localized paths (`/en/servicios/...` when `locale=en`).

**Verification:** Rich Results Test spot-check on staging/prod URL post-deploy (manual, noted in PR); local build passes.

---

- [x] **Unit 4 (optional): Sitemap `alternates.languages` per logical URL**

**Goal:** Strengthen hreflang clustering in XML without breaking current URL list.

**Requirements:** R4

**Dependencies:** Units 1–3 stable

**Files:**

- Modify: `src/app/sitemap.ts`
- Test: if no sitemap tests exist, add a small node test **or** document manual verification checklist only when framework makes automated checks painful

**Approach:**

- Consult Next 16 `MetadataRoute.Sitemap` typing for `alternates`.
- Each **logical** page should map `es` + `en` + `x-default` URLs consistently with `buildPageMetadata`.

**Test scenarios:**

- Happy path: sitemap XML contains alternate entries for at least homepage and one inner route.
- Edge case: `x-default` matches default locale URL shape (`/` vs `/es`).

**Verification:** `curl` local `/sitemap.xml` sanity check during dev; `npm run build`.

---

- [x] **Unit 5: Keyword / metadata hygiene on inner pages (small)**

**Goal:** Remove obviously wrong-language `keywords` arrays passed to `buildPageMetadata` on `/en`.

**Requirements:** R5 (lightweight)

**Dependencies:** None (can parallelize)

**Files:**

- Modify: e.g. `src/app/[locale]/contacto/page.tsx` (and any other grep hits for Spanish-only keywords with `buildPageMetadata`)

**Approach:**

- Either localize keywords via messages or **drop** `keywords` to fall back to `business.meta.keywords` until a proper keyword strategy exists.

**Test scenarios:**

- Happy path: `/en/contacto` metadata does not inject Spanish-only keyword strings when viewed in source.

**Verification:** Grep + build.

---

- [x] **Unit 6: Documentation touch**

**Goal:** Keep agent guidance accurate.

**Requirements:** (supporting)

**Dependencies:** After substantive i18n/SEO behavior lands

**Files:**

- Modify: `AGENTS.md` (language / SSOT description lines)

**Test scenarios:**

- Test expectation: none — documentation-only.

**Verification:** Human review.

## System-Wide Impact

- **Interaction graph:** Root layout → all routes; `[locale]` layout → all localized pages; middleware affects both.
- **Unchanged invariants:** Phone numbers, hours, and factual NAP in `business.ts` remain SSOT per `AGENTS.md`; do not fork into messages without an explicit product decision.

## Risks & Dependencies

| Risk | Mitigation |
|------|------------|
| Moving JSON-LD or `lang` breaks edge routes (OG image routes, etc.) | Touch minimal surface; run full `npm run build` and smoke `opengraph-image` |
| Duplicate JSON-LD graphs if both layouts emit scripts | Grep for `application/ld+json`; ensure single primary graph |
| Over-long English meta pulled from hero copy | Write dedicated shorter `metaDesc` strings |

## Documentation / Operational Notes

- PR should mention **manual** Rich Results Test / GSC URL inspection for `/` and `/en` after deploy.

## Sources & References

- **Origin document:** none (informal audit in conversation + repo inspection).
- Related code: `src/app/layout.tsx`, `src/lib/metadata.ts`, `src/data/business.ts`, `src/app/sitemap.ts`, `src/app/[locale]/page.tsx`.

---

## Confidence check (Phase 5.3 — auto)

**Strengthening:** None required for a Standard plan of this size; local patterns (`buildPageMetadata`, `getTranslations`) are already established in sibling routes.

**Note:** `document-review` skill was not invoked as a separate subagent in this environment; treat this plan as **implementation-ready** but subject to normal human PR review.
