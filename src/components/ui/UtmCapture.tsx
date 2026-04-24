'use client'

import { useEffect } from 'react'
import { parseUtmFromSearchParams, UTM_COOKIE, type UtmPayload } from '@/lib/utm'

const MAX_AGE = 90 * 24 * 60 * 60

function setUtmCookie(utm: UtmPayload) {
  if (Object.keys(utm).length === 0) return
  const value = encodeURIComponent(JSON.stringify(utm))
  if (typeof document === 'undefined') return
  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:'
      ? '; Secure'
      : ''
  document.cookie = `${UTM_COOKIE}=${value}; path=/; max-age=${MAX_AGE}; SameSite=Lax${secure}`
}

/**
 * On full page load, if the URL has standard `utm_*` params, persist
 * them in a first-party cookie for quote attribution and WA message text.
 */
export default function UtmCapture() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const next = parseUtmFromSearchParams(window.location.search)
    if (Object.keys(next).length > 0) {
      setUtmCookie(next)
    }
  }, [])

  return null
}
