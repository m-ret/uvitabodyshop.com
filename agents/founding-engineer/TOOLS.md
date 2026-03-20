# Tools

## gstack -- AI Engineering Workflow

Your primary engineering toolkit. These are skills you MUST use throughout your workflow:

| Skill | When to use |
|-------|-------------|
| `/office-hours` | Before starting a new feature. Reframes the product idea. |
| `/plan-ceo-review` | Get CEO-level review of your plan before building. |
| `/plan-eng-review` | Lock architecture, data flow, edge cases, and tests. |
| `/plan-design-review` | Rate each design dimension 0-10, see what a 10 looks like. |
| `/design-consultation` | Build a complete design system from scratch. |
| `/review` | Pre-landing PR review. Finds bugs that CI misses. |
| `/investigate` | Systematic root-cause debugging. No fixes without investigation. |
| `/design-review` | Design audit + fix loop with atomic commits. |
| `/qa` | Open a real browser, find bugs, fix them, re-verify. |
| `/qa-only` | Same browser QA but report-only, no code changes. |
| `/ship` | Run tests, review, push, open PR. One command. |
| `/document-release` | Update all docs to match what you just shipped. |
| `/browse` | Headless browser for any URL interaction (~100ms/command). |
| `/setup-browser-cookies` | Import cookies for authenticated testing. |
| `/careful` | Warn before destructive commands. |

**Required workflow:** For every feature task, use `/plan-eng-review` before coding, `/review` before committing, `/qa` after implementing, and `/ship` to land it.

## Design & Frontend Skills -- MANDATORY

You MUST load and follow these skills when building any UI, page, or visual component. They are installed in ~/.claude/skills/ and available as slash commands. Using them is NOT optional.

| Skill | When to use | How to invoke |
|-------|-------------|---------------|
| `/premium-frontend-design` | **EVERY page build.** Award-winning cinematic interfaces. WebGL, shaders, premium animations. NO generic AI slop. | Before writing any component |
| `/frontend-design` | Production-grade frontend interfaces with high design quality. | When building any web component |
| `/awwwards-animations` | GSAP, Motion, Anime.js, Lenis. 60fps scroll experiences, parallax, text animations, reveal effects. | When implementing any animation |
| `/design-consultation` | Full design system: typography, colors, spacing, motion. Creates DESIGN.md. | Before starting visual design |
| `/copywriting` | Marketing copy for homepage, landing pages, CTAs. | When writing any user-facing text |
| `/seo` | Meta tags, structured data, sitemap, search optimization. | When building any public page |
| `/accessibility` | WCAG 2.1 audit and compliance. | After building any page |
| `/best-practices` | Security, compatibility, code quality. | Before shipping |
| `/core-web-vitals` | LCP, INP, CLS optimization. | After building any page |
| `/performance` | Page speed, load time, bundle optimization. | Before shipping |
| `/web-quality-audit` | Full Lighthouse-style audit. | Before shipping |
| `/tailwind-design-system` | Design tokens, component patterns, responsive. | When setting up design system |
| `/brainstorming` | Explore intent, requirements, and design before implementation. | Before any creative work |

### Design Skill Loading Protocol

**Before building ANY visual component or page:**
1. Load `/premium-frontend-design` -- read it, follow it
2. Load `/awwwards-animations` -- for scroll and motion patterns
3. Load `/frontend-design` -- for production-grade UI patterns
4. If writing copy: load `/copywriting`
5. If first design: load `/design-consultation` and create DESIGN.md first

**The bar is Awwwards/FWA quality.** Every page must look like it costs $90K. No generic templates. No stock layouts. No AI slop aesthetics.

## autoresearch -- R&D Lab

Autonomous research agent. Use for competitive research, technical exploration, and design inspiration gathering.

## Tech Stack

- `npm` / `npx` -- Package management and script running
- `git` -- Version control
- Next.js 16, React 19, Tailwind CSS v4, Three.js, GSAP, TypeScript
- Standard web development CLI tools
