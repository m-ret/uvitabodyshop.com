---
title: "Plan A — SEO Metadata + Titles + SERP Hygiene"
type: refactor
status: ready
date: 2026-04-29
parent: ./2026-04-29-001-seo-fixes-master.md
branch: seo/02-metadata-titles
---

# Plan A — Metadata + titles + SERP hygiene

> Read the [master plan](./2026-04-29-001-seo-fixes-master.md) first for invariants and acceptance gate.

**Goal:** Fix every metadata-layer bug surfaced by the audit so each of the 38 URLs ships a clean `<title>`, `<meta description>`, canonical, hreflang, and og:image.

**Architecture:** Single helper change in `src/lib/metadata.ts` (root-slash normalization) cascades to every page through `buildPageMetadata`. Locale-branched fixes for zone + contacto inline metadata generators. String trims in `business.ts` and translations.

**Tech stack:** Next.js Metadata API, next-intl, JSON translation files.

**Resolves audit findings:** C1 (EN zone titles), C2 (double-period bug), C3 (EN home redirect chain), C5 (AVIF og:image), C8 (12 over-long titles), C10 (sitemap/HTML root URL mismatch), plus 14 stub-description Mediums and the 29-char About description.

---

## File touch list

| File | Change |
|---|---|
| `src/lib/metadata.ts` | Fix `pathnameWithLocale` root-slash; add `absoluteUrlForPath` helper |
| `src/app/sitemap.ts` | Use `absoluteUrlForPath` instead of `new URL().toString()` |
| `src/app/[locale]/zonas/[zona]/page.tsx` | Locale-branch title; drop trailing `.` in description |
| `src/app/[locale]/contacto/page.tsx` | Drop trailing `.` in description |
| `src/app/[locale]/sobre-nosotros/page.tsx` | Remove `ogImage` AVIF override |
| `src/app/[locale]/servicios/[slug]/page.tsx` | Remove `ogImage` AVIF override |
| `src/data/business.ts` | Trim `services[].meta.title` (5 entries); trim `guides[].title/titleEn` (8 strings) |
| `messages/es/pages.json` | Expand AboutPage, ServicesIndexPage, FaqPage `metaDesc` |
| `messages/en/pages.json` | Same in English |
| `messages/en/service-detail.json` | Trim 4 EN service-detail `metaTitle` overflows |

---

## Task 1 — Fix `pathnameWithLocale` + add `absoluteUrlForPath`

**Files:**
- Modify: `src/lib/metadata.ts:18-22`

- [ ] **Step 1.1: Replace `pathnameWithLocale` and add `absoluteUrlForPath`**

Replace lines 18-22 with:

```ts
/** Public URL path including optional `/en` prefix. Root-aware: `/en/` is
 * normalized to `/en` so canonical and sitemap agree on a single shape. */
export function pathnameWithLocale(locale: string, pathname: string): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (locale === routing.defaultLocale) return p
  if (p === '/') return `/${locale}`
  return `/${locale}${p}`
}

/** Absolute URL for a localized path, stripping any trailing slash except
 * on the default-locale root (which stays as the bare site URL). */
export function absoluteUrlForPath(locale: string, pathname: string): string {
  const path = pathnameWithLocale(locale, pathname)
  if (path === '/') return siteUrl.replace(/\/$/, '')
  const u = new URL(path, siteUrl).toString()
  return u.replace(/\/$/, '')
}
```

- [ ] **Step 1.2: Verify dev server picks up the change**

```bash
curl -sI http://localhost:3000/en
```
Expected: `HTTP/1.1 200 OK` (no 308).

```bash
curl -s http://localhost:3000/en | grep -oE '<link rel="canonical"[^>]*>'
```
Expected: `<link rel="canonical" href="https://uvitabodyshop.com/en"/>` (no trailing slash).

- [ ] **Step 1.3: Commit**

```bash
git add src/lib/metadata.ts
git commit -m "fix(metadata): normalize EN home canonical to /en (no trailing slash)"
```

---

## Task 2 — Switch sitemap to `absoluteUrlForPath`

**Files:**
- Modify: `src/app/sitemap.ts:22-56`

- [ ] **Step 2.1: Replace `languageAlternates` and update `sitemapEntriesForPath`**

Replace lines 22-56 with:

```ts
import { pathnameWithLocale, absoluteUrlForPath } from '@/lib/metadata'

/** Full alternates map shared by every `<url>` entry for one logical path. */
function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrlForPath(locale, path)
  }
  languages['x-default'] = absoluteUrlForPath(routing.defaultLocale, path)
  return languages
}

/** One sitemap row per locale so each language has its own `<loc>`. */
function sitemapEntriesForPath(
  path: string,
  priority: number,
  change: ChangeFreq,
  lastModified: Date
): MetadataRoute.Sitemap {
  const alternates = languageAlternates(path)
  return routing.locales.map((locale) => ({
    url: absoluteUrlForPath(locale, path),
    lastModified,
    changeFrequency: change,
    priority,
    alternates: { languages: alternates },
  }))
}
```

(Keep the remaining `staticPaths`, `ChangeFreq`, and default-export shape unchanged.)

- [ ] **Step 2.2: Verify sitemap shape**

```bash
curl -s http://localhost:3000/sitemap.xml | head -40
```
Expected: every `<loc>` matches the canonical shape (no trailing slash on `/en`; root is `https://uvitabodyshop.com`).

- [ ] **Step 2.3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "fix(sitemap): use absoluteUrlForPath so URLs match HTML canonicals"
```

---

## Task 3 — Localize zone metadata + drop trailing-period

**Files:**
- Modify: `src/app/[locale]/zonas/[zona]/page.tsx:25-54`

- [ ] **Step 3.1: Replace `generateMetadata` body**

The current generator (lines 25-54) hardcodes Spanish title and appends a `.` after `business.hours.display` (which already ends with `.`, producing `..`). Replace with:

```tsx
export async function generateMetadata({ params }: Props) {
  const { locale, zona } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const z = getZoneBySlug(zona)
  if (!z) {
    return buildPageMetadata({
      locale,
      pathname: '/',
      title: 'Zona no encontrada',
      description: business.meta.descriptionEs,
      index: false,
    })
  }
  const zoneName = zoneDisplayName(z, locale as 'es' | 'en')
  const title =
    locale === 'en'
      ? `Auto body & paint near ${zoneName} · South Zone`
      : `Chapa y pintura cerca de ${zoneName} · Zona Sur`
  const hours =
    locale === 'en' ? business.hours.displayEn : business.hours.display
  const description = `${z.lede} ${zoneName} y alrededores. ${hours}`.replace(/\.\.+/g, '.')
  return buildPageMetadata({
    locale,
    pathname: `/zonas/${z.slug}`,
    title,
    description,
    ...(locale === 'es'
      ? {
          keywords: [
            `body shop ${z.name.toLowerCase()}`,
            'pintura automotriz zona sur',
            'enderezado costa rica',
          ],
        }
      : {}),
  })
}
```

- [ ] **Step 3.2: Verify EN title localized + no double period**

```bash
curl -s http://localhost:3000/en/zonas/uvita | grep -oE '<title>[^<]+</title>'
curl -s http://localhost:3000/en/zonas/uvita | grep -oE 'name="description" content="[^"]+"' | head -c 250
```
Expected: title contains "Auto body & paint near Uvita"; description has no `..` substring.

- [ ] **Step 3.3: Same check on Spanish**

```bash
curl -s http://localhost:3000/zonas/uvita | grep -oE 'name="description" content="[^"]+"' | head -c 250
```
Expected: no `..` substring.

- [ ] **Step 3.4: Commit**

```bash
git add src/app/[locale]/zonas/[zona]/page.tsx
git commit -m "fix(zonas): localize EN title; strip trailing-period bug from meta description"
```

---

## Task 4 — Drop trailing-period in `/contacto` description

**Files:**
- Modify: `src/app/[locale]/contacto/page.tsx:25`

- [ ] **Step 4.1: Replace the description line**

Current line 25:
```tsx
description: `${t('metaDesc')} ${c.hoursDisplay}. ${business.address.locationDisplay}.`,
```

Replace with:
```tsx
description: `${t('metaDesc')} ${c.hoursDisplay} · ${business.address.locationDisplay}`.replace(/\.\.+/g, '.'),
```

(Switch the literal `.` separator to ` · ` so we never re-introduce the double-period; defensive `.replace` strips any remaining accidental doubling.)

- [ ] **Step 4.2: Verify**

```bash
curl -s http://localhost:3000/contacto | grep -oE 'name="description" content="[^"]+"'
curl -s http://localhost:3000/en/contacto | grep -oE 'name="description" content="[^"]+"'
```
Expected: both descriptions contain `· Uvita` separator and no `..`.

- [ ] **Step 4.3: Commit**

```bash
git add src/app/[locale]/contacto/page.tsx
git commit -m "fix(contacto): replace trailing-period bug with bullet separator"
```

---

## Task 5 — Drop AVIF `ogImage` overrides

**Files:**
- Modify: `src/app/[locale]/sobre-nosotros/page.tsx:27`
- Modify: `src/app/[locale]/servicios/[slug]/page.tsx:73`

- [ ] **Step 5.1: Remove the override on About**

In `sobre-nosotros/page.tsx`, delete the `ogImage: '/images/craft.avif',` line from the `buildPageMetadata` call.

- [ ] **Step 5.2: Remove the override on service-detail**

In `servicios/[slug]/page.tsx`, delete the `ogImage: s.image,` line from the `buildPageMetadata` call. (Keep the `keywords` block; only remove the `ogImage` line.)

- [ ] **Step 5.3: Verify both routes now use `/opengraph-image`**

```bash
curl -s http://localhost:3000/sobre-nosotros | grep -oE 'og:image[^/]*content="[^"]+"'
curl -s http://localhost:3000/servicios/enderezado | grep -oE 'og:image[^/]*content="[^"]+"'
```
Expected: both end with `/opengraph-image` (PNG dynamic route), not `.avif`.

- [ ] **Step 5.4: Commit**

```bash
git add src/app/[locale]/sobre-nosotros/page.tsx src/app/[locale]/servicios/[slug]/page.tsx
git commit -m "fix(og): drop AVIF og:image overrides; rely on dynamic /opengraph-image PNG"
```

---

## Task 6 — Trim service `meta.title` strings

**Files:**
- Modify: `src/data/business.ts` (services[].meta.title for 5 entries)

Brand suffix `· Uvita Body Shop` adds 19 chars. Target raw title ≤41 chars (final ≤60).

- [ ] **Step 6.1: Update the 5 service titles**

Find each `services[].meta.title` and replace per this table:

| Slug | New title (≤41 chars) |
|---|---|
| `enderezado` | `Enderezado de chasis y colisión · Uvita` (39) |
| `pintura-completa` | `Pintura completa de carro · Uvita CR` (36) |
| `retoques-pintura` | `Retoques de pintura y rayones · Uvita` (37) |
| `reparacion-golpes` | `Reparación de abolladuras · Uvita` (33) |
| `instalacion-accesorios` | `Accesorios pintados al tono · Uvita` (35) |

- [ ] **Step 6.2: Verify all 5 ES title rows ≤60 final**

```bash
for slug in enderezado pintura-completa retoques-pintura reparacion-golpes instalacion-accesorios; do
  echo -n "$slug: "
  curl -s "http://localhost:3000/servicios/$slug" | grep -oE '<title>[^<]+</title>' | awk '{print length, $0}'
done
```
Expected: each line shows length ≤72 (60 chars + `<title></title>` wrappers = ~72).

- [ ] **Step 6.3: Commit**

```bash
git add src/data/business.ts
git commit -m "fix(services): trim ES meta titles to ≤41 raw chars (≤60 with brand)"
```

---

## Task 7 — Trim EN service-detail `metaTitle` overflows

**Files:**
- Modify: `messages/en/service-detail.json`

- [ ] **Step 7.1: Trim 4 EN service-detail metaTitle entries**

Review each entry under `ServiceDetail.<slug>.metaTitle` and trim to ≤41 raw chars. Suggested replacements (verify each in the actual file):

| Slug | EN metaTitle |
|---|---|
| `enderezado` | `Frame & collision repair · Uvita CR` (35) |
| `pintura-completa` | `Full car paint, Uvita Costa Rica` (32) |
| `retoques-pintura` | `Paint touch-ups & scratch fix · Uvita` (37) |
| `reparacion-golpes` | `Dent & impact repair · Uvita` (28) |
| `instalacion-accesorios` | `Accessory install + matched paint, Uvita` (40) |

- [ ] **Step 7.2: Verify EN title lengths**

```bash
for slug in enderezado pintura-completa retoques-pintura reparacion-golpes instalacion-accesorios; do
  echo -n "en/$slug: "
  curl -s "http://localhost:3000/en/servicios/$slug" | grep -oE '<title>[^<]+</title>'
done
```
Expected: each title ≤60 chars total.

- [ ] **Step 7.3: Commit**

```bash
git add messages/en/service-detail.json
git commit -m "fix(en/service-detail): trim metaTitles to ≤41 raw chars"
```

---

## Task 8 — Trim guide titles (ES + EN)

**Files:**
- Modify: `src/data/business.ts` (guides[] entries — 4 ES `title` + 4 EN `titleEn`)

- [ ] **Step 8.1: Update 8 guide title strings**

| Slug | ES title (≤41) | EN titleEn (≤41) |
|---|---|---|
| `cuanto-cuesta-pintar-un-carro-en-costa-rica` | `Cuánto cuesta pintar un carro en CR` (35) | `Cost to paint a car in Costa Rica` (33) |
| `enderezado-de-chasis-cuando-es-necesario` | `Enderezado de chasis: cuándo aplica` (35) | `Frame straightening: when needed` (32) |
| `como-saber-si-tu-pintura-necesita-retoque-o-repinte` | `Retoque o repinte: cómo elegir` (30) | `Touch-up vs respray: how to choose` (34) |
| `pintura-automotriz-en-clima-costero` | `Pintura en clima costero · Costa Ballena` (40) | `Coastal-weather auto paint care` (31) |

- [ ] **Step 8.2: Verify**

```bash
for slug in cuanto-cuesta-pintar-un-carro-en-costa-rica enderezado-de-chasis-cuando-es-necesario como-saber-si-tu-pintura-necesita-retoque-o-repinte pintura-automotriz-en-clima-costero; do
  echo -n "es/$slug: "
  curl -s "http://localhost:3000/guias/$slug" | grep -oE '<title>[^<]+</title>'
  echo -n "en/$slug: "
  curl -s "http://localhost:3000/en/guias/$slug" | grep -oE '<title>[^<]+</title>'
done
```
Expected: every title ≤60 chars total.

- [ ] **Step 8.3: Commit**

```bash
git add src/data/business.ts
git commit -m "fix(guides): trim ES + EN titles to ≤41 raw chars"
```

---

## Task 9 — Expand stub meta descriptions

**Files:**
- Modify: `messages/es/pages.json` (AboutPage.metaDesc, ServicesIndexPage.metaDesc, FaqPage.metaDesc)
- Modify: `messages/en/pages.json` (same 3 keys)

- [ ] **Step 9.1: Replace 6 short descriptions**

In `messages/es/pages.json`:

```json
"AboutPage": {
  "metaDesc": "Taller de chapa y pintura en Uvita, Costa Ballena. 9 años de oficio, cabina controlada, garantía escrita. Conocé al fundador y al equipo.",
  ...
}
"ServicesIndexPage": {
  "metaDesc": "Servicios de chapa y pintura en Uvita: enderezado de chasis, pintura completa, retoques, reparación de golpes e instalación de accesorios.",
  ...
}
"FaqPage": {
  "metaDesc": "Respuestas claras sobre cotizaciones, plazos, materiales, aseguradoras y cobertura en Uvita, Dominical, Ojochal y Bahía Ballena.",
  ...
}
```

In `messages/en/pages.json`:

```json
"AboutPage": {
  "metaDesc": "Auto body & paint shop in Uvita, Costa Ballena. Nine years in the trade, controlled booth, written warranty. Meet the founder and crew.",
  ...
}
"ServicesIndexPage": {
  "metaDesc": "Auto body & paint services in Uvita: frame repair, full paint, touch-ups, dent repair, and accessory installs across the Costa Ballena.",
  ...
}
"FaqPage": {
  "metaDesc": "Clear answers on quotes, timelines, paint systems, insurance, and service across Uvita, Dominical, Ojochal, and Bahía Ballena.",
  ...
}
```

(Each description sits between 150 and 160 chars; verify with `wc -c <<< "..."`.)

- [ ] **Step 9.2: Verify rendered HTML**

```bash
for path in /sobre-nosotros /servicios /preguntas-frecuentes /en/sobre-nosotros /en/servicios /en/preguntas-frecuentes; do
  echo -n "$path: "
  len=$(curl -s "http://localhost:3000$path" | grep -oE 'name="description" content="[^"]+"' | sed 's/.*content="\([^"]*\)"/\1/' | wc -c)
  echo "$len chars"
done
```
Expected: each between 150 and 165 chars.

- [ ] **Step 9.3: Commit**

```bash
git add messages/es/pages.json messages/en/pages.json
git commit -m "fix(meta-desc): expand About, Services, FAQ stub descriptions to 150-160"
```

---

## Verification

Run the full curl matrix from the master plan, plus:

```bash
# 1. Typecheck + lint clean
pnpm typecheck && pnpm lint

# 2. e2e regression guard
pnpm exec playwright test tests/e2e/page-chrome-hierarchy --project=chromium

# 3. Title length matrix (every page ≤60 chars)
for path in / /sobre-nosotros /servicios /preguntas-frecuentes /garantia /contacto \
            /servicios/enderezado /servicios/pintura-completa /servicios/retoques-pintura /servicios/reparacion-golpes /servicios/instalacion-accesorios \
            /zonas/uvita /zonas/dominical /zonas/ojochal /zonas/bahia-ballena \
            /guias/cuanto-cuesta-pintar-un-carro-en-costa-rica /guias/enderezado-de-chasis-cuando-es-necesario /guias/como-saber-si-tu-pintura-necesita-retoque-o-repinte /guias/pintura-automotriz-en-clima-costero ; do
  for prefix in "" "/en" ; do
    echo -n "$prefix$path: "
    curl -s "http://localhost:3000$prefix$path" | grep -oE '<title>[^<]+</title>' | sed 's/<[^>]*>//g' | awk '{print length, $0}'
  done
done | awk '$1>60'
```
Expected: empty output (no titles over 60 chars).

```bash
# 4. No `..` in any meta description
for path in /contacto /zonas/uvita /zonas/dominical /zonas/ojochal /zonas/bahia-ballena /en/contacto /en/zonas/uvita /en/zonas/dominical /en/zonas/ojochal /en/zonas/bahia-ballena ; do
  curl -s "http://localhost:3000$path" | grep -E '\.\.' | grep -E 'description|content' | head -1
done
```
Expected: empty output.

```bash
# 5. og:image on every route resolves to /opengraph-image
for path in / /sobre-nosotros /servicios/enderezado /guias/cuanto-cuesta-pintar-un-carro-en-costa-rica ; do
  curl -s "http://localhost:3000$path" | grep -oE 'og:image[^>]*content="[^"]+"'
done
```
Expected: every line ends with `/opengraph-image`.

## Final commit + PR

```bash
git push origin seo/02-metadata-titles
gh pr create --title "seo: A — metadata + titles + SERP hygiene" --body "$(cat <<'EOF'
## Summary
Resolves audit findings C1, C2, C3, C5, C8, C10 + 14 stub-description Mediums.

## Verification
[paste outputs from Verification section]

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
