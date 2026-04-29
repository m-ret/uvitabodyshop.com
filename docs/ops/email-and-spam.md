# Email delivery (Unosend) and spam protection

How quote-form submissions reach Fabricio's inbox, and how the public POST endpoint is hardened against bots.

## Pipeline

```
Visitor fills /contacto form
  → POST /api/quote-request                  (src/app/api/quote-request/route.ts)
  → spam guards                              (src/lib/spam-guard.ts)
  → sendQuoteLeadEmail() via Unosend HTTP API (src/lib/email.ts)
  → DKIM-signed by Unosend with d=uvitabodyshop.com, selector "unosend"
  → Gmail receives, checks SPF + DKIM + DMARC
  → Lands in CONTACT_INBOX
```

In parallel, the route also fires `postLeadToSheet` (see `google-sheet-webhook.md`) and returns a WhatsApp deep-link in `contactUrl` for the visitor's confirmation step.

## DNS records on uvitabodyshop.com

All four are required. Configure on Vercel DNS (the domain is on `ns1/2.vercel-dns.com`).

| Type | Name | Value | Why |
|------|------|-------|-----|
| TXT | `unosend._domainkey` | `v=DKIM1; k=rsa; p=...` (long key from Unosend dashboard) | DKIM public key. Unosend signs outgoing mail with the matching private key + selector `unosend`; receivers verify the signature using this record. |
| MX  | `send` | `mail.unosend.co` priority 10 | Inbound bounce/feedback handling for `bounce-*@send.uvitabodyshop.com`. |
| TXT | `send` | `v=spf1 include:_spf.unosend.co ~all` | SPF for the bounce subdomain. |
| TXT | `@` (apex) | `v=spf1 include:_spf.unosend.co ~all` | **Critical.** Unosend uses the apex domain as envelope-from when sending, so Gmail evaluates SPF here — not on `send.`. Without this, Gmail bounces with "Sender unauthenticated." |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine; rua=mailto:postmaster@unosend.co; pct=100` | DMARC alignment policy. Quarantine (not reject) so legit mail with transient auth issues doesn't disappear. |

> **Apex SPF gotcha.** Unosend's onboarding UI publishes SPF only on the `send.` subdomain, but their actual sending pipeline uses the apex domain in the SMTP `MAIL FROM`. Gmail derives the SPF check domain from `MAIL FROM`, so it looks at the apex. If apex SPF is missing, every send to Gmail bounces with `SPF [uvitabodyshop.com] = did not pass`. Always publish on apex too.

Verify with:

```sh
dig TXT uvitabodyshop.com +short              # apex SPF must include _spf.unosend.co
dig TXT unosend._domainkey.uvitabodyshop.com +short
dig MX  send.uvitabodyshop.com +short
dig TXT _dmarc.uvitabodyshop.com +short
```

## Environment variables

Set on Vercel for **all three environments** (Production, Preview, Development):

| Var | Example | Purpose |
|-----|---------|---------|
| `UNOSEND_API_KEY` | `un_HLJI0HKX...` | Bearer token for `POST https://api.unosend.co/emails`. |
| `UNOSEND_FROM` | `Uvita Body Shop <noreply@uvitabodyshop.com>` | Visible From header. **Must be on the apex domain** (the `send.` subdomain is not a verified sender, only a Return-Path host). |
| `CONTACT_INBOX` | `fabri.rios31@gmail.com` | Recipient. Resolved at send time so the inbox can be rotated without a redeploy. Falls back to `business.contact.leadEmail`. |

Unset `UNOSEND_API_KEY` or `UNOSEND_FROM` to make `sendQuoteLeadEmail` a no-op (used in CI / preview where you don't want real sends).

## Common operations

### Rotate the API key

```sh
vercel env rm  UNOSEND_API_KEY production && \
vercel env add UNOSEND_API_KEY production    # paste new key when prompted
# Repeat for preview + development.
vercel redeploy <latest-prod-deployment-url> --target production
```

### Change the recipient

```sh
vercel env rm  CONTACT_INBOX production && \
vercel env add CONTACT_INBOX production      # paste new email
# Repeat for preview + development. Redeploy.
```

No code change required — `email.ts` reads `process.env.CONTACT_INBOX` per request.

### Clear a suppressed recipient

After 1 hard bounce, Unosend marks the address as suppressed and rejects further sends with `"recipient ... is suppressed"`. To clear:

```sh
# List suppressions to find the id
curl -s https://api.unosend.co/suppressions \
  -H "Authorization: Bearer $UNOSEND_API_KEY"

# Delete by id
curl -X DELETE https://api.unosend.co/suppressions/<id> \
  -H "Authorization: Bearer $UNOSEND_API_KEY"
```

Or use the **Suppressions** tab in the Unosend dashboard.

### Inspect a specific message

```sh
curl -s "https://api.unosend.co/events?email_id=<msg-id>" \
  -H "Authorization: Bearer $UNOSEND_API_KEY"
```

Returns delivery status, bounce reason (full SMTP error from Gmail), open + click events.

## Spam protection

Layered, server-side, in `src/lib/spam-guard.ts`. Applied by `/api/quote-request` before any email send. Rationale: the form is the only public POST surface; one solid guard layer is enough so we keep it inline rather than middleware-ifying it.

| Layer | Bot class caught | Response |
|-------|------------------|----------|
| **Origin allowlist** | Scripts hitting the API directly without a browser | `403 Forbidden` |
| **Per-IP rate limit** (5/hour) | Burst attackers from one address | `429 Too Many Requests` + `Retry-After` header |
| **Honeypot field** (`website`, visually hidden) | Form-fillers that complete every input | Silent `200 ok:true` (no email, no `contactUrl`) |
| **Min dwell time** (≥2.5 s between mount and submit) | Headless bots that submit instantly | Silent `200` |
| **Content patterns** (Cyrillic, CJK, Hebrew, Arabic, payday/casino keywords, link-stuffing) | Multilingual spam payloads | Silent `200` |

The first two (origin + rate limit) return real HTTP errors because legitimate clients may want to surface them. The last three (honeypot, dwell, content) return a *fake* success so bots can't probe to learn which signal tripped them.

Allowed origins: `uvitabodyshop.com`, `www.uvitabodyshop.com`, any `*.vercel.app` preview, and `localhost:*` in development.

State (rate-limit Map) lives in-process per edge instance — best-effort, not a strict global cap. Fine for low-traffic; switch to Vercel KV / Upstash if abuse volume ever justifies it.

### Smoke tests

Curl the route on a fresh deploy to verify each layer is wired:

```sh
HOST=https://www.uvitabodyshop.com

# 1. No Origin → 403
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" -d '{}' $HOST/api/quote-request

# 2. Wrong Origin → 403
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: application/json" -H "Origin: https://evil.example.com" -d '{}' $HOST/api/quote-request

# 3. Honeypot filled → 200 silent (no contactUrl)
curl -s -X POST -H "Content-Type: application/json" -H "Origin: $HOST" \
  -d '{"name":"x","phone":"+506 8888 0000","service":"enderezado","description":"x x x x x x x x x","website":"trip","formDwellMs":4000}' \
  $HOST/api/quote-request

# 4. Dwell too short → 200 silent
curl -s -X POST -H "Content-Type: application/json" -H "Origin: $HOST" \
  -d '{"name":"x","phone":"+506 8888 0000","service":"enderezado","description":"x x x x x x x x x","formDwellMs":500}' \
  $HOST/api/quote-request

# 5. Cyrillic content → 200 silent
curl -s -X POST -H "Content-Type: application/json" -H "Origin: $HOST" \
  -d '{"name":"Иван","phone":"+506 8888 0000","service":"enderezado","description":"Здравствуйте","formDwellMs":5000}' \
  $HOST/api/quote-request
```

## Troubleshooting

**"domain not verified" (400 from Unosend on send).** The From address is on `send.uvitabodyshop.com` instead of the apex. Switch `UNOSEND_FROM` to `noreply@uvitabodyshop.com`.

**Gmail bounce: "Sender unauthenticated. SPF [uvitabodyshop.com] = did not pass."** Apex SPF is missing. Add a TXT record on `@` with `v=spf1 include:_spf.unosend.co ~all`.

**Gmail bounce: "Unusual rate of unsolicited mail from your IP Netblock."** Unosend's shared IP range is reputation-throttled by Gmail because of other tenants. Usually clears in <24 h. If it recurs, switch transactional provider (Resend, Postmark) or contact Unosend support for an IP move.

**Unosend "recipient is suppressed".** Address auto-added after a hard bounce. Clear via API or dashboard (see *Common operations*).

**No email arriving but no bounce either.** Check Gmail's Promotions tab and Spam folder — new sender domains accumulate reputation slowly. Have the recipient mark "Not spam" and add the sender to contacts to accelerate.
