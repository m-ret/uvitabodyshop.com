'use client'

import { useEffect, useState } from 'react'
import { isOpenNow, UVITA_BODY_SHOP_HOURS } from '@/lib/hours'

/**
 * Live "Abierto ahora" / "Cerrado · Abre [día] [hora]" badge. Client-only to
 * avoid SSR/CSR drift — renders a neutral placeholder during hydration so
 * layout doesn't shift.
 *
 * Recomputes every minute. No network, no external dependencies.
 */
export default function OpenNowBadge() {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(
    null
  )

  useEffect(() => {
    const tick = () => {
      const result = isOpenNow(UVITA_BODY_SHOP_HOURS)
      setState({ open: result.open, label: result.label })
    }
    tick()
    const id = window.setInterval(tick, 60_000)
    return () => window.clearInterval(id)
  }, [])

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
