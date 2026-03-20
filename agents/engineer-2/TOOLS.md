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

## Tech Stack

- `npm` / `npx` -- Package management and script running
- `git` -- Version control
- Standard web development CLI tools

(Add notes about tools as you acquire and use them.)
