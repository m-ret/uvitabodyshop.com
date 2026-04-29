---
title: "Plan D — SEO Internal Linking + Privacy Page"
type: refactor
status: ready
date: 2026-04-29
parent: ./2026-04-29-001-seo-fixes-master.md
branch: seo/05-links-privacy
depends_on: ./2026-04-29-002-seo-metadata-and-titles.md
---

# Plan D — Internal linking + /privacidad + footer NAP

> Read the [master plan](./2026-04-29-001-seo-fixes-master.md) first. Plan A must be merged. Plan B and C can run in parallel with this one.

**Goal:** Make every important page reachable in ≤2 clicks from home, build reciprocal cross-links between services / guides / zones, ship a Ley 8968-aligned `/privacidad` page in both locales, and surface NAP in the footer.

**Architecture:** Wrap home Services tiles in `<Link>`; derive related guides/zones from existing `business.guides[].related` arrays inversely; new `/privacidad` route uses existing `PageLayout` + `PageHero` + body sections; footer gets a NAP block sourced from `business`.

**Tech stack:** next-intl `Link`, existing `PageLayout`, no new deps.

**Resolves audit findings:** C7 (privacy page), home omits service-detail links, service↔guide cross-link gap, guide→zone gap, zone `slice(0,3)` cap, footer NAP-light, generic "Ver detalle" anchor, missing footer link to legal.

---

## File touch list

| File | Change |
|---|---|
| `src/components/home/HomePage.tsx` | Wrap Services-section sticky cards in `<Link href="/servicios/${slug}">`. |
| `src/app/[locale]/servicios/[slug]/page.tsx` | Compute `relatedGuides` (inverse of `g.related`); render chip row + zone chip row. |
| `src/app/[locale]/guias/[slug]/page.tsx` | Add bottom zones chip row. |
| `src/app/[locale]/zonas/[zona]/page.tsx` | Render all 5 services (drop `slice(0, 3)`). |
| `src/app/[locale]/servicios/page.tsx` | Replace generic "Ver detalle" anchor with service-name interpolation. |
| **NEW** `src/app/[locale]/privacidad/page.tsx` | Privacy notice route. |
| `messages/{es,en}/pages.json` | Add `PrivacyPage` namespace. Add `/privacidad` to `Explore.links`. |
| `src/app/sitemap.ts` | Register `/privacidad` in `staticPaths`. |
| `src/components/ui/SiteFooter.tsx` | Add NAP block (phone, hours, address) + link to `/privacidad`. |

---

## Task 1 — Wrap home service tiles in `<Link>`

**Files:**
- Modify: `src/components/home/HomePage.tsx` (Services section, lines 513-573)

- [ ] **Step 1.1: Identify the loop and wrap cards**

Find the Services map loop. Each card is currently a `<div>` with no link. Wrap the outer container per card with `Link`:

```tsx
import { Link } from '@/i18n/navigation'

// inside the map:
<Link
  key={s.slug}
  href={`/servicios/${s.slug}`}
  className="svc-sticky-card group ..."   // existing classes
  aria-label={s.title}
>
  {/* existing card body */}
</Link>
```

Replace the card's outer `<div>` with `<Link>`. Keep all interior markup and classes.

- [ ] **Step 1.2: Verify**

```bash
curl -s http://localhost:3000/ | grep -oE 'href="/servicios/[^"]+"' | sort -u
```
Expected: 5 distinct service URLs.

- [ ] **Step 1.3: Commit**

```bash
git add src/components/home/HomePage.tsx
git commit -m "feat(home): make Services tiles clickable to service-detail pages"
```

---

## Task 2 — Service-detail: render related guides + zones

**Files:**
- Modify: `src/app/[locale]/servicios/[slug]/page.tsx`

- [ ] **Step 2.1: Compute related guides + render chip row**

Add to the page after `getServiceBySlug`:

```tsx
import { Link } from '@/i18n/navigation'
import { business, getServiceBySlug, getGuideContent } from '@/data/business'

// inside the page body, after computing `s`:
const relatedGuides = business.guides.filter((g) => g.related.includes(s.slug))
```

Render after the FAQ section:

```tsx
{relatedGuides.length > 0 && (
  <section aria-labelledby="related-guides" className="mt-12 pt-10 border-t border-zinc-800/50">
    <h2 id="related-guides" className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">
      {locale === 'en' ? 'Related guides' : 'Guías relacionadas'}
    </h2>
    <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
      {relatedGuides.map((g) => (
        <li key={g.slug}>
          <Link
            href={`/guias/${g.slug}`}
            className="font-mono text-[10px] uppercase text-accent border border-zinc-700 px-3 py-2 hover:border-accent/60"
          >
            {getGuideContent(g, locale as 'es' | 'en').title}
          </Link>
        </li>
      ))}
    </ul>
  </section>
)}
```

- [ ] **Step 2.2: Add zones chip row**

```tsx
<section aria-labelledby="related-zones" className="mt-12 pt-10 border-t border-zinc-800/50">
  <h2 id="related-zones" className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">
    {locale === 'en' ? 'We serve' : 'Atendemos en'}
  </h2>
  <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
    {business.zones.map((z) => (
      <li key={z.slug}>
        <Link
          href={`/zonas/${z.slug}`}
          className="font-mono text-[10px] uppercase text-accent border border-zinc-700 px-3 py-2 hover:border-accent/60"
        >
          {zoneDisplayName(z, locale as 'es' | 'en')}
        </Link>
      </li>
    ))}
  </ul>
</section>
```

(Import `zoneDisplayName` from `@/data/business`.)

- [ ] **Step 2.3: Verify**

```bash
curl -s http://localhost:3000/servicios/enderezado | grep -oE 'href="/guias/[^"]+"' | wc -l
curl -s http://localhost:3000/servicios/enderezado | grep -oE 'href="/zonas/[^"]+"' | wc -l
```
Expected: ≥1 guide link and ≥4 zone links.

- [ ] **Step 2.4: Commit**

```bash
git add src/app/[locale]/servicios/[slug]/page.tsx
git commit -m "feat(service-detail): add related-guides + zones chip rows"
```

---

## Task 3 — Guide page: bottom zones chip row

**Files:**
- Modify: `src/app/[locale]/guias/[slug]/page.tsx`

- [ ] **Step 3.1: Add zones chip row above PageEndModule**

Insert before the `<PageEndModule>` call:

```tsx
<section aria-labelledby="guide-zones" className="mt-12 pt-10 border-t border-zinc-800/50">
  <h2 id="guide-zones" className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">
    {locale === 'en' ? 'We serve' : 'Atendemos en'}
  </h2>
  <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
    {business.zones.map((z) => (
      <li key={z.slug}>
        <Link
          href={`/zonas/${z.slug}`}
          className="font-mono text-[10px] uppercase text-accent border border-zinc-700 px-3 py-2 hover:border-accent/60"
        >
          {zoneDisplayName(z, localeUi)}
        </Link>
      </li>
    ))}
  </ul>
</section>
```

- [ ] **Step 3.2: Verify**

```bash
curl -s http://localhost:3000/guias/cuanto-cuesta-pintar-un-carro-en-costa-rica | grep -oE 'href="/zonas/[^"]+"' | wc -l
```
Expected: 4.

- [ ] **Step 3.3: Commit**

```bash
git add src/app/[locale]/guias/[slug]/page.tsx
git commit -m "feat(guide): add bottom zones chip row"
```

---

## Task 4 — Zone page: render all 5 services

**Files:**
- Modify: `src/app/[locale]/zonas/[zona]/page.tsx:63`

- [ ] **Step 4.1: Drop the slice**

Change:
```tsx
const related = business.services.slice(0, 3)
```
to:
```tsx
const related = business.services
```

- [ ] **Step 4.2: Verify**

```bash
curl -s http://localhost:3000/zonas/uvita | grep -oE 'href="/servicios/[^"]+"' | sort -u | wc -l
```
Expected: 5.

- [ ] **Step 4.3: Commit**

```bash
git add src/app/[locale]/zonas/[zona]/page.tsx
git commit -m "fix(zonas): show all 5 services (drop slice cap)"
```

---

## Task 5 — Service index: descriptive anchor

**Files:**
- Modify: `src/app/[locale]/servicios/page.tsx`

- [ ] **Step 5.1: Replace generic "Ver detalle" copy**

In the service index card, change the trailing label from `tSvc('detailLink')` (which renders "Ver detalle" / "View details") to:

```tsx
<span className="...">
  {locale === 'en' ? `View ${s.en} details` : `Ver detalle de ${s.es}`}
</span>
```

(Keep the wrapping `<Link>` and existing classes.)

- [ ] **Step 5.2: Verify**

```bash
curl -s http://localhost:3000/servicios | grep -oE 'Ver detalle de [^<]+'
```
Expected: 5 distinct phrases.

- [ ] **Step 5.3: Commit**

```bash
git add src/app/[locale]/servicios/page.tsx
git commit -m "fix(services-index): use service-specific anchor text"
```

---

## Task 6 — Create `/privacidad` route

**Files:**
- Create: `src/app/[locale]/privacidad/page.tsx`
- Modify: `messages/es/pages.json`
- Modify: `messages/en/pages.json`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 6.1: Add `PrivacyPage` namespace to `messages/es/pages.json`**

```json
"PrivacyPage": {
  "metaTitle": "Política de privacidad",
  "metaDesc": "Cómo Uvita Body Shop recolecta, usa y protege los datos personales que usted comparte cuando solicita una cotización o cita en el taller.",
  "metaKeywords": ["política de privacidad uvita body shop", "ley 8968", "protección datos costa rica"],
  "heroEyebrow": "Privacidad",
  "heroTitle": "Política de privacidad",
  "heroLede": "Tratamos los datos personales que usted nos comparte con el cuidado que exige la Ley 8968 de Costa Rica.",
  "lastUpdated": "Última actualización: 29 de abril de 2026",
  "sections": [
    {
      "title": "Datos que recolectamos",
      "body": "Cuando usted solicita una cotización o cita usamos los siguientes datos: nombre, número de teléfono o WhatsApp, correo electrónico opcional, marca y modelo del vehículo, y la descripción del trabajo a cotizar. Si nos comparte fotos del daño, las usamos solo para evaluar la reparación. No solicitamos cédula, números de tarjeta ni placas en línea — esos datos se manejan en persona o con su aseguradora."
    },
    {
      "title": "Para qué los usamos",
      "body": "Los datos se usan exclusivamente para responder su consulta, agendar una cita, preparar la cotización por escrito y dar seguimiento al trabajo cuando entra al taller. Nunca vendemos, alquilamos ni compartimos sus datos con terceros con fines publicitarios."
    },
    {
      "title": "Cuánto tiempo los guardamos",
      "body": "Las consultas no concretadas se descartan a los 12 meses. Las órdenes de trabajo, cotizaciones aceptadas y registros de garantía se conservan por el plazo de la garantía escrita más dos años, conforme a obligaciones contables y de respaldo de garantía."
    },
    {
      "title": "Sus derechos",
      "body": "Usted tiene derecho a solicitar acceso, rectificación, eliminación o portabilidad de sus datos personales en cualquier momento. Para ejercerlos escriba a fabricio@uvitabodyshop.com o por WhatsApp al (506) 8769-9927. Respondemos dentro de los 10 días hábiles que establece la Ley 8968."
    },
    {
      "title": "Seguridad",
      "body": "Los datos se almacenan en sistemas con acceso restringido al equipo del taller. No transferimos datos fuera de Costa Rica salvo que el procesamiento de un mensaje pase por servidores de WhatsApp / Meta o por el servidor de correo donde aloja Uvita Body Shop su correo de contacto."
    },
    {
      "title": "Cambios a esta política",
      "body": "Si modificamos esta política publicaremos la nueva versión en esta misma página con una nueva fecha de actualización. Le recomendamos revisarla periódicamente."
    }
  ]
}
```

- [ ] **Step 6.2: Add EN equivalent to `messages/en/pages.json`**

```json
"PrivacyPage": {
  "metaTitle": "Privacy policy",
  "metaDesc": "How Uvita Body Shop collects, uses, and protects the personal data you share when requesting a quote or booking a service.",
  "heroEyebrow": "Privacy",
  "heroTitle": "Privacy policy",
  "heroLede": "We handle the personal data you share with the care Costa Rica's Ley 8968 (Personal Data Protection Act) requires.",
  "lastUpdated": "Last updated: April 29, 2026",
  "sections": [
    {
      "title": "Data we collect",
      "body": "When you request a quote or appointment we collect: name, phone or WhatsApp number, optional email, vehicle make and model, and a short description of the work. If you send damage photos, we use them only to scope the repair. We do not collect ID numbers or card details online — those are handled in person or with your insurer."
    },
    {
      "title": "How we use it",
      "body": "We use this data only to respond to your inquiry, schedule an appointment, prepare a written quote, and follow up on the job once it enters the shop. We never sell, rent, or share your data with third parties for advertising purposes."
    },
    {
      "title": "How long we keep it",
      "body": "Inquiries that don't proceed are discarded after 12 months. Active work orders, accepted quotes, and warranty records are kept for the warranty period plus two years to support accounting and warranty obligations."
    },
    {
      "title": "Your rights",
      "body": "You may request access, correction, deletion, or portability of your personal data at any time. Email fabricio@uvitabodyshop.com or message us on WhatsApp at +506 8769-9927. We respond within the 10 business days required by Ley 8968."
    },
    {
      "title": "Security",
      "body": "Data is stored on systems with access restricted to shop staff. Data does not leave Costa Rica except where messages are processed by WhatsApp/Meta servers or by the email server hosting our contact mailbox."
    },
    {
      "title": "Changes to this policy",
      "body": "If we modify this policy we will publish the new version on this page with a new \"Last updated\" date. Please review it from time to time."
    }
  ]
}
```

- [ ] **Step 6.3: Create the page component**

`src/app/[locale]/privacidad/page.tsx`:

```tsx
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import PageEndModule from '@/components/layout/PageEndModule'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }
type Section = { title: string; body: string }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' })
  return buildPageMetadata({
    locale,
    pathname: '/privacidad',
    title: t('metaTitle'),
    description: t('metaDesc'),
    keywords: locale === 'es' ? (t.raw('metaKeywords') as string[]) : undefined,
  })
}

export default async function PrivacidadPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const sections = t.raw('sections') as Section[]

  return (
    <PageLayout
      locale={locale}
      breadcrumb={[
        { href: '/', label: tLayout('breadcrumbHome') },
        { href: '', label: t('metaTitle') },
      ]}
      hero={
        <PageHero
          eyebrow={t('heroEyebrow')}
          title={t('heroTitle')}
          lede={t('heroLede')}
        />
      }
    >
      <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28">
        <div className="max-w-3xl mx-auto w-full">
          <p className="font-mono text-xs text-zinc-500 mb-10">{t('lastUpdated')}</p>
          {sections.map((s) => (
            <section key={s.title} className="mb-10">
              <h2 className="font-display text-xl uppercase text-white mb-3">
                {s.title}
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
        <div className="max-w-6xl mx-auto w-full">
          <PageEndModule locale={locale} currentHref="/privacidad" />
        </div>
      </div>
    </PageLayout>
  )
}
```

- [ ] **Step 6.4: Register the route in the sitemap**

In `src/app/sitemap.ts`, append to the `staticPaths` array:

```ts
{ path: '/privacidad', priority: 0.3, change: 'yearly' },
```

- [ ] **Step 6.5: Add `/privacidad` to `Explore.links`**

In `messages/es/pages.json` `Explore.links` array append:

```json
{ "href": "/privacidad", "label": "Política de privacidad" }
```

In `messages/en/pages.json` `Explore.links` array append:

```json
{ "href": "/privacidad", "label": "Privacy policy" }
```

- [ ] **Step 6.6: Verify**

```bash
curl -sI http://localhost:3000/privacidad
curl -sI http://localhost:3000/en/privacidad
curl -s http://localhost:3000/sitemap.xml | grep privacidad
curl -s http://localhost:3000/en/sobre-nosotros | grep -oE 'href="/en/privacidad"' | head -1
```
Expected: 200 / 200; sitemap contains both privacy URLs; About page renders the privacy link in the Explore aside.

- [ ] **Step 6.7: Commit**

```bash
git add src/app/[locale]/privacidad/page.tsx messages/es/pages.json messages/en/pages.json src/app/sitemap.ts
git commit -m "feat(privacy): add /privacidad page (ES + EN) per Ley 8968"
```

---

## Task 7 — Footer NAP block + privacy link

**Files:**
- Modify: `src/components/ui/SiteFooter.tsx`
- Modify: `messages/{es,en}/common.json` `Footer` namespace

- [ ] **Step 7.1: Add Footer copy keys**

In `messages/es/common.json` `Footer`:

```json
"contactBlock": "Contacto",
"phoneLabel": "Teléfono",
"hoursLabel": "Horario",
"addressLabel": "Dirección",
"privacy": "Política de privacidad"
```

In `messages/en/common.json` `Footer`:

```json
"contactBlock": "Contact",
"phoneLabel": "Phone",
"hoursLabel": "Hours",
"addressLabel": "Address",
"privacy": "Privacy policy"
```

- [ ] **Step 7.2: Add NAP block to footer JSX**

In `SiteFooter.tsx`, after the existing 3-column grid (Pages / Zones / Guides), insert a fourth column or replace the `lg:grid-cols-3` with `lg:grid-cols-4`:

```tsx
<div>
  <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-3">
    {t('contactBlock')}
  </p>
  <ul className="space-y-2 list-none p-0 m-0 text-zinc-500">
    <li>
      <a href={`tel:${business.contact.phone}`} className="hover:text-accent">
        {business.contact.phoneDisplay}
      </a>
    </li>
    <li>{locale === 'en' ? business.hours.displayEn : business.hours.display}</li>
    <li>{business.address.locationDisplay}</li>
  </ul>
</div>
```

- [ ] **Step 7.3: Add privacy link to `footerPageLinks`**

```tsx
{ href: '/privacidad', labelKey: 'privacy' as const },
```

- [ ] **Step 7.4: Verify**

```bash
curl -s http://localhost:3000/ | grep -E '(8769-9927|Lun–Sáb|Privacy|Privacidad)' | head -5
```
Expected: phone, hours, and privacy link all present in footer.

- [ ] **Step 7.5: Commit**

```bash
git add src/components/ui/SiteFooter.tsx messages/{es,en}/common.json
git commit -m "feat(footer): add NAP block + privacy link"
```

---

## Verification

```bash
# 1. Typecheck + lint clean
pnpm typecheck && pnpm lint

# 2. e2e regression
pnpm exec playwright test tests/e2e/page-chrome-hierarchy --project=chromium

# 3. Click depth from home to service detail = 2
curl -s http://localhost:3000/ | grep -oE 'href="/servicios/[^"]+"' | sort -u | wc -l   # expect 5

# 4. Service-detail cross-links present
curl -s http://localhost:3000/servicios/enderezado | grep -oE 'href="/guias/[^"]+"' | wc -l   # expect ≥1
curl -s http://localhost:3000/servicios/enderezado | grep -oE 'href="/zonas/[^"]+"' | wc -l   # expect 4

# 5. Guide → zones present
curl -s http://localhost:3000/guias/cuanto-cuesta-pintar-un-carro-en-costa-rica | grep -oE 'href="/zonas/[^"]+"' | wc -l   # expect 4

# 6. Zone shows 5 services
curl -s http://localhost:3000/zonas/uvita | grep -oE 'href="/servicios/[^"]+"' | sort -u | wc -l   # expect 5

# 7. Privacy route works in both locales
curl -sI http://localhost:3000/privacidad
curl -sI http://localhost:3000/en/privacidad

# 8. Footer NAP visible
curl -s http://localhost:3000/ | grep -E 'tel:\+506|Lun–Sáb|Mon–Sat'
```

## Final commit + PR

```bash
git push origin seo/05-links-privacy
gh pr create --title "seo: D — internal links + /privacidad + footer NAP" --body "Resolves home → service tile gap, service↔guide cross-links, /privacidad page, footer NAP. Verification snippets pasted below."
```
