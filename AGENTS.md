# AGENTS.md — Uvita Body Shop

Primary instructions for any coding agent (Claude Code, Cursor, Codex, etc.) working in this repo.

## Project identity

Production website for **Uvita Body Shop**, a 6-year-old auto body, paint, and collision repair business in Uvita (Puntarenas, Costa Rica). Owner: Fabricio Ríos Ortiz. Phone: (506) 876-9927. Hours: 8am–5pm. The site is **Spanish-first** (`es`) with a full **`en` locale** via `next-intl` (`messages/en/*`); user-facing strings should come from messages, not hardcoded, so `/en/*` stays English end-to-end. Copy still assumes a Costa Rican audience (Zona Sur) where it mentions place and process.

**Canonical aesthetic:** automotive-premium — dark cinematic surfaces, precision type, red-and-warmth accent. Reference lineage: Tesla, Ferrari, BMW. DO NOT drift toward generic "tropical business website" territory. The bar is Awwwards/SOTD-adjacent. The client is paying $90K-equivalent for this quality.

**Source of truth for business data:** `src/data/content.ts` and `src/data/business.ts`. Never hardcode phone numbers, hours, addresses, service names, or paint-brand names anywhere else.

## Tech stack

- Next.js 16 (App Router) · React 19 · TypeScript strict
- Tailwind CSS v4
- GSAP 3.14 + ScrollTrigger (via `@/lib/gsap`) + `@gsap/react`
- Three.js 0.183 + React Three Fiber 9 + Drei 10
- Babel React Compiler plugin enabled

## Commands

```bash
npm run dev         # dev server at http://localhost:3000
npm run build       # production build
npm start           # serve production build
npm run lint        # eslint
npm run typecheck   # tsc --noEmit (verify before claiming done)
```

Skills:
```bash
./node_modules/.bin/skills list       # see installed skills
./node_modules/.bin/skills find <q>   # search registry
./node_modules/.bin/skills add <pkg>  # install to this project
```

## Directory map

```
src/
  app/
    layout.tsx          # root layout — fonts, metadata, JSON-LD, html lang
    [locale]/layout.tsx # next-intl provider + segment chrome
    [locale]/page.tsx   # home at `/` (es) and `/en` — renders HomePage
    globals.css
  components/
    home/HomePage.tsx   # single canonical home page
    ui/                 # Navigation, ReactiveGrid, HeroSpotlight
    3d/                 # CarPaintScene, SprayParticleScene (R3F)
  data/
    content.ts          # display content (services, process, brands)
    business.ts         # structured business data for SEO / schema
  lib/
    gsap.ts             # GSAP + ScrollTrigger registration
  hooks/                # custom React hooks
  styles/               # shared styles
public/
  models/               # .glb 3D assets
  llms.txt              # AI-consumer summary
  llms-full.txt         # AI-consumer full content
  robots.txt            # (served via app/robots.ts)
```

There is only one design direction in this project. The exploration-phase directions 2-6 live at `/home/marcelo/Work/proposal-base/uvita-bodyshop/` as a read-only reference.

## Golden rules

1. **Spanish-first, bilingual UI.** Default locale is `es`; English is a first-class `en` route via `next-intl`. User-facing strings belong in `messages/es/*` and `messages/en/*` — not hardcoded in components. Placeholder or marketing copy should still read naturally for the Costa Rican market in Spanish, and read as professional shop English in `en`, not machine-translated filler.
2. **Dark canvas, red signature.** Base `#050505` with `#cc0000` as the primary accent. See `DESIGN.md` for the full token set.
3. **Motion has a reason.** Every animation must serve attention, emphasis, or continuity — not decoration. Respect `prefers-reduced-motion`.
4. **GSAP reveal pattern (critical).** Never use `gsap.from()` with ScrollTrigger for opacity reveals — the initial style flashes visible before hydration. Use CSS initial state (`opacity: 0`) + `gsap.to({ opacity: 1 })`.
5. **Business data is derived, not duplicated.** Import from `src/data/business.ts` for any number, service, brand, or contact detail. Editing these in multiple places is a bug.
6. **Accessibility is not optional.** WCAG 2.1 AA. Keyboard navigable. Alt text on every image. Proper landmark roles. Focus visible. Check with `accessibility` skill before claiming done.
7. **Perf budget.** LCP < 2.5s on fast-3G. CLS < 0.1. INP < 200ms. Total JS for the landing route < 250KB gzip. Use the `core-web-vitals` skill to audit.
8. **No inline SVG islands.** Extract to `components/ui/icons/*.tsx` once the count grows past two.
9. **3D performance.** Dynamic-import all R3F scenes via `next/dynamic` with `ssr: false` and a sensible skeleton. Use `drei`'s `Preload` and `Bounds`. Keep triangle count < 100k for hero scenes.
10. **No AI slop.** No generic placeholder words ("lorem ipsum", "Your Trusted Partner", "Welcome to our website"). Every word is a chance to sell the craft.

## Installed skills (41 total)

| Domain | Skills |
|--------|--------|
| GSAP | gsap-core, gsap-scrolltrigger, gsap-timeline, gsap-plugins, gsap-performance, gsap-react, gsap-frameworks, gsap-utils |
| Three.js | threejs-fundamentals, -animation, -shaders, -geometry, -lighting, -materials, -textures, -loaders, -interaction, -postprocessing |
| React Three Fiber | r3f-fundamentals, -animation, -geometry, -lighting, -materials, -textures, -loaders, -interaction, -physics, -postprocessing, -shaders |
| Awwwards-style motion | awwwards-animations, fixing-motion-performance |
| Design quality | frontend-design, tailwind-design-system |
| Next.js | nextjs-app-router-patterns |
| Quality gates | accessibility, core-web-vitals, webapp-testing |
| SEO | seo-audit, schema-markup |
| Planning | writing-plans, executing-plans, requesting-code-review |
| Meta | find-skills |

Consult the relevant skill before touching code in its domain. They encode conventions, gotchas, and performance rules.

## Before declaring work done

1. `npm run lint` — zero errors.
2. `npm run typecheck` — zero errors.
3. `npm run build` — succeeds.
4. Open `http://localhost:3000` and verify the change in-browser.
5. For motion/3D changes: record a ~5s screen capture and confirm 60fps in DevTools perf.
6. For data changes: verify JSON-LD still parses in https://search.google.com/test/rich-results.

## What not to do

- Do not add a new design direction or parallel route (`/1`, `/2`…). There is one site now.
- Do not reintroduce the old `agents/` persona folder pattern (ceo/engineer-2/…) — that was exploration-phase scaffolding, explicitly replaced.
- Do not commit `.env*`, `.next/`, `.vercel/`, `node_modules/`, or `tsconfig.tsbuildinfo`.
- Do not add dependencies without a written reason in the PR description.
- Do not "improve" adjacent code that isn't part of the task.
- Do not remove or rename skills — edit `skills-lock.json` only through the skills CLI.
