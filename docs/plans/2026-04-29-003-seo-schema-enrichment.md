---
title: "Plan B — SEO Schema Enrichment"
type: refactor
status: ready
date: 2026-04-29
parent: ./2026-04-29-001-seo-fixes-master.md
branch: seo/03-schema
depends_on: ./2026-04-29-002-seo-metadata-and-titles.md
---

# Plan B — Schema enrichment

> Read the [master plan](./2026-04-29-001-seo-fixes-master.md) first. Plan A must be merged before starting this one.

**Goal:** Make every JSON-LD graph the site emits complete, consistent, and locale-aware so Google's Rich Results Test produces zero errors and unlocks every appropriate snippet (star ratings, sitelinks, article cards, local pack).

**Architecture:** Two new builders (`buildPersonSchema`, `buildWebsiteSchema`) in `src/lib/schema.ts`. Existing `buildArticleSchema` upgraded to `BlogPosting` with `inLanguage` + `dateModified`. `buildServiceSchema` priced. `buildStructuredData` in `business.ts` gets geo, hasMap, sameAs, payment, currency; rating split into `ratingCount` + `reviewCount`. Zone pages emit a per-zone `Service` graph. Home emits `WebSite`.

**Tech stack:** schema.org JSON-LD via Next.js `dangerouslySetInnerHTML` server-render.

**Resolves audit findings:** C4 (reviewCount mismatch), C6 (zone JSON-LD absent), plus High items: Person crew, geo/hasMap/sameAs, BlogPosting, WebSite, BreadcrumbList on home, Service.priceSpecification, areaServed cleanup.

---

## File touch list

| File | Change |
|---|---|
| `src/lib/schema.ts` | Add `buildPersonSchema`, `buildWebsiteSchema`, `buildZoneServiceSchema`. Modify `buildArticleSchema` (BlogPosting + inLanguage + dateModified) and `buildServiceSchema` (priced offer). |
| `src/data/business.ts` | Modify `buildStructuredData`: rating split, geo, hasMap, sameAs, payment, currency. Drop `'Zona Sur'` from `areaServed`. Add `dateModified` to all 4 guides. Update `GuideEntry` interface. Populate `business.socialLinks` with the GBP URL. |
| `src/app/[locale]/zonas/[zona]/page.tsx` | Pass `extraJsonLd: [breadcrumb, zoneService]` to `PageLayout`. |
| `src/app/[locale]/sobre-nosotros/page.tsx` | Emit `Person[]` graph for the 5 crew members. |
| `src/app/[locale]/page.tsx` | Emit `WebSite` schema graph for the home URL via passing JSON-LD into `HomePage` as a slot prop. |
| `src/components/home/HomePage.tsx` | Render a `<script>` slot for WebSite + BreadcrumbList JSON-LD. |
| `src/app/[locale]/guias/[slug]/page.tsx` | Pass `dateModified` + `inLanguage` to `buildArticleSchema`. |

---

## Task 1 — Add `buildPersonSchema` builder

**Files:**
- Modify: `src/lib/schema.ts`

- [ ] **Step 1.1: Append `buildPersonSchema` after `buildArticleSchema`**

```ts
/**
 * schema.org `Person` for a crew member. References the business node
 * via `worksFor` so Google links the person to the LocalBusiness.
 */
export function buildPersonSchema(args: {
  name: string
  /** Site-relative path to the portrait. */
  photo: string
  /** Localized job title (e.g. "Frame & sheet metal"). */
  role: string
  locale?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: args.name,
    image: new URL(args.photo, siteUrl).toString(),
    jobTitle: args.role,
    worksFor: { '@type': 'AutoBodyShop', '@id': `${siteUrl}#business` },
    inLanguage: args.locale ?? 'es',
  }
}
```

- [ ] **Step 1.2: Commit**

```bash
git add src/lib/schema.ts
git commit -m "feat(schema): add buildPersonSchema builder"
```

---

## Task 2 — Wire Person graph into About page

**Files:**
- Modify: `src/app/[locale]/sobre-nosotros/page.tsx`

- [ ] **Step 2.1: Build the Person array and pass it to `PageLayout`**

After the existing `setRequestLocale(locale)` line, build:

```tsx
import { buildPersonSchema } from '@/lib/schema'
import { business } from '@/data/business'
// ... existing imports ...

const teamMembers = (await getTranslations({ locale, namespace: 'Team' })).raw('members') as Record<string, { role: string; bio: string; alt: string }>
const personGraph = business.team.map((m) =>
  buildPersonSchema({
    name: m.name,
    photo: m.photo,
    role: teamMembers[m.slug]?.role ?? '',
    locale,
  })
)
```

Then on the `<PageLayout>` element add `extraJsonLd={personGraph}` (the existing `extraJsonLd` prop already accepts `unknown | unknown[]`).

- [ ] **Step 2.2: Verify**

```bash
curl -s http://localhost:3000/sobre-nosotros | python3 -c "
import sys, re, json
html = sys.stdin.read()
blocks = re.findall(r'<script type=\"application/ld\+json\"[^>]*>(.*?)</script>', html, re.S)
persons = [b for b in blocks if '\"@type\":\"Person\"' in b]
print(f'Person blocks: {len(persons)}')"
```
Expected: `Person blocks: 5`.

- [ ] **Step 2.3: Commit**

```bash
git add src/app/[locale]/sobre-nosotros/page.tsx
git commit -m "feat(about): emit Person JSON-LD for the 5 crew members"
```

---

## Task 3 — Add `buildWebsiteSchema` builder + emit on home

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/home/HomePage.tsx`

- [ ] **Step 3.1: Add the builder**

In `schema.ts`:

```ts
/**
 * schema.org `WebSite` for the home page. Pinned to the LocalBusiness
 * publisher so Google recognizes the site as the business's web presence.
 */
export function buildWebsiteSchema(locale: 'es' | 'en' = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: locale === 'en' ? `${siteUrl}/en` : siteUrl.replace(/\/$/, ''),
    name: business.name,
    inLanguage: locale === 'en' ? 'en' : 'es',
    publisher: { '@type': 'AutoBodyShop', '@id': `${siteUrl}#business` },
  }
}
```

- [ ] **Step 3.2: Pass the graph into `HomePage` from `page.tsx`**

`HomePage` is `'use client'`. Since `<script type="application/ld+json">` can render in client components, pass the serialized JSON as a prop slot:

In `src/app/[locale]/page.tsx`:

```tsx
import HomePage from '@/components/home/HomePage'
import { buildWebsiteSchema, jsonLd } from '@/lib/schema'

export default async function Page({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const homeJsonLd = (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLd(buildWebsiteSchema(locale as 'es' | 'en'))}
    />
  )
  return <HomePage extraJsonLd={homeJsonLd} />
}
```

- [ ] **Step 3.3: Add `extraJsonLd` slot to `HomePage`**

In `src/components/home/HomePage.tsx`, change the props signature to accept `extraJsonLd?: ReactNode` and render it before the navigation:

```tsx
export default function HomePage({ extraJsonLd }: { extraJsonLd?: React.ReactNode } = {}) {
  // ... existing body ...
  return (
    <>
      {extraJsonLd}
      <Navigation />
      {/* ... rest unchanged ... */}
    </>
  )
}
```

- [ ] **Step 3.4: Verify**

```bash
curl -s http://localhost:3000/ | grep -oE '"@type":"WebSite"'
curl -s http://localhost:3000/en | grep -oE '"@type":"WebSite"'
```
Expected: one match per route.

- [ ] **Step 3.5: Commit**

```bash
git add src/lib/schema.ts src/app/[locale]/page.tsx src/components/home/HomePage.tsx
git commit -m "feat(home): emit WebSite JSON-LD with publisher pinned to business"
```

---

## Task 4 — Article → BlogPosting + inLanguage + dateModified

**Files:**
- Modify: `src/lib/schema.ts:143-176`
- Modify: `src/data/business.ts` (`GuideEntry` interface + 4 guide entries)
- Modify: `src/app/[locale]/guias/[slug]/page.tsx`

- [ ] **Step 4.1: Update `GuideEntry`**

In `business.ts`, add to the `GuideEntry` interface (around line 90-105):

```ts
export interface GuideEntry {
  // ... existing fields ...
  /** Last meaningful edit (ISO date). Falls back to publishedIso. */
  dateModified?: string
}
```

- [ ] **Step 4.2: Add `dateModified: '2026-04-29'` to all 4 guides**

For each entry under `business.guides`, append a `dateModified` field with today's date.

- [ ] **Step 4.3: Replace `buildArticleSchema`**

Replace lines 143-176 with:

```ts
/**
 * schema.org `BlogPosting` for the editorial guides at /guias/[slug].
 * Pins the publisher to the business node and includes inLanguage so
 * multilingual graphs are unambiguous.
 */
export function buildArticleSchema(args: {
  slug: string
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  locale?: string
}) {
  const locale = args.locale ?? 'es'
  const pagePath = pathnameWithLocale(locale, `/guias/${args.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: args.title,
    description: args.description,
    image: new URL(args.image, siteUrl).toString(),
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    inLanguage: locale === 'en' ? 'en' : 'es',
    author: { '@type': 'Person', name: business.owner },
    publisher: {
      '@type': 'AutoBodyShop',
      '@id': `${siteUrl}#business`,
      name: business.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(pagePath, siteUrl).toString(),
    },
  }
}
```

- [ ] **Step 4.4: Pass `dateModified` from the guide page**

In `src/app/[locale]/guias/[slug]/page.tsx`, find the `buildArticleSchema(...)` call and add:

```tsx
buildArticleSchema({
  slug: g.slug,
  title: gc.title,
  description: gc.summary,
  image: g.heroImage,
  datePublished: g.publishedIso,
  dateModified: g.dateModified ?? g.publishedIso,
  locale,
})
```

- [ ] **Step 4.5: Verify**

```bash
curl -s http://localhost:3000/guias/cuanto-cuesta-pintar-un-carro-en-costa-rica | python3 -c "
import sys, re, json
html = sys.stdin.read()
blocks = [json.loads(b) for b in re.findall(r'<script type=\"application/ld\+json\"[^>]*>(.*?)</script>', html, re.S)]
posts = [b for b in blocks if b.get('@type') == 'BlogPosting']
for b in posts:
    print('type:', b['@type'])
    print('inLanguage:', b['inLanguage'])
    print('dateModified:', b['dateModified'])"
```
Expected: `type: BlogPosting`, `inLanguage: es`, `dateModified: 2026-04-29`.

- [ ] **Step 4.6: Commit**

```bash
git add src/lib/schema.ts src/data/business.ts src/app/[locale]/guias/[slug]/page.tsx
git commit -m "feat(schema): upgrade Article → BlogPosting with inLanguage + dateModified"
```

---

## Task 5 — Price `Service.offers.priceSpecification`

**Files:**
- Modify: `src/lib/schema.ts:73-83`

- [ ] **Step 5.1: Replace the `offers` block**

Replace lines 73-83 with:

```ts
    offers: {
      '@type': 'Offer',
      priceCurrency: business.pricing.currency,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: business.pricing.currency,
        ...(extractMinPrice(priceGuidance) !== null
          ? { minPrice: extractMinPrice(priceGuidance) }
          : {}),
        description: priceGuidance,
      },
      availability: 'https://schema.org/InStock',
      url: new URL(pathnameWithLocale(locale, offerPath), siteUrl).toString(),
    },
```

And add a helper at the top of the file (below the imports):

```ts
/** Pull the lowest CRC figure from a Spanish "a partir de" price string. */
function extractMinPrice(text: string): number | null {
  const m = text.match(/₡\s*([\d.]+)/)
  if (!m) return null
  const n = parseInt(m[1].replace(/\./g, ''), 10)
  return Number.isFinite(n) ? n : null
}
```

- [ ] **Step 5.2: Verify on a service-detail page**

```bash
curl -s http://localhost:3000/servicios/enderezado | python3 -c "
import sys, re, json
html = sys.stdin.read()
blocks = [json.loads(b) for b in re.findall(r'<script type=\"application/ld\+json\"[^>]*>(.*?)</script>', html, re.S)]
svc = next(b for b in blocks if b.get('@type') == 'Service')
print(json.dumps(svc['offers'], indent=2))"
```
Expected: `priceCurrency: CRC` and a numeric `minPrice` if the priceGuidance starts with `₡` followed by a number.

- [ ] **Step 5.3: Commit**

```bash
git add src/lib/schema.ts
git commit -m "feat(schema): emit priceCurrency + minPrice in Service.offers"
```

---

## Task 6 — Fix `aggregateRating`, add geo + hasMap + sameAs + payment

**Files:**
- Modify: `src/data/business.ts:1054-1066, 1100-1135`

- [ ] **Step 6.1: Populate `business.socialLinks` with the GBP URL**

In the `business` object, find `socialLinks: []` and replace with:

```ts
socialLinks: [
  { platform: 'GoogleBusinessProfile', url: business.map.linkUrl, handle: 'uvita-body-shop' },
],
```
(If `business.map.linkUrl` is the `?q=...` placeholder, leave the entry but add a `// TODO` comment to swap with the verified GBP short link.)

- [ ] **Step 6.2: Split rating → ratingCount + reviewCount**

Replace lines 1055-1066 with:

```ts
  const ratingBlock =
    rating.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating.value,
            ratingCount: rating.count,
            reviewCount: testimonials.length,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}
```

- [ ] **Step 6.3: Add geo, hasMap, paymentAccepted, currenciesAccepted**

Insert after the `image:` and `logo:` lines (around line 1103) inside the LocalBusiness graph node:

```ts
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 9.1572,
          longitude: -83.7383,
        },
        hasMap: business.map.linkUrl,
        paymentAccepted: 'Cash, Bank Transfer, SINPE Móvil',
        currenciesAccepted: 'CRC',
```

- [ ] **Step 6.4: Drop 'Zona Sur' from areaServed**

In `business.address.areaServed` (around line 128), remove `'Zona Sur'` from the array. (The 4 cantón names remain.)

- [ ] **Step 6.5: Verify**

```bash
curl -s http://localhost:3000/ | python3 -c "
import sys, re, json
html = sys.stdin.read()
graph = next(json.loads(b) for b in re.findall(r'<script type=\"application/ld\+json\"[^>]*>(.*?)</script>', html, re.S) if '@graph' in b)
biz = graph['@graph'][0]
print('ratingCount:', biz['aggregateRating']['ratingCount'])
print('reviewCount:', biz['aggregateRating']['reviewCount'])
print('geo:', biz.get('geo'))
print('hasMap:', biz.get('hasMap'))
print('sameAs:', biz['sameAs'])
print('areaServed cities:', [c['name'] for c in biz['areaServed']])"
```
Expected: `ratingCount: 6`, `reviewCount: 4`, `geo` populated, `hasMap` non-empty, `sameAs` non-empty array, `areaServed` lists 4 cantóns (no 'Zona Sur').

- [ ] **Step 6.6: Commit**

```bash
git add src/data/business.ts
git commit -m "fix(schema): split aggregateRating + add geo/hasMap/sameAs/payment to LocalBusiness"
```

---

## Task 7 — Emit zone-specific `Service` + breadcrumb

**Files:**
- Modify: `src/lib/schema.ts` (add new builder)
- Modify: `src/app/[locale]/zonas/[zona]/page.tsx`

- [ ] **Step 7.1: Add `buildZoneServiceSchema` to schema.ts**

```ts
/**
 * schema.org `Service` narrowed to a single zone — surfaces "body shop {town}"
 * intent without diluting the canonical Service-per-service-detail schemas.
 */
export function buildZoneServiceSchema(args: {
  zoneName: string
  zoneSlug: string
  description: string
  locale?: string
}) {
  const locale = args.locale ?? 'es'
  const pagePath = pathnameWithLocale(locale, `/zonas/${args.zoneSlug}`)
  const serviceName =
    locale === 'en'
      ? `Auto body & paint near ${args.zoneName}`
      : `Chapa y pintura cerca de ${args.zoneName}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: args.description,
    url: new URL(pagePath, siteUrl).toString(),
    provider: { '@type': 'AutoBodyShop', '@id': `${siteUrl}#business` },
    areaServed: { '@type': 'City', name: args.zoneName },
    inLanguage: locale === 'en' ? 'en' : 'es',
  }
}
```

- [ ] **Step 7.2: Wire it into the zone page**

In `src/app/[locale]/zonas/[zona]/page.tsx`, after computing `z` and `zoneName`:

```tsx
import { buildZoneServiceSchema } from '@/lib/schema'

// inside the page body, before <PageLayout>:
const zoneService = buildZoneServiceSchema({
  zoneName,
  zoneSlug: z.slug,
  description: z.lede,
  locale,
})
```

Then on `<PageLayout>` add:
```tsx
extraJsonLd={[zoneService]}
```

(`PageLayout` already builds the BreadcrumbList via the `breadcrumb` prop, so we don't add it manually.)

- [ ] **Step 7.3: Verify**

```bash
curl -s http://localhost:3000/zonas/uvita | grep -c 'application/ld+json'
curl -s http://localhost:3000/zonas/uvita | grep -oE '"@type":"Service"' | wc -l
```
Expected: ≥3 JSON-LD blocks (LocalBusiness from layout + Breadcrumb + Service); exactly one Service-type entity.

- [ ] **Step 7.4: Commit**

```bash
git add src/lib/schema.ts src/app/[locale]/zonas/[zona]/page.tsx
git commit -m "feat(zonas): emit zone-specific Service JSON-LD for local-pack intent"
```

---

## Verification

```bash
# 1. Typecheck + lint
pnpm typecheck && pnpm lint

# 2. e2e regression
pnpm exec playwright test tests/e2e/page-chrome-hierarchy --project=chromium

# 3. Schema graph audit per page
for path in / /sobre-nosotros /servicios/enderezado /preguntas-frecuentes /guias/cuanto-cuesta-pintar-un-carro-en-costa-rica /zonas/uvita ; do
  echo "=== $path ==="
  curl -s "http://localhost:3000$path" | python3 -c "
import sys, re, json
html = sys.stdin.read()
blocks = [json.loads(b) for b in re.findall(r'<script type=\"application/ld\+json\"[^>]*>(.*?)</script>', html, re.S)]
for b in blocks:
    if '@graph' in b:
        for n in b['@graph']:
            print(' graph node:', n.get('@type'))
    else:
        print(' top-level:', b.get('@type'))"
done
```

Expected types per route:
- `/` → graph (AutoBodyShop+LocalBusiness) + WebSite + BreadcrumbList
- `/sobre-nosotros` → graph + BreadcrumbList + 5×Person
- `/servicios/enderezado` → graph + BreadcrumbList + Service + FAQPage
- `/preguntas-frecuentes` → graph + BreadcrumbList + FAQPage
- `/guias/...` → graph + BreadcrumbList + BlogPosting
- `/zonas/uvita` → graph + BreadcrumbList + Service

Plus manual: paste 2 sample URLs into [Google Rich Results Test](https://search.google.com/test/rich-results) and confirm zero errors.

## Final commit + PR

```bash
git push origin seo/03-schema
gh pr create --title "seo: B — schema enrichment" --body "Resolves audit findings C4, C6 + 6 High schema items. Verification snippets pasted below."
```
