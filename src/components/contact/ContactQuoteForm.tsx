'use client'

import { useMemo } from 'react'
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

export default function ContactQuoteForm() {
  const searchParams = useSearchParams()
  const initialService = useMemo((): ServiceSlug | '' => {
    const s = searchParams.get('servicio') ?? ''
    if (SERVICES.has(s)) return s as ServiceSlug
    return ''
  }, [searchParams])

  return (
    <QuoteForm
      key={initialService || 'default'}
      initialService={initialService}
    />
  )
}
