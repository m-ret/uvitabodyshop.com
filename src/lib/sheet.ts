/**
 * Optional Google Apps Script (or any JSON) webhook — ships disabled
 * without `GOOGLE_SHEET_WEBHOOK_URL`. Edge-safe `fetch` only.
 */
export async function postLeadToSheet(
  payload: unknown
): Promise<{ ok: boolean; skipped: boolean }> {
  const url = process.env.GOOGLE_SHEET_WEBHOOK_URL
  if (!url) {
    return { ok: true, skipped: true }
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    return { ok: false, skipped: false }
  }
  return { ok: true, skipped: false }
}
