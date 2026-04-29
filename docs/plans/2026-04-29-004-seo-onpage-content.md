---
title: "Plan C — SEO On-Page Content + Headings + Copy"
type: refactor
status: ready
date: 2026-04-29
parent: ./2026-04-29-001-seo-fixes-master.md
branch: seo/04-content
depends_on: ./2026-04-29-002-seo-metadata-and-titles.md
---

# Plan C — On-page content + headings + AI-pattern rewrites

> Read the [master plan](./2026-04-29-001-seo-fixes-master.md) first. Plan A must be merged. Plan B is independent — can run in parallel with this one.

**Goal:** Promote FAQ questions to headings, vary service-detail H1/H2 with the service keyword, expand zone-page content from ~176 to ~450 words, rewrite home AI-pattern phrases, and clean translation parity issues.

**Architecture:** Mostly translation-file edits + small JSX shape changes (FAQ wraps `<summary>` content in `<h3>`, service-detail H1/H2 use template strings with `{service}` interpolation). Zone content depth lives in `business.zones[].localCues` arrays — expand them and add per-zone FAQ stubs.

**Tech stack:** next-intl translation JSON, no new components.

**Resolves audit findings:** Thin zone content (~176 → 450 words target), service-detail H1/H2 generic, FAQ questions buried in `<summary>`, AI writing patterns on home, EN translation parity (3 calque passages), spelling consistency, PPG mention removal.

---

## File touch list

| File | Change |
|---|---|
| `src/app/[locale]/preguntas-frecuentes/page.tsx` lines 56-63 | Wrap question text in `<h3>` inside `<summary>`. |
| `src/app/[locale]/servicios/[slug]/page.tsx` | Use translation templates for H1 (`{service} en Uvita`) and H2 keyword variants. |
| `messages/{es,en}/common.json` `ServicePage` namespace | Add keyworded H2 templates with `{service}` interpolation. |
| `src/data/business.ts` | Expand `business.zones[].localCues` with drive-time, parking, climate context. Add per-zone FAQ stubs (new `localFaqs` field). Remove PPG reference from `guides[].sections`. |
| `messages/es/home.json` + `messages/en/home.json` | Rewrite 5 AI-shaped phrases (verbatim replacements below). |
| `messages/en/pages.json` | Fix "can warranty" calque, "per rules we agree" calque. Standardize US spelling (color, not colour). |

---

## Task 1 — Promote FAQ questions to `<h3>`

**Files:**
- Modify: `src/app/[locale]/preguntas-frecuentes/page.tsx:54-65`

- [ ] **Step 1.1: Replace the items map**

Replace lines 54-65 with:

```tsx
        {items.map((f) => (
          <div key={f.q} className="border-b border-zinc-800/80">
            <details className="group">
              <summary className="cursor-pointer py-4 pr-2 list-none [&::-webkit-details-marker]:hidden">
                <h3 className="inline font-mono text-sm text-zinc-200 font-normal">{f.q}</h3>
              </summary>
              <p className="text-zinc-500 text-sm pb-4 pl-0 leading-relaxed">
                {f.a}
              </p>
            </details>
          </div>
        ))}
```

(`<h3>` inside `<summary>` is allowed; `inline` keeps the visual layout. The disclosure widget's role is preserved.)

- [ ] **Step 1.2: Verify**

```bash
curl -s http://localhost:3000/preguntas-frecuentes | grep -c '<h3'
```
Expected: 12 (one per FAQ item).

- [ ] **Step 1.3: Commit**

```bash
git add src/app/[locale]/preguntas-frecuentes/page.tsx
git commit -m "fix(faq): promote questions to h3 inside summary for proper outline"
```

---

## Task 2 — Add keyworded H2 templates to ServicePage namespace

**Files:**
- Modify: `messages/es/common.json` (`ServicePage` namespace)
- Modify: `messages/en/common.json` (`ServicePage` namespace)

- [ ] **Step 2.1: Replace the existing `ServicePage` keys**

In `messages/es/common.json`, replace the `ServicePage` block with:

```json
"ServicePage": {
  "breadcrumbServices": "Servicios",
  "h1Template": "{service} en Uvita",
  "includedTitle": "Qué incluye un servicio profesional de {service}",
  "processTitle": "Proceso de {service} paso a paso",
  "priceTitle": "Precio orientativo de {service}",
  "faqsTitle": "Preguntas frecuentes sobre {service}",
  "detailLink": "Ver detalle",
  "subtitleEn": "In English",
  "notFoundTitle": "Servicio no encontrado"
}
```

In `messages/en/common.json`:

```json
"ServicePage": {
  "breadcrumbServices": "Services",
  "h1Template": "{service} in Uvita",
  "includedTitle": "What a professional {service} job includes",
  "processTitle": "{service}: step-by-step process",
  "priceTitle": "Typical pricing for {service}",
  "faqsTitle": "FAQs about {service}",
  "detailLink": "View details",
  "subtitleEn": "In English",
  "notFoundTitle": "Service not found"
}
```

- [ ] **Step 2.2: Update the page to consume the templates**

In `src/app/[locale]/servicios/[slug]/page.tsx`, replace the H1 + the four H2s:

```tsx
// where the page renders the hero title, replace `title` with:
<PageHero title={t('h1Template', { service: title })} lede={longDescription} />

// then for each section's H2:
<h2 id="incluye" className="...">{t('includedTitle', { service: title })}</h2>
<h2 id="proceso" className="...">{t('processTitle', { service: title })}</h2>
<h2 className="...">{t('priceTitle', { service: title })}</h2>
<h2 className="...">{t('faqsTitle', { service: title })}</h2>
```

(`title` is the localized service name already computed: `locale === 'en' ? s.en : s.es`.)

- [ ] **Step 2.3: Verify**

```bash
for slug in enderezado pintura-completa retoques-pintura ; do
  echo "=== $slug ==="
  curl -s "http://localhost:3000/servicios/$slug" | grep -oE '<h[12][^>]*>[^<]+</h[12]>' | head -5
done
```
Expected: every H1 contains the service name + `en Uvita`; every H2 includes the service name (not generic "Qué incluye").

- [ ] **Step 2.4: Commit**

```bash
git add messages/es/common.json messages/en/common.json src/app/[locale]/servicios/[slug]/page.tsx
git commit -m "feat(service-detail): keyworded H1 + H2 templates with service interpolation"
```

---

## Task 3 — Expand zone content + add per-zone FAQ stubs

**Files:**
- Modify: `src/data/business.ts` (`business.zones[]` entries)

- [ ] **Step 3.1: Expand `localCues` for each zone**

For each zone (`uvita`, `dominical`, `ojochal`, `bahia-ballena`), expand `localCues` from 3-4 short lines to 8-10 specific lines covering:
- Drive time + access route from the shop
- Parking / pickup logistics on site
- Vehicle types most common in that town
- Climate/road context (humidity, salt air, gravel routes)
- Local landmarks for context

Example template for Uvita (apply same density to other 3 zones):

```ts
localCues: [
  'A 2 minutos del centro de Uvita; entrada por calle frente a la Costanera Sur.',
  'Espacio techado para hasta 4 vehículos en proceso, más bahía de pintura cerrada con horno infrarrojo.',
  'Atendemos pickups, sedanes y SUV familiares — el parque vehicular típico de Uvita y residencias de Bahía.',
  'Recogemos en hospedaje o servicio mecánico aliado dentro de Uvita centro sin costo adicional para trabajos mayores a ₡300.000.',
  'Aire salino y humedad del 80%+ requieren limpieza de masilla y curado controlado — protocolo distinto a un taller de Valle Central.',
  'Hablamos por WhatsApp para coordinar día y hora; los lunes y martes suelen tener mayor disponibilidad.',
  'Diagnóstico estructural con bancada en taller; no medimos en parqueo público.',
  'Documentamos con fotos antes/durante/después y entregamos PDF para su aseguradora si lo necesita.',
],
```

(Keep the existing tone — first-person plural, terse. Repeat the pattern with locality-specific facts for the other 3 zones. Aim for ~250 words of localCues per zone; combined with hero + related services + FAQ ≈ 450 words rendered.)

- [ ] **Step 3.2: Add per-zone FAQ stubs**

Add a new optional field to each zone entry:

```ts
localFaqs?: { q: string; a: string }[]
```

Populate 3 FAQ stubs per zone covering:
- "¿Cuánto demora un trabajo si vivo en {town}?"
- "¿Coordinan retiro o entrega en {town}?"
- "¿Hay precio diferente para clientes de {town}?"

Use the same JSON shape as `business.guides[].faqs`. Surfaced in the page in Task 4.

- [ ] **Step 3.3: Render `localFaqs` on the zone page**

In `src/app/[locale]/zonas/[zona]/page.tsx`, add a section after the related services block:

```tsx
{z.localFaqs && z.localFaqs.length > 0 && (
  <section aria-labelledby="zone-faq" className="mt-12 pt-10 border-t border-zinc-800/50">
    <h2 id="zone-faq" className="font-display text-xl uppercase mb-6 text-white">
      {locale === 'en' ? `FAQs from ${zoneName}` : `Preguntas frecuentes desde ${zoneName}`}
    </h2>
    <div className="space-y-0 border-t border-zinc-800/80">
      {z.localFaqs.map((f) => (
        <details key={f.q} className="group border-b border-zinc-800/80">
          <summary className="cursor-pointer py-4 pr-2 list-none [&::-webkit-details-marker]:hidden">
            <h3 className="inline font-mono text-sm text-zinc-200 font-normal">{f.q}</h3>
          </summary>
          <p className="text-zinc-500 text-sm pb-4 leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  </section>
)}
```

Also add the zone FAQs to the schema graph (Plan B's `extraJsonLd` array can include `buildFaqSchema(z.localFaqs)` when present).

- [ ] **Step 3.4: Verify body word count ≥400**

```bash
for zone in uvita dominical ojochal bahia-ballena ; do
  echo -n "$zone: "
  curl -s "http://localhost:3000/zonas/$zone" | python3 -c "
import sys, re
html = sys.stdin.read()
# strip nav/footer/scripts for a rough body count
body = re.search(r'<main[^>]*>(.*)</main>', html, re.S) or re.search(r'<body[^>]*>(.*)</body>', html, re.S)
text = re.sub(r'<script.*?</script>', '', body.group(1), flags=re.S)
text = re.sub(r'<style.*?</style>', '', text, flags=re.S)
text = re.sub(r'<[^>]+>', ' ', text)
words = len(re.findall(r'\w+', text))
print(f'{words} words')"
done
```
Expected: each ≥400 words.

- [ ] **Step 3.5: Commit**

```bash
git add src/data/business.ts src/app/[locale]/zonas/[zona]/page.tsx
git commit -m "feat(zonas): expand local cues + add per-zone FAQ stubs"
```

---

## Task 4 — Remove PPG mention from paint-cost guide

**Files:**
- Modify: `src/data/business.ts` (paint-cost guide section content)

- [ ] **Step 4.1: Find and edit**

In `business.guides`, locate the entry with slug `cuanto-cuesta-pintar-un-carro-en-costa-rica`. Search the `sections[]` content for "PPG" and either:
- Remove the sentence entirely, OR
- Replace with the brands actually used: "Roberlo, BESA y 3M en el sistema completo de primer, base y laca."

(Per audit Agent #9, PPG appears once and the shop never uses it — drop or contextualize.)

- [ ] **Step 4.2: Verify**

```bash
grep -c 'PPG' src/data/business.ts
```
Expected: 0.

```bash
curl -s http://localhost:3000/guias/cuanto-cuesta-pintar-un-carro-en-costa-rica | grep -c 'PPG'
```
Expected: 0.

- [ ] **Step 4.3: Commit**

```bash
git add src/data/business.ts
git commit -m "fix(guide): remove unused PPG mention from paint-cost guide"
```

---

## Task 5 — Rewrite AI-shaped phrases on home

**Files:**
- Modify: `messages/es/home.json` and `messages/en/home.json`

- [ ] **Step 5.1: Apply the 5 verbatim replacements**

In `messages/en/home.json`:

| Path | Before | After |
|---|---|---|
| `Hero.subhead` (line ~17) | "Every vehicle leaves our booth like new — or better." | "Every vehicle leaves our booth looking new. Often better." |
| `Craft.body` (line ~55) | "Nine years of hands-on experience. A controlled paint booth with infrared cure. Professional materials from Roberlo, BESA, 3M, and VICCO. Every job backed by a written warranty — because we don't cut corners." | "Nine years in the booth. Roberlo, BESA, 3M, and VICCO are what we run because that's what holds up in Uvita's salt-air humidity. Written warranty on every job." |
| `Materials.body` (line ~124) | "No shortcuts. No generic brands. Durability, accurate color, and a finish built to last." | "No shortcuts and no off-brand cans. The finish lasts because the materials do." |
| `Footer.cta` (line ~185) | "Free estimates. Call, message on WhatsApp, or complete the form. We respond within 24 hours." | "Send a photo on WhatsApp — most quotes go out the same day." |

In `messages/es/home.json` apply the matching Spanish-side rewrites for the same keys. Keep the rhythm consistent (terse, founder voice).

- [ ] **Step 5.2: Verify**

```bash
grep -c 'like new — or better' messages/en/home.json
grep -c 'or complete the form' messages/en/home.json
```
Expected: both 0.

```bash
curl -s http://localhost:3000/en | grep -c 'looking new. Often better'
```
Expected: 1.

- [ ] **Step 5.3: Commit**

```bash
git add messages/{es,en}/home.json
git commit -m "fix(copy): de-AI-ify home — break tricolons, drop em-dash chains, add concrete proof"
```

---

## Task 6 — EN translation parity pass

**Files:**
- Modify: `messages/en/pages.json`

- [ ] **Step 6.1: Fix 3 calques**

Replace these strings (locate by current text, then update):

| Current (EN file) | Replacement |
|---|---|
| "Reads damage with his hands first, his eyes second. Won't pull a panel until he's measured it." (Team.members.carlos.bio) | "Reads damage by feel before sight. He measures every panel before he pulls it." |
| "Any brand: sedans, pickups, SUVs and light commercial vehicles, within what our team and equipment can warranty." (FaqPage item) | "Any brand: sedans, pickups, SUVs and light commercial vehicles — within what our team and equipment can stand behind." |
| "...a reserved bay left empty without notice affects the queue and may change the next slot per rules we agree when confirming." (FaqPage item) | "...if you no-show a reserved bay, the next available slot will reflect the rules we agree on when we confirm." |

- [ ] **Step 6.2: Standardize spelling (US)**

Search and replace any `colour` → `color` in `messages/en/*.json` and `messages/en/service-detail.json`:

```bash
grep -rn 'colour' messages/en/
# replace each occurrence inline
```

- [ ] **Step 6.3: Verify**

```bash
grep -c 'can warranty' messages/en/pages.json
grep -c 'per rules we agree' messages/en/pages.json
grep -rn 'colour' messages/en/
```
Expected: all 0.

- [ ] **Step 6.4: Commit**

```bash
git add messages/en/pages.json messages/en/service-detail.json
git commit -m "fix(en/copy): native pass on calques + standardize US spelling"
```

---

## Verification

```bash
# 1. Typecheck + lint clean
pnpm typecheck && pnpm lint

# 2. e2e regression
pnpm exec playwright test tests/e2e/page-chrome-hierarchy --project=chromium

# 3. FAQ headings present
curl -s http://localhost:3000/preguntas-frecuentes | grep -c '<h3'   # ≥12

# 4. Service-detail H1 contains service keyword
for slug in enderezado pintura-completa retoques-pintura reparacion-golpes instalacion-accesorios ; do
  curl -s "http://localhost:3000/servicios/$slug" | grep -oE '<h1[^>]*>[^<]+</h1>'
done
# Each H1 should contain the service name + "en Uvita"

# 5. Zone word count ≥400
for zone in uvita dominical ojochal bahia-ballena ; do
  echo -n "$zone: "
  curl -s "http://localhost:3000/zonas/$zone" | python3 -c "
import sys, re
text = re.sub(r'<[^>]+>', ' ', sys.stdin.read())
print(len(re.findall(r'\w+', text)), 'words')"
done

# 6. PPG removed
grep -rn PPG src/data/business.ts messages/

# 7. AI patterns gone
grep -c 'em-dash + tricolon' messages/  # rough proxy
grep -c 'or complete the form' messages/
```

## Final commit + PR

```bash
git push origin seo/04-content
gh pr create --title "seo: C — on-page content + headings + de-AI copy" --body "Resolves thin zones, generic service H1/H2, FAQ summary-only, AI patterns, EN parity. Verification snippets pasted below."
```
