---
project: Uvita Body Shop
aesthetic: automotive-premium
lineage: Tesla, Ferrari, BMW
version: 1.0
updated: 2026-04-23
---

# DESIGN.md — Uvita Body Shop

Single source of truth for the design system. Agents MUST consult this before generating UI, and enforce it in review.

The chosen direction is **Industrial Red** — dark, high-contrast, automotive-engineered. Precision over decoration. Red signals craft; the canvas stays out of the way.

---

## 1. Visual atmosphere

Dark showroom. Think Ferrari press kit, Tesla order page, BMW M heritage — not "body shop website." Every surface feels engineered: hairline grids, corner marks, mono tickers, subtle scan lines. Photography is dramatic, colorimetric, single-subject. Gradients are disciplined (red-to-black, black-to-amber — never rainbow sweeps). White space is protected; density is concentrated in data panels (specs, pricing, process steps).

**Do:** blueprint grid overlays at 4-8% opacity, single red accent pixel as "ready" indicator, mono labels with 0.3em tracking, `uppercase` display type at heavy weight.
**Don't:** glass morphism, neumorphism, pastel gradients, drop shadows softer than 4px, emoji, illustrated mascots, stock photography.

## 2. Color semantics

All tokens live in `src/styles/globals.css` (via `@theme`) and are referenced by Tailwind arbitrary values when needed.

| Role | Token | Hex | Where |
|------|-------|-----|-------|
| Canvas | `--color-canvas` | `#050505` | Page background |
| Surface-1 | `--color-surface-1` | `#0a0a0a` | Cards, modals |
| Surface-2 | `--color-surface-2` | `#111114` | Nested surfaces |
| Hairline | `--color-hairline` | `#1f1f22` | Borders, dividers (zinc-800 fallback) |
| Signature Red | `--color-red` | `#cc0000` | Primary accent, CTAs, ready-state pixels |
| Red Hot | `--color-red-hot` | `#e60000` | Hover state for red CTAs |
| Red Deep | `--color-red-deep` | `#7a0000` | Red gradients bottom stop |
| Amber Warmth | `--color-amber` | `#c4922a` | Rare tropical-accent highlight (Costa Rica lineage) |
| Text-Primary | `--color-text` | `#f4f4f5` | Body, headings |
| Text-Muted | `--color-text-muted` | `#a1a1aa` | zinc-400 — secondary copy |
| Text-Soft | `--color-text-soft` | `#71717a` | zinc-500 — metadata, footer |
| Focus Ring | `--color-focus` | `#e60000` | `:focus-visible` outline |

**Rules:**
- Only one red accent per viewport fold. A page with twelve red buttons is a page with zero red buttons.
- Amber appears once per long-scroll page max — never on the first fold.
- Text-primary on canvas yields 18.6:1 contrast — WCAG AAA. Red-on-canvas = 4.9:1 (AA large/AAA icons). Never place red text below 14px weight 500 on canvas.

## 3. Typographic hierarchy

Three families, each configured via `next/font/google` in `src/app/layout.tsx` (already wired).

| Family | Role | CSS var | Weight | Tracking |
|--------|------|---------|--------|----------|
| Bebas Neue | Display | `--font-bebas-neue` | 400 | Default |
| DM Sans | Body | `--font-dm-sans` | 400, 500, 700 | Default |
| JetBrains Mono | Labels, specs, numerals | `--font-jetbrains-mono` | 400, 500 | 0.25em–0.3em uppercase |

**Scale** (fluid, `clamp()`-driven):

- Display XL: `clamp(3rem, 8vw, 7rem)` — hero headlines, uppercase
- Display L: `clamp(2.5rem, 6vw, 5rem)` — section heads
- Display M: `clamp(2rem, 5vw, 4rem)` — sub-hero
- Heading: `clamp(1.5rem, 3vw, 2.5rem)` — card titles
- Body L: `1.125rem` / `1.75` — lead paragraphs
- Body: `1rem` / `1.625` — default
- Body S: `0.875rem` / `1.5` — supporting
- Mono Micro: `0.75rem`, uppercase, tracking `0.3em` — labels, tickers

**Rules:**
- All display type is `uppercase` unless it would force an awkward break.
- Display type uses `leading-[0.85]`. Tight and heavy.
- Mono labels ALWAYS come with a `0.25em`–`0.3em` letter-spacing.
- Never mix three family styles within a single paragraph.

## 4. Component states

Every interactive element has four explicit states. Skipping a state is a review-blocker.

| State | Treatment |
|-------|-----------|
| `:default` | Hairline border, canvas surface |
| `:hover` | Border promotes from `hairline` to `text-muted`; background lifts by 2% |
| `:focus-visible` | 2px solid `--color-red` outline offset 2px — no suppression on mouse |
| `:active` | Background shifts one surface step darker; 150ms transition |
| `:disabled` | Opacity 0.4, cursor `not-allowed`, skip all hover/active transforms |

**Buttons (primary):** red fill, white text, `uppercase`, `tracking-wide`, `py-4 px-8`, no border-radius. Hover goes `--color-red-hot`. No gradients.
**Buttons (ghost):** hairline border, `text-muted`, same dimensions. Hover border → `text-primary`.
**Links in body copy:** underline offset `4px`, decoration `--color-red`, underline thickness `1px`. Hover flips text color to red.
**Cards:** border-hairline on `surface-1` background. Hover lifts border to `text-muted` over 500ms. Optional red top-left 2.5px accent pixel when item is "ready."

## 5. Spacing system

Tailwind v4 defaults (4px base) with these anchors:

- Section padding (y): `py-16 sm:py-24 lg:py-32`
- Section padding (x): `px-6 sm:px-12 lg:px-24`
- Card padding: `p-6 sm:p-8`
- Inline gap (data rows): `gap-3`
- Grid gap: `gap-6` (mobile) → `gap-8` (desktop)
- Stack gap (paragraphs): `space-y-4`
- Headline to body: `mt-4 sm:mt-6`
- CTA to copy: `mt-8`

**Rule:** do not introduce arbitrary spacing (`mt-[27px]`). If you need a value not on the scale, discuss in a review comment first.

## 6. Shadow / elevation

Almost none. This is a flat, precision-engineered system. The only sanctioned elevations:

- **Card hover:** `box-shadow: 0 0 0 1px var(--color-text-muted)` — a brighter hairline, not a drop shadow.
- **Modal:** `0 24px 48px -12px rgba(0,0,0,0.8)` + 1px hairline.
- **Focus ring:** see Component States.

**Banned:** multi-layer soft shadows, glow effects, inner shadows, "glass" blurs.

## 7. Design constraints

| Constraint | Rule |
|-----------|------|
| Language | Spanish primary. English allowed only for technical labels or tickers (e.g., "MADE IN COSTA RICA"). |
| Currency | ₡ (Costa Rican colón) with dot thousands separator: `₡447.000`. |
| Date format | Spanish long-form: "12 de marzo, 2026". |
| Phone format | `(506) 876-9927` on page; `+5068769927` in `tel:` / `wa.me`. |
| Max content width | `max-w-6xl` for grid sections, `max-w-3xl` for prose, `max-w-5xl` for proposal blocks. |
| Media ratio | Hero `16/9` or `21/9`; cards `4/3` or `1/1`; avoid free-form crops. |
| Corner radius | **0**. No rounded corners on cards, buttons, or inputs. Square is the system. |
| Border width | `1px` for hairlines, `2px` for focus rings. No thicker. |
| Icon weight | Lucide or hand-drawn SVGs at 1.5–2px stroke. No filled icon sets. |

## 8. Responsive strategy

Mobile-first. Breakpoints follow Tailwind v4 defaults:

- `sm` (640px) — phones landscape, small tablets
- `md` (768px) — tablets portrait
- `lg` (1024px) — laptops, large tablets
- `xl` (1280px) — desktops
- `2xl` (1536px) — large displays

**Rules:**
- Hero display type must remain readable at 375px width — use `clamp()` aggressively.
- 3D scenes load at `md:` and above; mobile renders a static poster fallback (`next/image`).
- Scroll-driven motion (ScrollTrigger) is gated on `matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')`.
- Navigation collapses at `md:`. Hamburger opens a full-viewport panel (no half-drawer).
- Tap targets ≥ 44×44px on touch devices.

## 9. Agent prompt guide

When an agent receives a UI task, it MUST:

1. **Read** this file top-to-bottom and check the relevant installed skill (`frontend-design`, `awwwards-animations`, `tailwind-design-system`).
2. **State the intent** in one sentence before coding: which section of the page, which states you'll implement, which motion rules apply.
3. **Favor tokens over raw hex.** Use `text-[var(--color-red)]` if you must, but prefer Tailwind theme extensions as they land.
4. **Cite section numbers** from this doc in code comments only when the decision is non-obvious (e.g., `// Per DESIGN.md §4, focus outline must not be suppressed on mouse users`).
5. **Verify** against the design lineage. Before calling a component done, ask: "Would this pass in a Tesla order flow or a Ferrari configurator?" If no, iterate.
6. **Report deltas.** When a task requires a value not in this doc (new color, new spacing), propose it in the PR description with rationale — do not silently introduce.

**Canonical prompt for new page composition:**

> Compose [section] following DESIGN.md: canvas `#050505`, surface-1 `#0a0a0a`, hairline borders, Bebas Neue display `uppercase leading-[0.85]`, DM Sans body, JetBrains Mono labels with `0.3em` tracking `uppercase`. One red accent max per fold. No border-radius. No drop shadows. Verify focus-visible, alt text, 60fps scroll, and `prefers-reduced-motion` fallback.

---

## Appendix — archived directions

Five other directions were explored before the client chose Industrial Red. They remain as a reference library at `/home/marcelo/Work/proposal-base/uvita-bodyshop/src/app/{2..6}` and are useful when proposing alternatives for future clients. Do not import from that path — it is not on the build path.
