'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'

/**
 * Root `<html lang>` lives in `app/layout.tsx` (single root in App Router).
 * Sync the active locale on the client after navigation between `/` and `/en`.
 */
export default function DocumentLang() {
  const locale = useLocale()

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return null
}
