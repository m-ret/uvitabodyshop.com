# SEO: FAQ JSON-LD on service pages + embedded lead forms

> **Status:** **Closed** — executing-plans verification 2026-04-24: `npm run build` + `PORT=3017 npm run test:e2e` (12/12). FAQ JSON-LD gated when `faqs.length === 0`. `superpowers:finishing-a-development-branch` not present in repo; substituted with build + e2e + plan checkbox update.

> **For agentic workers:** Execute with checkpoints; steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Emit **FAQPage** structured data on every `/[locale]/servicios/[slug]` page (matching visible FAQs), and embed the existing **QuoteForm** lead capture on high-intent SEO templates (guides, zones, FAQ hub, warranty, about, services index).

**Architecture:** Reuse `buildFaqSchema` from `src/lib/schema.ts` via `PageLayout` `extraJsonLd`. Add a thin server component `LeadCaptureSection` that wraps `QuoteForm` with translated heading copy from `messages/*/pages.json`. Fix `buildArticleSchema` `mainEntityOfPage.@id` to use **locale-aware paths** (`pathnameWithLocale`) so English guide URLs match canonicals.

**Tech Stack:** Next.js App Router, next-intl, existing `QuoteForm` / `PageLayout` / `buildPageMetadata` patterns.

---

### Task A: FAQPage JSON-LD on service detail routes

**Files:**
- Modify: `src/app/[locale]/servicios/[slug]/page.tsx`
- Reference: `src/lib/schema.ts` (`buildFaqSchema`), `src/components/layout/PageLayout.tsx`

- [x] **Step 1:** Import `buildFaqSchema` from `@/lib/schema`.
- [x] **Step 2:** On `PageLayout`, pass `extraJsonLd={faqs.length > 0 ? buildFaqSchema(faqs) : undefined}` (omit empty FAQPage). Keep `ServiceJsonLd` as a sibling `<script>` (unchanged).
- [x] **Step 3:** Run `npm run build` — confirm no TypeScript errors.

---

### Task B: Article schema `@id` matches localized canonical

**Files:**
- Modify: `src/lib/schema.ts` — extend `buildArticleSchema` args with `locale: string`, compute `mainEntityOfPage.@id` with `pathnameWithLocale(locale, `/guias/${slug}`)`.
- Modify: `src/app/[locale]/guias/[slug]/page.tsx` — pass `locale` into JSON-LD builder (`ArticleJsonLd`).

- [x] **Step 1:** Update `buildArticleSchema` signature and `@id` URL construction.
- [x] **Step 2:** Update `ArticleJsonLd` / call site to pass `locale`.
- [x] **Step 3:** `npm run build`.

---

### Task C: Reusable embedded quote block

**Files:**
- Create: `src/components/lead/LeadCaptureSection.tsx`
- Modify: `messages/es/pages.json`, `messages/en/pages.json` — add `LeadCapture` keys (`title`, `description`).

- [x] **Step 1:** Create `LeadCaptureSection` (server component) with `title`, `description`, optional `initialServiceSlug` → `QuoteForm` `initialService`. Section `id="cotizar"`.
- [x] **Step 2:** Add bilingual strings under `LeadCapture` in both `pages.json` files.

---

### Task D: Mount lead section on SEO templates

**Files:**
- Modify: `src/app/[locale]/guias/[slug]/page.tsx` — after main content / before or after existing CTA; `initialService` = first `related` service slug if any, else `''`.
- Modify: `src/app/[locale]/zonas/[zona]/page.tsx` — bottom of main column; `initialService` `''`.
- Modify: `src/app/[locale]/preguntas-frecuentes/page.tsx` — below FAQ list.
- Modify: `src/app/[locale]/garantia/page.tsx` — below last `<section>`.
- Modify: `src/app/[locale]/sobre-nosotros/page.tsx` — below story grid / prose.
- Modify: `src/app/[locale]/servicios/page.tsx` — below main grid (hub intent).

Each page: `getTranslations('LeadCapture')`, render `<LeadCaptureSection ... />`.

- [x] **Step 1:** Wire all pages above.
- [x] **Step 2:** `npm run build` && `npm run test:e2e`.

---

### Task E: Verification

- [x] **Step 1:** `npm run build` succeeds.
- [x] **Step 2:** Manual / Rich Results: prerendered HTML includes `FAQPage` + `Service` + `BreadcrumbList` on service URLs (validate in browser or Rich Results Test when deployed).

---

## Spec coverage

| Requirement | Task |
|-------------|------|
| A — FAQ schema on service URLs | A |
| B — Embedded forms on extra SEO pages | C, D |
| Article URL correctness for i18n | B |

## Related skills

- `schema-markup` — FAQPage accuracy, Rich Results Test.
- `seo-audit` — hub page completeness (context from prior audit).
