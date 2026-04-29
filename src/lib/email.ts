import { business } from '@/data/business'
import { buildQuoteEmail, type QuoteEmailPayload } from '@/lib/email-template'

const UNOSEND_URL = 'https://api.unosend.co/emails'

/**
 * UnoSend (https://unosend.co) — edge-safe `fetch`. No-op without
 * `UNOSEND_API_KEY` + `UNOSEND_FROM` (verified domain in dashboard).
 * Recipient resolved from `CONTACT_INBOX` env var, falling back to
 * `business.contact.leadEmail` so the inbox can be rotated without redeploy.
 */
export async function sendQuoteLeadEmail(
  payload: QuoteEmailPayload
): Promise<{ ok: boolean; skipped: boolean }> {
  const key = process.env.UNOSEND_API_KEY
  const from = process.env.UNOSEND_FROM
  if (!key || !from) {
    return { ok: true, skipped: true }
  }
  const to = process.env.CONTACT_INBOX || business.contact.leadEmail

  const { html, text, subject } = buildQuoteEmail(payload)
  const res = await fetch(UNOSEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
      text,
      tracking: { open: false, click: false },
    }),
  })

  if (!res.ok) {
    return { ok: false, skipped: false }
  }
  return { ok: true, skipped: false }
}
