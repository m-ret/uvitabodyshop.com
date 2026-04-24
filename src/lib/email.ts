import { business } from '@/data/business'
import { buildQuoteEmail, type QuoteEmailPayload } from '@/lib/email-template'

const UNOSEND_URL = 'https://api.unosend.co/emails'

/**
 * UnoSend (https://unosend.co) — edge-safe `fetch`. No-op without
 * `UNOSEND_API_KEY` + `UNOSEND_FROM` (verified domain in dashboard).
 */
export async function sendQuoteLeadEmail(
  payload: QuoteEmailPayload
): Promise<{ ok: boolean; skipped: boolean }> {
  const key = process.env.UNOSEND_API_KEY
  const from = process.env.UNOSEND_FROM
  if (!key || !from) {
    return { ok: true, skipped: true }
  }

  const { html, text, subject } = buildQuoteEmail(payload)
  const res = await fetch(UNOSEND_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [business.contact.leadEmail],
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
