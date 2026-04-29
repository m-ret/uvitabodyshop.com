---
title: "Plan E — SEO Performance + Cleanup"
type: refactor
status: ready
date: 2026-04-29
parent: ./2026-04-29-001-seo-fixes-master.md
branch: seo/06-perf-cleanup
depends_on: ./2026-04-29-002-seo-metadata-and-titles.md
---

# Plan E — Performance + author bylines + cleanup

> Read the [master plan](./2026-04-29-001-seo-fixes-master.md) first. Plan A must be merged. This plan can run in parallel with Plans B/C/D.

**Goal:** Drop LCP on `/servicios/enderezado` below 2.5s, surface dateModified + author bylines on guides, remove dead assets, dedupe `not-found.tsx`, drop the non-standard `host` directive, add the missing `aria-hidden` on decorative imagery, and remove unreachable metadata branches.

**Architecture:** Image re-encodes via ImageMagick + targeted JSX cleanups. No new dependencies. Dead-asset deletions are recoverable via `git revert`.

**Tech stack:** ImageMagick (`magick` CLI, already installed at `/usr/bin/magick`), Next.js Image, next-intl translations.

**Resolves audit findings:** C9 (LCP regression), Medium not-found dedup, dateModified + bylines (Highs from Plan B side), dead `craft.avif` (1.1 MB) + `car-hero.jpg` → AVIF, non-standard `host:` directive, `HeroCarPoster` aria, dynamic-route dead-branch metadata.

---

## File touch list

| File | Change |
|---|---|
| `public/images/services/enderezado.avif` | Re-encode to ≤350 KB |
| `public/images/craft.avif` | Delete (1.1 MB dead asset) |
| `public/car-hero.jpg` → `public/car-hero.avif` | Convert |
| `src/components/home/HomePage.tsx` line 42 | Update `<Image src="/car-hero.avif">`; add `aria-hidden` to decorative poster |
| `src/data/business.ts` | Add `dateModified: '2026-04-29'` to all 4 guides (interface change ships in Plan B) |
| `src/app/[locale]/guias/[slug]/page.tsx` | Render byline `By {author} · Updated {date}` |
| `messages/{es,en}/pages.json` GuidePage | Add `byline` template |
| `src/app/not-found.tsx` lines 6, 9 | Shorten title (drop brand suffix); remove explicit `robots` |
| `src/app/robots.ts` line 23 | Remove `host:` directive |
| `src/app/[locale]/zonas/[zona]/page.tsx`, `guias/[slug]/page.tsx`, `servicios/[slug]/page.tsx` | Remove unreachable `buildPageMetadata` blocks for not-found path |

---

## Task 1 — Re-encode `enderezado.avif`

**Files:**
- Modify (binary): `public/images/services/enderezado.avif`

- [ ] **Step 1.1: Re-encode in place from a higher-quality source**

If the original PNG/JPG source isn't checked into the repo, re-encode the existing AVIF at lower quality + downscaled width:

```bash
cd /home/marcelo/Work/uvitabodyshop.com
ls -la public/images/services/enderezado.avif   # baseline
magick public/images/services/enderezado.avif -resize "1400x>" -quality 55 public/images/services/_enderezado.avif
mv public/images/services/_enderezado.avif public/images/services/enderezado.avif
ls -la public/images/services/enderezado.avif   # confirm ≤350 KB
```

If the file is now ≤350 KB and visually acceptable, proceed. Otherwise lower quality further (`-quality 50`) or resize tighter (`-resize "1200x>"`).

- [ ] **Step 1.2: Visual smoke test**

Open `http://localhost:3000/servicios/enderezado` and confirm the hero image renders without obvious artifacts at 1440px wide.

- [ ] **Step 1.3: Commit**

```bash
git add public/images/services/enderezado.avif
git commit -m "perf(images): re-encode enderezado.avif to ≤350 KB for LCP win"
```

---

## Task 2 — Delete dead `craft.avif`

**Files:**
- Delete: `public/images/craft.avif`

- [ ] **Step 2.1: Confirm it has no live references**

```bash
grep -rn "craft.avif" src/ messages/ docs/
```
Expected: zero references after Plan A removed the `ogImage` override.

- [ ] **Step 2.2: Delete and commit**

```bash
git rm public/images/craft.avif
git commit -m "chore: remove unused craft.avif (1.1 MB dead asset)"
```

---

## Task 3 — Convert `car-hero.jpg` → AVIF

**Files:**
- Create: `public/car-hero.avif`
- Delete: `public/car-hero.jpg`
- Modify: `src/components/home/HomePage.tsx` line 42

- [ ] **Step 3.1: Convert**

```bash
cd /home/marcelo/Work/uvitabodyshop.com
magick public/car-hero.jpg -quality 60 public/car-hero.avif
ls -la public/car-hero.{jpg,avif}   # avif should be ~30-40 KB
```

- [ ] **Step 3.2: Update src + add aria-hidden**

In `src/components/home/HomePage.tsx` line ~42 (the `HeroCarPoster` component):

Before:
```tsx
<Image
  src="/car-hero.jpg"
  alt=""
  fill
  priority
  sizes="100vw"
  className="object-cover object-[72%_center] sm:object-[68%_center] opacity-95"
/>
```

After:
```tsx
<Image
  src="/car-hero.avif"
  alt=""
  aria-hidden="true"
  fill
  priority
  sizes="100vw"
  className="object-cover object-[72%_center] sm:object-[68%_center] opacity-95"
/>
```

- [ ] **Step 3.3: Delete the JPG**

```bash
git rm public/car-hero.jpg
```

- [ ] **Step 3.4: Verify**

```bash
curl -sI http://localhost:3000/car-hero.avif   # 200
curl -sI http://localhost:3000/car-hero.jpg    # 404
curl -s http://localhost:3000/ | grep -oE 'aria-hidden="true"[^>]*car-hero' | head -1
```

- [ ] **Step 3.5: Commit**

```bash
git add public/car-hero.avif src/components/home/HomePage.tsx
git commit -m "perf(home): convert car-hero to AVIF; mark decorative poster aria-hidden"
```

---

## Task 4 — Add `dateModified` to all 4 guides

**Files:**
- Modify: `src/data/business.ts` (`business.guides` entries)

> Note: the `dateModified?: string` field on `GuideEntry` ships with Plan B Task 4. If Plan B has not merged yet, add the field to the interface here as well (it's a single line addition).

- [ ] **Step 4.1: Append `dateModified` to each guide entry**

```ts
{
  slug: 'cuanto-cuesta-pintar-un-carro-en-costa-rica',
  // ... existing fields ...
  publishedIso: '2026-XX-XX',
  dateModified: '2026-04-29',
},
```

Apply to all 4 guides.

- [ ] **Step 4.2: Verify**

```bash
grep -c 'dateModified' src/data/business.ts   # expect ≥4
```

- [ ] **Step 4.3: Commit**

```bash
git add src/data/business.ts
git commit -m "chore(guides): set dateModified on all 4 guides"
```

---

## Task 5 — Render author byline on guide pages

**Files:**
- Modify: `messages/es/pages.json` `GuidePage` namespace
- Modify: `messages/en/pages.json` `GuidePage` namespace
- Modify: `src/app/[locale]/guias/[slug]/page.tsx`

- [ ] **Step 5.1: Add translation strings**

In `messages/es/pages.json` `GuidePage`:

```json
"byline": "Por {author} · Actualizado {date}"
```

In `messages/en/pages.json` `GuidePage`:

```json
"byline": "By {author} · Updated {date}"
```

- [ ] **Step 5.2: Render byline below the hero meta line**

In `src/app/[locale]/guias/[slug]/page.tsx`, find the existing `<p>` that renders `tGuide('minRead', ...)` and add immediately below:

```tsx
<p className="mt-1 text-zinc-500 font-mono text-xs">
  {tGuide('byline', {
    author: business.owner,
    date: g.dateModified ?? g.publishedIso,
  })}
</p>
```

- [ ] **Step 5.3: Verify**

```bash
curl -s http://localhost:3000/guias/cuanto-cuesta-pintar-un-carro-en-costa-rica | grep -oE 'Por Fabricio[^<]+'
curl -s http://localhost:3000/en/guias/cuanto-cuesta-pintar-un-carro-en-costa-rica | grep -oE 'By Fabricio[^<]+'
```
Expected: byline rendered with current dateModified.

- [ ] **Step 5.4: Commit**

```bash
git add messages/{es,en}/pages.json src/app/[locale]/guias/[slug]/page.tsx
git commit -m "feat(guides): render author byline + dateModified per E-E-A-T"
```

---

## Task 6 — Dedupe `not-found.tsx`

**Files:**
- Modify: `src/app/not-found.tsx:5-10`

- [ ] **Step 6.1: Replace metadata block**

Current:
```tsx
export const metadata: Metadata = {
  title: '404 — Página no encontrada · Uvita Body Shop',
  description:
    'La página que buscás no existe. Volvé al inicio o escribinos por WhatsApp.',
  robots: { index: false, follow: false },
}
```

Replace with:
```tsx
export const metadata: Metadata = {
  title: '404 — Página no encontrada',
  description:
    'La página que buscás no existe. Volvé al inicio o escribinos por WhatsApp.',
}
```

(`title.template` in `app/layout.tsx` already appends ` · Uvita Body Shop`. Next sets `noindex` automatically on the 404 route.)

- [ ] **Step 6.2: Verify**

```bash
curl -s http://localhost:3000/this-page-does-not-exist | grep -oE '<title>[^<]+</title>'   # one title, with brand suffix once
curl -s http://localhost:3000/this-page-does-not-exist | grep -oE '<meta name="robots"[^>]*>' | wc -l   # expect 1
```

- [ ] **Step 6.3: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "fix(not-found): drop double brand suffix + redundant noindex meta"
```

---

## Task 7 — Drop `host:` directive in robots.ts

**Files:**
- Modify: `src/app/robots.ts:23`

- [ ] **Step 7.1: Remove the line**

Remove the line `host: siteUrl,` from the `robots()` return.

- [ ] **Step 7.2: Verify**

```bash
curl -s http://localhost:3000/robots.txt | grep -i 'host:'
```
Expected: no output.

- [ ] **Step 7.3: Commit**

```bash
git add src/app/robots.ts
git commit -m "chore(robots): drop non-standard Host directive"
```

---

## Task 8 — Remove dead-branch metadata in dynamic routes

**Files:**
- Modify: `src/app/[locale]/zonas/[zona]/page.tsx`
- Modify: `src/app/[locale]/guias/[slug]/page.tsx`
- Modify: `src/app/[locale]/servicios/[slug]/page.tsx`

These three files contain `if (!entry) { return buildPageMetadata({...}) }` blocks that are unreachable because the page body calls `notFound()` later. Each block also currently contributes a duplicate metadata entry that Next then overrides — harmless but confusing.

- [ ] **Step 8.1: In each file, replace the not-found metadata branch with `notFound()` early-exit**

Before (in `generateMetadata`):
```tsx
if (!z) {
  return buildPageMetadata({
    locale,
    pathname: '/',
    title: 'Zona no encontrada',
    description: business.meta.descriptionEs,
    index: false,
  })
}
```

After:
```tsx
if (!z) notFound()
```

Repeat for the guide and service-detail metadata generators.

- [ ] **Step 8.2: Confirm imports**

Each file already imports `notFound` from `next/navigation`; no new import needed.

- [ ] **Step 8.3: Verify**

```bash
curl -sI http://localhost:3000/zonas/does-not-exist        # expect 404
curl -sI http://localhost:3000/guias/does-not-exist        # expect 404
curl -sI http://localhost:3000/servicios/does-not-exist    # expect 404
```

- [ ] **Step 8.4: Commit**

```bash
git add src/app/[locale]/zonas/[zona]/page.tsx src/app/[locale]/guias/[slug]/page.tsx src/app/[locale]/servicios/[slug]/page.tsx
git commit -m "chore: drop unreachable buildPageMetadata branches in dynamic routes"
```

---

## Verification

```bash
# 1. Typecheck + lint
pnpm typecheck && pnpm lint

# 2. e2e regression
pnpm exec playwright test tests/e2e/page-chrome-hierarchy --project=chromium

# 3. Asset sizes
ls -la public/images/services/enderezado.avif    # ≤350 KB
test ! -f public/images/craft.avif && echo "craft.avif removed OK"
ls -la public/car-hero.avif                       # ~30-40 KB
test ! -f public/car-hero.jpg && echo "car-hero.jpg removed OK"

# 4. Byline rendered
curl -s http://localhost:3000/guias/cuanto-cuesta-pintar-un-carro-en-costa-rica | grep -oE 'Por Fabricio[^<]+'

# 5. 404 has single robots meta + single brand suffix
curl -s http://localhost:3000/some-404-path | grep -c '<meta name="robots"'   # expect 1
curl -s http://localhost:3000/some-404-path | grep -oE '<title>[^<]+</title>'

# 6. robots has no Host directive
curl -s http://localhost:3000/robots.txt | grep -i 'host:'   # expect empty

# 7. Decorative poster has aria-hidden
curl -s http://localhost:3000/ | grep -oE 'aria-hidden="true"[^>]*car-hero' | head -1
```

Manual: run PageSpeed Insights on `/servicios/enderezado` — LCP should drop into the green (<2.5s).

## Final commit + PR

```bash
git push origin seo/06-perf-cleanup
gh pr create --title "seo: E — performance + author bylines + cleanup" --body "Resolves C9 (LCP), bylines, dead assets, not-found dedup, host directive, aria. Verification snippets pasted below."
```
