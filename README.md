# Uvita Body Shop

Production website for Uvita Body Shop (Uvita, Puntarenas, Costa Rica) — automotive body, paint, and collision repair.

> **For AI agents working in this repo:** read `AGENTS.md` and `DESIGN.md` before editing any file. Those files are the binding spec. This README is a human-oriented quickstart.

## Quickstart

```bash
npm install
cp .env.example .env.local       # edit if needed
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run verify` | lint + typecheck + build (pre-push gate) |
| `npm run format` | Prettier write |
| `npm run skills` | Skills CLI (alias for `./node_modules/.bin/skills`) |
| `npm run skills:sync` | Restore skills from `skills-lock.json` |

## Project layout

```
AGENTS.md                   # universal agent instructions (required read)
CLAUDE.md                   # Claude Code addendum
DESIGN.md                   # design system spec
skills-lock.json            # pinned agent skills
.agents/skills/             # installed skills (source of truth)
.claude/skills/             # symlinks for Claude Code discovery
.claude/settings.local.json # local permissions
.github/                    # CI, PR template
src/
├── app/
│   ├── layout.tsx          # metadata + JSON-LD injection
│   ├── page.tsx            # home (single page)
│   ├── robots.ts           # robots policy (AI crawlers opted in)
│   ├── sitemap.ts          # sitemap generator
│   └── api/quote-request/  # typed POST endpoint for agent-initiated quotes
├── components/
│   ├── home/HomePage.tsx   # the site
│   ├── ui/                 # Navigation, grids, spotlight
│   └── 3d/                 # R3F scenes
├── data/
│   ├── business.ts         # canonical business facts (SEO/schema/API)
│   └── content.ts          # display content
├── hooks/                  # custom React hooks
├── lib/gsap.ts             # GSAP + ScrollTrigger setup
└── styles/                 # global styles
public/
├── llms.txt                # AI-consumer summary
├── llms-full.txt           # AI-consumer full reference
├── .well-known/
│   ├── ai-plugin.json      # AI plugin discovery manifest
│   └── openapi.yaml        # public API spec (quote-request)
└── models/                 # .glb 3D assets
```

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19 + TypeScript strict
- Tailwind CSS v4
- GSAP 3.14 + ScrollTrigger + `@gsap/react`
- Three.js 0.183 + React Three Fiber 9 + Drei 10
- React Compiler (Babel plugin)

## Agent-native surface

This project is built to be first-class citizen for AI agents — both as a workspace (coding agents iterate here) and as a consumable (external LLM agents recommend the business to users).

- **`llms.txt` / `llms-full.txt`** — plain-markdown summaries at `/llms.txt` and `/llms-full.txt`.
- **JSON-LD** — `schema.org/AutoBodyShop` + `LocalBusiness` graph injected on every page from `src/data/business.ts`.
- **OpenAPI + `ai-plugin.json`** — `/.well-known/openapi.yaml` describes the quote-request API so agents can act on a user's behalf.
- **Robots policy** — `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `CCBot`, `Applebot-Extended` all allowed.
- **Skills-lock** — 41 installed skills covering GSAP, Three.js/R3F, Awwwards motion, accessibility, Core Web Vitals, SEO, schema, Next.js App Router, Tailwind design systems, and planning/review workflows.

## Related

The exploration-phase snapshot (all 6 design directions, the proposal page, the original agents folder) lives at `/home/marcelo/Work/proposal-base/uvita-bodyshop/` as a read-only reference library.

## Contact (business)

- Phone / WhatsApp: (506) 876-9927
- Hours: Mon–Sat 8am–5pm CST (UTC−6)
- Uvita, Puntarenas, Costa Rica
