/** First-party attribution cookie — 90-day TTL, set by `UtmCapture`. */
export const UTM_COOKIE = 'ubs_utm'

export type UtmPayload = {
  source?: string
  medium?: string
  campaign?: string
  content?: string
  term?: string
}

export function parseUtmFromSearchParams(search: string): UtmPayload {
  const params = new URLSearchParams(search)
  const out: UtmPayload = {}
  const u = (k: keyof UtmPayload, v: string) => {
    if (v) out[k] = v
  }
  u('source', params.get('utm_source') ?? '')
  u('medium', params.get('utm_medium') ?? '')
  u('campaign', params.get('utm_campaign') ?? '')
  u('content', params.get('utm_content') ?? '')
  u('term', params.get('utm_term') ?? '')
  return out
}

/**
 * Serializes UTM for the first line of a WhatsApp / email body.
 * Example: `[utm_source=google utm_campaign=verano]`
 */
export function formatUtmForMessage(utm: UtmPayload | undefined): string | null {
  if (!utm) return null
  const parts = Object.entries(utm)
    .filter(([, v]) => v)
    .map(([k, v]) => `utm_${k}=${v}`)
  if (parts.length === 0) return null
  return `[${parts.join(' ')}]`
}

/** Client-only: read persisted UTM JSON from `document.cookie`. */
export function readUtmCookieClient(): UtmPayload | undefined {
  if (typeof document === 'undefined') return undefined
  const m = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${UTM_COOKIE}=([^;]+)`)
  )
  if (!m?.[1]) return undefined
  try {
    const parsed = JSON.parse(decodeURIComponent(m[1])) as unknown
    if (!parsed || typeof parsed !== 'object') return undefined
    return parsed as UtmPayload
  } catch {
    return undefined
  }
}
