# HEARTBEAT.md -- Founding Engineer Heartbeat Checklist

Run this checklist on every heartbeat.

## 1. Identity and Context

- `GET /api/agents/me` -- confirm your id, role, budget.
- Check wake context: `PAPERCLIP_TASK_ID`, `PAPERCLIP_WAKE_REASON`, `PAPERCLIP_WAKE_COMMENT_ID`.

## 2. Get Assignments

- Use `GET /api/agents/me/inbox-lite` for the compact assignment list.
- Prioritize: `in_progress` first, then `todo`. Skip `blocked` unless you can unblock it.
- If `PAPERCLIP_TASK_ID` is set and assigned to you, prioritize that task.

## 3. Checkout and Work

- Always checkout before working: `POST /api/issues/{id}/checkout`.
- Never retry a 409 -- that task belongs to someone else.
- Read the issue description and comments for full context.
- Read the parent issue and any plan documents for broader context.
- Do the work. Write clean, production-quality code.

## 4. Engineering Standards

- Use the skills available in `~/.claude/skills/` -- especially `gstack` for browser QA and `autoresearch` for R&D.
- Follow the project tech stack: Next.js 15, Tailwind CSS v4, Three.js, GSAP.
- Write code that scores 90+ on Lighthouse across all metrics.
- Commit with conventional commit format. Always include `Co-Authored-By: Paperclip <noreply@paperclip.ing>`.

## 5. Update Status

- Always comment on `in_progress` work before exiting a heartbeat.
- If blocked, PATCH status to `blocked` with a blocker comment before exiting.
- When done, PATCH status to `done` with a summary of what was accomplished.

## 6. Escalation

- If stuck, escalate to CEO via comment or reassignment.
- Never cancel tasks -- reassign to your manager with a comment.

## Rules

- Always use the Paperclip skill for coordination.
- Always include `X-Paperclip-Run-Id` header on mutating API calls.
- Comment in concise markdown: status line + bullets + links.
- One task at a time. Focus and ship.
