'use client'

import { track as vercelTrack } from '@vercel/analytics'

/**
 * Known conversion event names. Keep in sync with docs/analytics-events.md.
 */
export type AnalyticsEvent =
  | 'contact_whatsapp'
  | 'contact_phone'
  | 'quote_submit'
  | 'quote_error'
  | 'scene_fallback'

type AllowedPropValue = string | number | boolean | null

/**
 * Thin wrapper over `@vercel/analytics`. Respects Do-Not-Track and is safe
 * to call before hydration — it no-ops on the server and short-circuits if
 * the browser signals DNT.
 *
 * Keep call-sites decoupled from the vendor so we can swap later.
 */
export function track(
  event: AnalyticsEvent,
  props?: Record<string, AllowedPropValue>
): void {
  if (typeof window === 'undefined') return
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return
  try {
    vercelTrack(event, props)
  } catch {
    // Analytics failures must never break the page.
  }
}
