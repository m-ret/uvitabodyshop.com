'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { useSearchParams } from 'next/navigation'
import QuoteForm from '@/components/home/QuoteForm'

const SERVICES = new Set<string>([
  'enderezado',
  'pintura-completa',
  'retoques-pintura',
  'reparacion-golpes',
  'instalacion-accesorios',
  'otro',
])

type ServiceSlug =
  | 'enderezado'
  | 'pintura-completa'
  | 'retoques-pintura'
  | 'reparacion-golpes'
  | 'instalacion-accesorios'
  | 'otro'

/** Parse `#servicio-<slug>` from the current URL. JSON-LD offers point at
 * hash anchors so search engines don't index parameterized /contacto variants. */
function readHashService(): ServiceSlug | '' {
  if (typeof window === 'undefined') return ''
  const m = window.location.hash.match(/^#servicio-([a-z0-9-]+)$/i)
  if (!m) return ''
  const slug = m[1]
  return SERVICES.has(slug) ? (slug as ServiceSlug) : ''
}

function subscribeHash(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('hashchange', cb)
  return () => window.removeEventListener('hashchange', cb)
}

export default function ContactQuoteForm() {
  const searchParams = useSearchParams()
  const fromQuery = useMemo((): ServiceSlug | '' => {
    const s = searchParams.get('servicio') ?? ''
    return SERVICES.has(s) ? (s as ServiceSlug) : ''
  }, [searchParams])

  const fromHash = useSyncExternalStore<ServiceSlug | ''>(
    subscribeHash,
    readHashService,
    () => ''
  )

  const initialService = fromQuery || fromHash

  return (
    <QuoteForm
      key={initialService || 'default'}
      initialService={initialService}
    />
  )
}
