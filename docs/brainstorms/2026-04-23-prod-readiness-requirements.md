---
date: 2026-04-23
topic: prod-readiness
---

# Production Readiness — Uvita Body Shop

## Problem Frame

The proposal at `/home/marcelo/Work/proposal-base/uvita-bodyshop/src/app/page.tsx` promises 10 deliverables for ₡447.000 CRC, 4-week timeline. The site at `/home/marcelo/Work/uvitabodyshop.com/` has the agentic scaffolding in place but several proposal commitments are unfulfilled, and several non-proposal items are required for a real launch. This doc collects every gap so planning can execute each one inline with no re-scoping.

**Audience for the site:** Costa Rican residents in Zona Sur (Uvita, Dominical, Ojochal, Bahía Ballena) searching for local auto-body work. Primary language Spanish. Primary contact WhatsApp. Primary conversion event: quote request with photo.

**Client:** Fabricio Ríos Ortiz (owner). 6 years in business, 9 years experience. Paint brands: Roberlo, BESA, 3M, VICCO. No insurance work. All vehicle types.

## Requirements

### Proposal Commitments — unfulfilled

- **R1. Wire the quote form to `/api/quote-request`.** Current form at `HomePage.tsx` line 739 has `onSubmit={(e) => e.preventDefault()}` — it does nothing. Must POST name/phone/service/vehicle/description/optional-photos, validate client-side, show submitting/success/error states, and deep-link the user to WhatsApp with the pre-filled message returned by the API (`contactUrl`). File upload (photos) can be phase 2 if it needs storage; for now accept photo URL strings or skip.
- **R2. Full Spanish content pass.** `src/data/content.ts` is in English. Rewrite all user-facing copy to Spanish for the Costa Rican audience: services, process steps, headline, subhead, CTAs, form labels, error messages. Use the `copywriting` and `marketing-psychology` skills (to install) to avoid AI-slop phrasing. Keep short English labels (mono tickers like "MADE IN COSTA RICA") where DESIGN.md permits.
- **R3. Real photography.** `content.ts` currently uses Unsplash/Freepik placeholder URLs. Client has a logo (per intake form) and Facebook/Instagram. Before launch the services section must show actual Uvita Body Shop work. Until photos arrive, add a `// TODO: photo` marker and keep placeholders — but make swap a single-edit-per-service operation via `business.ts`.

### Critical Non-Proposal Gaps

- **R4. `/og.jpg` social preview.** Referenced in `layout.tsx` metadata and JSON-LD. File doesn't exist → broken previews on every share. Generate a 1200×630 image using the DESIGN.md palette (canvas `#050505`, red `#cc0000`, Bebas Neue display).
- **R5. Favicon + logo.** Next.js default `favicon.ico` still in place. Client has a logo per intake form; until provided, create a monogram favicon (`U` in Bebas Neue on `#cc0000` square) and a wordmark SVG for the nav bar.
- **R6. Single source of truth.** `HomePage.tsx` reads `contactInfo` from `content.ts`, while `business.ts` is the canonical structured-data source. Consolidate: either have `business.ts` re-export the display-facing bits, or have `HomePage.tsx` pull `contact`, `hours`, etc. from `business.ts`. Eliminate drift.
- **R7. Fix 19 pre-existing lint errors.** React 19 compiler rules: `Math.random()` in render (use `useMemo` seed or `useRef` or initialize in `useEffect`) in `CarPaintScene`, `SprayParticleScene`. `camera` mutation from `useThree` (use `useFrame` or imperative handle instead). Unblock `npm run verify` and CI.
- **R8. `not-found.tsx` and `error.tsx`.** Custom 404 and error boundary pages matching DESIGN.md tone.

### Performance and Reliability

- **R9. Core Web Vitals budgets met.** LCP < 2.5s, CLS < 0.1, INP < 200ms on slow-3G throttled localhost run. Landing route JS < 250KB gzip. Use the `core-web-vitals` and `fixing-motion-performance` skills. Measure, don't guess.
- **R10. 3D scene optimization.** R3F scenes must dynamic-import with `ssr: false`, show a lightweight static poster on mobile (already dynamic but no mobile fallback strategy confirmed). Triangle count budget < 100k. Preload critical assets.
- **R11. Image optimization.** All hero and service photos served via `next/image` with `priority` on LCP image and explicit `sizes`. Convert stock JPGs to AVIF/WebP at build time or at the CDN.
- **R12. `prefers-reduced-motion` fallback.** Every GSAP timeline and 3D scene must no-op or degrade when the user prefers reduced motion (DESIGN.md §8).

### Local SEO and Credibility

- **R13. Google Business Profile alignment.** The intake form confirms the client already has a Google Business listing. The site's NAP (Name/Address/Phone) must match GBP exactly. Citations: WhatsApp `+5068769927`, hours `Mon–Sat 8:00–17:00 CST`, locality `Uvita, Puntarenas`. Verified via JSON-LD AutoBodyShop schema (already shipped).
- **R14. Map / location.** Static map embed or Mapbox/Google Maps link in the contact section so users can navigate. Address string from `business.ts`.
- **R15. Hours indicator.** Client-side "Abierto ahora / Cerrado" badge driven by `business.ts` hours + `Intl.DateTimeFormat('es-CR', { timeZone: 'America/Costa_Rica' })`. Small but high-credibility detail.
- **R16. Social links in footer.** Facebook + Instagram (client confirmed they exist; URLs to be provided). Add to `business.ts.sameAs` so they appear in JSON-LD and the footer.
- **R17. Testimonials or past-work gallery.** Auto-body shops sell on visible proof. Minimum: a "Nuestro Trabajo" grid with 6–12 real before/after images or finished-work shots. Gated on R3 (photography).

### Analytics and Observability

- **R18. Vercel Web Analytics** installed and enabled. Zero-config with `@vercel/analytics/next`. Respect `Do Not Track`.
- **R19. Conversion events.** Track: WhatsApp click, phone click, form submit, form validation error, 3D scene load fail. Names: `contact_whatsapp`, `contact_phone`, `quote_submit`, `quote_error`, `scene_fallback`.
- **R20. Error monitoring** — optional phase 2. Defer unless the client wants paid Sentry.

### Skills and Workflow Gaps

- **R21. Install missing marketing skills project-locally.** Current 43 skills cover tech but not content-craft. Add:
  - `coreyhaines31/marketingskills@copywriting` (76.2K installs)
  - `coreyhaines31/marketingskills@marketing-psychology` (56.1K)
  - `coreyhaines31/marketingskills@social-content` (52.3K) — for IG/FB captions reused from site copy
  - `kostja94/marketing-skills@conversion-optimization` (579) — applied to form R1
  - `jezweb/claude-skills@seo-local-business` OR `calm-north/seojuice-skills@rank-local` — local-business-specific SEO
- **R22. Testing baseline.** One Playwright smoke test per critical path: (a) home renders, (b) form submits and receives `{ok:true,contactUrl}`, (c) WhatsApp CTA link has correct number, (d) `sitemap.xml` and `robots.txt` respond 200. Use the `webapp-testing` skill.

### Deployment and Domain

- **R23. Vercel deploy.** Project linked to Vercel, production domain `uvitabodyshop.com` (registrar TBD), SSL via Vercel. Preview deployments on PR.
- **R24. Environment vars in Vercel.** `NEXT_PUBLIC_SITE_URL=https://uvitabodyshop.com`. Any secrets (none currently) behind Vercel env management.

## Success Criteria

- Quote form successfully posts to `/api/quote-request` and the user lands in WhatsApp with a pre-filled message within 2 seconds of submit.
- All user-facing copy is in Spanish; no English strings except deliberate design-system tickers.
- Lighthouse (mobile, slow-3G) scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 100.
- `npm run verify` passes with zero lint errors.
- JSON-LD validates green in Google's Rich Results Test.
- Site is live at `https://uvitabodyshop.com` with working SSL.
- At least 6 real Uvita Body Shop photos in the services/gallery section (gated on client delivery of assets).
- Vercel Web Analytics dashboard shows at least one recorded `quote_submit` event from a test submission.

## Scope Boundaries

- **Out of scope:** blog, customer login, booking calendar, payment online, multi-language toggle (ES/EN), dark/light mode switch, CMS integration, iOS/Android app.
- **Deferred:** error monitoring (R20), photo upload to storage (R1 phase 2), email notifications, automated SEO content generation.
- **Operational (not code):** domain purchase, hosting subscription, 30-day post-launch support — tracked separately, no repo artifacts.

## Key Decisions

- **Form → WhatsApp handoff** is the primary conversion, not a traditional email/CRM pipeline. Rationale: client's preferred channel is WhatsApp per intake form; no CRM budget; no email address on file.
- **Spanish-primary, no language switcher.** Rationale: 95%+ of the Zona Sur searchable audience queries in Spanish; a switcher adds maintenance and dilutes SEO signal.
- **No insurance messaging anywhere.** Client does not work with insurance (intake form). Previous exploration copy accidentally mentioned "seguros" — audit and remove.
- **Single page, no blog.** Rationale: local-business sites under 10 pages rank on GBP + schema + reviews, not content volume. Revisit only if GBP + SEO plateau.
- **Skills added now, not later.** Rationale: copywriting quality directly affects R2 and the entire content pass. Install before writing.

## Dependencies / Assumptions

- **Client delivers** logo files, 6–12 real work photos, Facebook/Instagram URLs, Google Business listing URL, and confirms the exact business address before R3, R13, R16, R17 can fully complete. Placeholders acceptable in the interim.
- **Registrar + DNS** for `uvitabodyshop.com` is either already owned or included in the ₡447.000 package per proposal. Assumption: we handle this in R23.
- **Tailwind v4 + React 19 + Next.js 16** — bleeding-edge stack. Some lint rules are still stabilizing (R7 concerns). No workaround needed beyond proper fixes.
- **Costa Rica timezone** `America/Costa_Rica` (UTC−6, no DST) for R15.

## Outstanding Questions

### Resolve Before Planning

*(none — scope is fully decided)*

### Deferred to Planning

- [Affects R1] [Technical] Do we support photo upload in v1 (requires a storage adapter — Vercel Blob, S3, or Cloudflare R2) or defer to v2 and only accept photo URLs the user paste-s after WhatsApp handoff?
- [Affects R3, R17] [User decision] Wait for client-supplied photography or commission a photo session as part of the package?
- [Affects R7] [Technical] Seeded-RNG vs `useMemo` with stable deps vs `useRef` pattern for the 3D particle placement — the `r3f-fundamentals` skill likely has the idiomatic answer.
- [Affects R9, R12] [Needs research] Measured baseline for LCP/CLS/INP with current 3D scenes on a mid-range mobile — need to run Lighthouse before deciding if R10 fallback poster is mandatory or optional.
- [Affects R13] [User decision] Exact street address to publish, or keep city-level only for privacy?
- [Affects R23] [User decision] Does the client already own the `uvitabodyshop.com` domain, or do we register?

## Next Steps

→ `/ce:plan` for structured implementation planning.
