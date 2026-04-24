---
title: "Handoff — Growth-readiness execution (Phases 1–4)"
date: 2026-04-23
plan: docs/plans/2026-04-23-002-feat-growth-readiness-plan.md
branch: feat/prod-readiness
status: in-progress
---

# Handoff — Growth-readiness execution

Pick up from this doc in the next session. Everything below is current as
of the handoff timestamp above.

## Session context

User asked to execute `docs/plans/2026-04-23-002-feat-growth-readiness-plan.md`
(28 units, 6 phases) with emphasis on:

- SEO
- Copywriting (Spanish, Costa Rican audience, Zona Sur)
- Send lead email to Fabricio via **UnoSend** (user's vendor choice —
  NOT Resend, which is what the plan document says)
- Sticky WhatsApp bubble, bottom-right
- Design consistency with `DESIGN.md` (Industrial Red direction)
- "Hardcore" blog-like keyword landing pages beyond what the plan
  originally scopes

## Decisions locked in this session

1. **Scope for this session: Phases 1–4 only (Units U1–U20).** Pixels,
   GTM, CAPI, Sentry and rate-limiting (Phases 5–6) are deferred. Plan
   calls Phase 5 "ship disabled by default" — we are not touching it.
2. **Email vendor: UnoSend**, not Resend. When the session started I
   asked for clarification. User confirmed UnoSend. Swap the plan's
   Resend references mentally when executing U1.
3. **Credentials are "technicalities" — build everything env-gated.**
   User explicitly said: "complete 100% the website with the SEO and
   copywriting, all the new pages, some kinda of blogs-pages-like for
   keywords, seo hardcore, etc... when we are 100% done with the
   website, we think on unosend api key, etc."
   Translation: every integration must ship safely with no key and
   activate when the env var is set.
4. **Bonus scope: keyword landing pages.** User asked for "blogs-pages-like
   for keywords, seo hardcore." Added Task #20. Plan for two new
   dynamic routes:
   - `/zonas/[zona]` — one landing per served locality (Uvita,
     Dominical, Ojochal, Bahía Ballena). Data already seeded in
     `business.zones`.
   - `/guias/[slug]` — editorial guides for long-tail queries.
     Data already seeded in `business.guides` (4 guides).

## Reference files to read first in the next session

Read these in order before writing code:

1. `docs/plans/2026-04-23-002-feat-growth-readiness-plan.md` — the plan.
2. `AGENTS.md` — repo conventions, golden rules, "what not to do."
3. `DESIGN.md` — Industrial Red design system. Every new page must
   obey section 3 (typography), section 5 (spacing), section 7
   (constraints — zero border-radius, hairlines only).
4. `src/data/business.ts` — SSOT, now extended with story, guarantee,
   rating, per-service detail, testimonials, gallery, zones, guides.
   All new pages read from this file.
5. `src/lib/metadata.ts` — `buildPageMetadata()` helper. Every new
   page uses this; do not hand-roll `Metadata` objects.
6. `src/lib/schema.ts` — JSON-LD helpers. `jsonLd()` produces the
   `dangerouslySetInnerHTML` payload; don't re-stringify inline.
7. `src/components/home/HomePage.tsx` — reference for typography
   rhythm, section padding, GSAP reveal usage.
8. `src/components/home/QuoteForm.tsx` — reused as-is on `/contacto`;
   do not fork.
9. `public/.well-known/openapi.yaml` — frozen contract. Any
   `/api/quote-request` payload change updates this file first.

## Work completed in this session

### Business SSOT extension — `src/data/business.ts`

Complete rewrite. The file is now the single source for every new page.
New exported surface:

- `Testimonial` interface (unchanged)
- `GalleryItem` interface — added optional `placeholder?: boolean` and
  `service?: string`
- `ServiceFaq`, `ServiceProcessStep`, `ServiceEntry` interfaces
- `business.contact.leadEmail` — new field, `fabricio@uvitabodyshop.com`
- `business.rating: { value: 4.3, count: 6, url }` — GBP pulled
  manually, will feed `aggregateRating` in JSON-LD
- `business.story` — eyebrow, title, lede, 4 paragraphs in Fabricio's
  voice. Powers `/sobre-nosotros`.
- `business.guarantee` — eyebrow, title, summary, terms, limitations,
  claimProcess. Powers `/garantia`.
- `business.services[i]` — each entry now has `longDescription`, `image`,
  `alt`, `included[]`, `process[]`, `priceGuidance`, `faqs[]`,
  `meta { title, description, keywords[] }`. 5 services, all written.
- `business.testimonials` — seeded with 4 reviews paraphrased from GBP
  (`María P.`, `Luis A.`, `Carolina V.`, `Diego S.`). Enough to trigger
  the `length >= 3` gate in U20.
- `business.gallery` — 6 tiles, all flagged `placeholder: true`, using
  existing AVIFs. UI must hide the placeholder ribbon in production.
- `business.zones` — 4 zones (Uvita, Dominical, Ojochal, Bahía Ballena)
  for the `/zonas/[zona]` SEO landing pages.
- `business.guides` — 4 editorial guides with `sections[]` and
  `keywords[]` for `/guias/[slug]`:
    1. `cuanto-cuesta-pintar-un-carro-en-costa-rica`
    2. `enderezado-de-chasis-cuando-es-necesario`
    3. `como-saber-si-tu-pintura-necesita-retoque-o-repinte`
    4. `pintura-automotriz-en-clima-costero`
- `buildStructuredData()` — now conditionally emits `aggregateRating`
  (when `rating.count > 0`) and `review[]` (when testimonials exist).
  Each `makesOffer` now has `url` pointing to `/servicios/[slug]`.

### Metadata helper — `src/lib/metadata.ts` (new)

`buildPageMetadata({ title, description, canonical, ogImage?, keywords?, index? })`.
Returns a complete Next `Metadata` object with canonical, OG, Twitter,
robots. Root `layout.tsx` template `%s · Uvita Body Shop` applies
automatically when `title` is a plain string.

### Schema helpers — `src/lib/schema.ts` (new)

Pure functions:
- `buildBreadcrumbSchema(trail: BreadcrumbNode[])`
- `buildServiceSchema(service: ServiceEntry)` — emits provider +
  areaServed + offers
- `buildFaqSchema(faqs: FaqEntry[])`
- `buildReviewSchema(testimonial)`
- `buildArticleSchema({ slug, title, description, image, datePublished })`
  — for `/guias/[slug]`
- `jsonLd(data)` — returns `{ __html: string }` for
  `dangerouslySetInnerHTML`

## Work in progress when handoff was requested

Was about to write `src/data/faqs.ts` — the 12 global FAQs for
`/preguntas-frecuentes` (U11). Not started. Pick up from there.

## Remaining work (task list state)

Tasks are tracked via the Task harness — call `TaskList` in the next
session to get live state. As of handoff the open work is:

### Foundation (do next, blocks downstream pages)
- **U6** · PageLayout + Breadcrumb + PageHero components
- `src/data/faqs.ts` · 12 global FAQs, Spanish (referenced by U11)

### Phase A — lead plumbing
- **U1** · UnoSend email adapter (`src/lib/email.ts`) + HTML/text
  template (`src/lib/email-template.ts`). Edge-compatible via `fetch`.
  Hooks into `/api/quote-request` route. Silent no-op without
  `UNOSEND_API_KEY`. Requires adding env vars to `.env.example`.
- **U2** · Google Sheet webhook logger (`src/lib/sheet.ts`) + ops doc
  at `docs/ops/google-sheet-webhook.md`.
- **U4** · UTM capture (cookie `ubs_utm`, 90-day TTL) + API inline
  into WA message. Needs `openapi.yaml` update (add `utm` object).
- **U5** · Sticky WhatsApp FAB (`src/components/ui/StickyWhatsappFab.tsx`),
  `lg:hidden`, 56px, red accent, `aria-label`, respect reduced motion.

### Phase B — new pages (all use `PageLayout` + `buildPageMetadata`)
- **U7** · `/sobre-nosotros` (copy already in `business.story`)
- **U8** · `/contacto` (reuse `QuoteForm` as-is; add map + contact panel)
- **U9** · `/servicios` index (grid over `business.services`)
- **U10** · `/servicios/[slug]` — `generateStaticParams` over 5 slugs,
  emit `buildServiceSchema` per page. Invalid slug → `notFound()`.
- **U11** · `/preguntas-frecuentes` — needs `src/data/faqs.ts` first,
  then accessible `<details>/<summary>` accordion, emit `buildFaqSchema`.
- **U12** · `/garantia` (copy already in `business.guarantee`)

### Phase C — SEO
- **U13** · Expand `src/app/sitemap.ts` to enumerate every new route
  (9 deep routes + 4 zone pages + 4 guide pages = 17 URLs). Priorities
  per plan.
- **U14** · (done — `src/lib/metadata.ts`)
- **U15** · Wire per-page JSON-LD using the helpers already written
  in `src/lib/schema.ts`. Inject into PageLayout (breadcrumb) and
  specific pages (service, FAQ, article).
- **U16** · `RatingBar` component. 4.3★ + 6 reseñas + link-out to GBP.

### Phase D — conversion depth
- **U17/U18** · (data seeded — UI consumption still pending)
- **U19** · Hero `TrustBar` on home: 4 cells `9 años · Cabina
  infrarroja · Garantía escrita · 4.3★ Google`. Insert above or
  below the hero headline; respect DESIGN.md §3 mono eyebrow.
- **U20** · `TestimonialsSection` on home — grid of review cards,
  gate on `business.testimonials.length >= 3`, GSAP `.to()` reveal
  (never `.from()` per memory rule).

### Bonus — hardcore SEO (user-requested)
- `/zonas/[zona]` dynamic route (4 pages). `generateStaticParams` over
  `business.zones`. Each page gets its own `buildPageMetadata` and
  local-intent Spanish copy. Internal links to 2–3 service pages.
- `/guias/[slug]` dynamic route (4 guides). `generateStaticParams`
  over `business.guides`. Emit `buildArticleSchema`. Editorial layout:
  hero, table of contents, sections, related services, CTA.

### Integration / navigation
- Update `src/components/ui/Navigation.tsx` so nav links on deep
  routes point to `/#services`, `/#contact`, etc. instead of the raw
  `#services` anchors. Add links to new pages
  (Servicios, Sobre nosotros, Contacto, Garantía, FAQ).
- Update `src/components/ui/SiteFooter.tsx` to surface link list for
  new pages + zones + guides (footer SEO juice).

### Verification
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run dev` → walk every new route, confirm no hydration errors,
  confirm FAB on mobile viewport, confirm JSON-LD parses via
  `https://search.google.com/test/rich-results` spot-check on the
  detail pages and `/preguntas-frecuentes`.

## File change log this session

Modified:
- `src/data/business.ts` — major extension (SSOT for all new pages)

Created:
- `src/lib/metadata.ts`
- `src/lib/schema.ts`
- `docs/handoffs/2026-04-23-growth-readiness-handoff.md` (this file)

Unmodified but note:
- Plan document is untouched (`docs/plans/2026-04-23-002-feat-growth-readiness-plan.md`).
  All "[ ]" checkboxes still empty — update them as units land if
  that's the project's convention.

## Key constraints to not violate

- **Spanish-first.** Every user-facing string. English only for
  technical labels / marquee tickers.
- **No border-radius** on cards/buttons/inputs (DESIGN.md §7).
- **GSAP reveal pattern** — CSS initial `opacity-0` + `gsap.to()`.
  Never `gsap.from()` for ScrollTrigger opacity reveals (project
  memory rule).
- **SSOT** — any phone/hours/address/service name must come from
  `business.ts`. No hardcoded literals.
- **Edge runtime compatibility** — `/api/quote-request` is edge.
  UnoSend adapter must use plain `fetch`, no Node-only deps.
- **No AI slop** — every Spanish line must earn its place. No
  "Welcome to our website" / "Your trusted partner" generics.
- **Stealth-mode is NOT applicable here** — this is a personal
  repo, normal commits with `Co-Authored-By: Claude` trailer are
  expected (see global CLAUDE.md).
- **Use the `github-personal` SSH host** on push
  (`git@github-personal:m-ret/uvitabodyshop.com.git`). UMG key must
  not route personal pushes (project memory rule).

## Skills to load for the remaining work

Per AGENTS.md, consult before touching the relevant domain:

- `frontend-design` + `tailwind-design-system` — every new page
- `nextjs-app-router-patterns` — dynamic routes, `generateStaticParams`,
  `generateMetadata`
- `gsap-scrolltrigger` + `gsap-performance` — any scroll reveal
- `accessibility` — before declaring any page done
- `schema-markup` + `seo-audit` — U13, U14 (done), U15, bonus
- `copywriting` — tone pass before shipping

## One-paragraph summary for the next agent

The plan's ground truth is in `business.ts` now — everything in Phases
2–4 is essentially reading from that file and rendering Spanish pages
that match `DESIGN.md`. Phase 1 (U1 email, U4 UTM, U5 FAB) is parallel
work; the email adapter uses UnoSend (not Resend) and must degrade
gracefully without a key. The user wants the website "100% done" before
wiring credentials, so prioritize pages and SEO output over
integration plumbing. Two bonus dynamic routes (`/zonas/[zona]`,
`/guias/[slug]`) exist in data and need UI. Verify with
`lint && typecheck && build && dev walkthrough` before declaring done.
