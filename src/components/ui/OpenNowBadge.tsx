'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  computeOpenNow,
  formatDisplayTime,
  UVITA_BODY_SHOP_HOURS,
  type OpenNowComputation,
} from '@/lib/hours'

function openNowLabel(
  c: OpenNowComputation,
  t: (key: string, values?: Record<string, string>) => string,
  dayShort: string[],
  locale: 'es' | 'en'
): string {
  if (c.status === 'open') return t('openNow')
  if (!c.next) return t('closed')
  const time = formatDisplayTime(c.next.openTime, locale)
  if (c.next.sameDay) return t('opensToday', { time })
  const day = dayShort[c.next.dayIndex] ?? ''
  return t('opensOtherDay', { day, time })
}

/**
 * Live open/closed badge for shop hours. Client-only to avoid SSR/CSR drift —
 * renders a neutral placeholder during hydration so layout doesn't shift.
 *
 * Recomputes every minute. No network, no external dependencies.
 */
export default function OpenNowBadge() {
  const locale = useLocale() as 'es' | 'en'
  const t = useTranslations('Hours')
  const dayShort = t.raw('dayShort') as string[]

  const [state, setState] = useState<{
    open: boolean
    label: string
  } | null>(null)

  useEffect(() => {
    const tick = () => {
      const c = computeOpenNow(UVITA_BODY_SHOP_HOURS)
      setState({
        open: c.status === 'open',
        label: openNowLabel(c, t, dayShort, locale),
      })
    }
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [t, dayShort, locale])

  if (!state) {
    return (
      <span
        aria-hidden="true"
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-600"
      >
        <span className="inline-block size-1.5 rounded-full bg-zinc-700" />
        &nbsp;
      </span>
    )
  }

  return (
    <span
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.25em] uppercase ${
        state.open ? 'text-emerald-400' : 'text-zinc-500'
      }`}
    >
      <span
        aria-hidden="true"
        className={`inline-block size-1.5 rounded-full ${
          state.open ? 'bg-emerald-400 animate-pulse' : 'bg-accent'
        }`}
      />
      {state.label}
    </span>
  )
}
