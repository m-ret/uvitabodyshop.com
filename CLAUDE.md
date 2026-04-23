# CLAUDE.md

Claude Code–specific addendum. Read `AGENTS.md` first for universal conventions — this file only covers Claude-specific behavior.

## Entry checklist

1. Read `AGENTS.md` (project rules) and `DESIGN.md` (design system) before editing any file.
2. Load the relevant skill from `.claude/skills/` before starting domain-specific work:
   - Motion / scroll → `gsap-scrolltrigger`, `gsap-performance`
   - 3D → `r3f-fundamentals` plus the sub-skill for the specific concern (shaders, lighting, etc.)
   - Design polish → `frontend-design`, `awwwards-animations`
   - Accessibility audit → `accessibility`
   - Perf audit → `core-web-vitals`, `fixing-motion-performance`
   - SEO / schema → `seo-audit`, `schema-markup`

## Subagents

Prefer spawning these for isolated work:

- `Explore` — any codebase question needing >3 searches.
- `Plan` — when the task spans multiple files and needs sequencing.
- `design-implementation-reviewer` — after UI changes; compares against `DESIGN.md`.
- `performance-oracle` — after motion/3D/animation changes.
- `security-sentinel` — before adding API routes or touching user input.
- `correctness-reviewer`, `maintainability-reviewer`, `testing-reviewer` — always-on code review triad.

## Autonomy envelope

- **Auto-run:** read files, search, lint, typecheck, install skills via the CLI, dev-server start, screenshots via built-in browser tooling.
- **Confirm first:** dependency install/remove, migration writes, any `rm -rf` beyond `.next/`, any git push, any `vercel deploy`, editing `.claude/settings.local.json`.
- **Never:** force-push to main, bypass lint/hook, commit `.env*`, delete skills-lock.json without replacement.

## Memory

Project memory lives at `~/.claude/projects/-home-marcelo-Work-uvitabodyshop-com/memory/`. Existing entries to respect:

- **GSAP reveal rule** — use `gsap.to()` + CSS initial state, not `gsap.from()`.
- **Proposal-base archive** — `/home/marcelo/Work/proposal-base/uvita-bodyshop/` is the exploration-phase snapshot; read-only from this project.
- **SSH identity** — personal repo, use `github-personal` host alias for pushes.

## Git conventions (personal, non-mira)

- Commits use conventional format: `type(scope): description`.
- Include `Co-Authored-By: Claude <noreply@anthropic.com>` in commit footers.
- Remote must be `git@github-personal:m-ret/uvitabodyshop.com.git` or HTTPS — never the UMG key.
