# Deploy runbook — uvitabodyshop.com

Operational checklist for taking the site live at `https://uvitabodyshop.com` on Vercel and for rolling back if anything goes wrong. Code is deploy-ready; the steps below are manual because they touch a paid platform and DNS.

## Pre-flight

- [ ] **Confirm domain ownership with client.** Ask Fabricio who registered `uvitabodyshop.com`. Registrar + account login or DNS admin access must be available before the cutover window starts.
- [ ] Verify `main` is green on CI (verify + e2e + lighthouse jobs).
- [ ] Verify `npm run verify` and `npm run test:e2e` pass locally against the branch being deployed.

## First-time Vercel setup

1. Log in to Vercel with the shared account.
2. **New Project** → import `m-ret/uvitabodyshop.com` from GitHub.
3. Framework preset: **Next.js** (auto-detected). Root: `.`.
4. **Environment variables** (Production scope — repeat for Preview + Development):
   - `NEXT_PUBLIC_SITE_URL=https://uvitabodyshop.com`
   - `UNOSEND_API_KEY` — see [docs/ops/email-and-spam.md](./ops/email-and-spam.md)
   - `UNOSEND_FROM=Uvita Body Shop <noreply@uvitabodyshop.com>`
   - `CONTACT_INBOX=fabri.rios31@gmail.com`
   - Optional: `GOOGLE_SHEET_WEBHOOK_URL` — see [docs/ops/google-sheet-webhook.md](./ops/google-sheet-webhook.md)
5. Deploy to preview branch first — confirm the preview URL works end-to-end (hero loads, quote form posts, WhatsApp link opens, 404 + error routes render).
6. **Domains** tab → Add `uvitabodyshop.com` and `www.uvitabodyshop.com`.
7. Vercel prints two DNS records. At the registrar, set:
   - `A` record for the apex (`@`) → the IP Vercel provides.
   - `CNAME` record for `www` → `cname.vercel-dns.com`.
8. Wait for DNS + SSL provisioning (usually <5 min, up to 24 h).
9. Confirm `curl -I https://uvitabodyshop.com` returns `200` with a valid SSL cert (no `self-signed` warnings).

## Post-deploy smoke test

Run immediately after the cutover, before telling the client.

| Check | How |
|-------|-----|
| Home loads | `curl -I https://uvitabodyshop.com` → 200 `text/html` |
| OG image renders | Open <https://opengraph.xyz> and paste the URL; confirm the image is the brand mark + Spanish tagline |
| Rich Results Test | <https://search.google.com/test/rich-results?url=https://uvitabodyshop.com> must report `AutoBodyShop` + `LocalBusiness` without errors |
| Quote form | Fill it in a real browser, submit, confirm redirect to WhatsApp with the prefilled Spanish message, **and** confirm an email lands in `CONTACT_INBOX` (see [email runbook](./ops/email-and-spam.md)) |
| Spam guards | Run the smoke-test curls from [docs/ops/email-and-spam.md](./ops/email-and-spam.md) — origin + rate-limit + honeypot + dwell + content paths |
| Robots / sitemap / llms.txt | All 200 with expected content types |
| 404 page | Hit `/this-does-not-exist`, see the custom canvas-bg 404 |
| Analytics | From Vercel dashboard → Analytics → Events: a `contact_whatsapp` and a `quote_submit` event should appear within 2 minutes of triggering them |

If any smoke check fails, **roll back immediately** (see below) and debug on preview.

## Rollback

Vercel keeps every deployment forever. From the Vercel dashboard:

1. Project → **Deployments** → find the previous known-good deployment.
2. Menu (`…`) → **Promote to production**.
3. Production traffic switches in <30 seconds.

Or from the CLI (if installed):

```sh
vercel rollback
# Select the previous deployment interactively.
```

## First 48 hours — monitoring

- **Vercel Web Analytics dashboard.** Watch for: any `quote_submit` (expected ≥ 1 within 48h per success metrics), `quote_error` spikes, unexpected drops in pageviews.
- **Vercel Function Logs** for `/api/quote-request`. Rate of 4xx / 5xx should be near-zero. If `quote_error` fires with `reason=server`, check the function logs for validation-vs-runtime errors.
- **Rich Results Test.** Re-run every 12 h until Google reports the site indexed and eligible for rich results.
- **Open graph previews** on Facebook Sharing Debugger and Twitter Card Validator — at least one successful preview each.

## Known follow-ups (out of scope for launch)

- Real shop photography (R3, R17) — swap service images and populate `business.gallery` as client delivers assets.
- Client-provided Facebook / Instagram URLs — populate `business.socialLinks` and the footer + JSON-LD `sameAs` will flip automatically.
- Error monitoring (R20, deferred) — add Sentry/Highlight when volume justifies the cost.
- Flip `lighthouse` CI job to `continue-on-error: false` after three consecutive green runs on `main`.

## Escalation

- Client communication: Fabricio via WhatsApp (same number the site advertises).
- Vercel billing / account: check registered emails.
- Domain registrar: see "Pre-flight" — captured once we confirm ownership.
