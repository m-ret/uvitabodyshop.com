import { NextResponse } from 'next/server'
import { business } from '@/data/business'

export const runtime = 'edge'

type QuoteService =
  | 'enderezado'
  | 'pintura-completa'
  | 'retoques-pintura'
  | 'reparacion-golpes'
  | 'instalacion-accesorios'
  | 'otro'

interface QuoteRequestBody {
  name: string
  phone: string
  email?: string
  service: QuoteService
  vehicle?: string
  description: string
  photoUrls?: string[]
  preferredLanguage?: 'es' | 'en'
}

const VALID_SERVICES: readonly QuoteService[] = [
  'enderezado',
  'pintura-completa',
  'retoques-pintura',
  'reparacion-golpes',
  'instalacion-accesorios',
  'otro',
] as const

function validate(body: unknown): body is QuoteRequestBody {
  if (!body || typeof body !== 'object') return false
  const b = body as Record<string, unknown>
  if (typeof b.name !== 'string' || b.name.length < 2 || b.name.length > 80) return false
  if (typeof b.phone !== 'string' || b.phone.length < 6) return false
  if (b.email !== undefined && typeof b.email !== 'string') return false
  if (typeof b.service !== 'string' || !VALID_SERVICES.includes(b.service as QuoteService))
    return false
  if (typeof b.description !== 'string' || b.description.length < 10 || b.description.length > 2000)
    return false
  if (b.vehicle !== undefined && (typeof b.vehicle !== 'string' || b.vehicle.length > 120))
    return false
  if (b.photoUrls !== undefined) {
    if (!Array.isArray(b.photoUrls) || b.photoUrls.length > 10) return false
    if (!b.photoUrls.every((u) => typeof u === 'string' && /^https?:\/\//.test(u))) return false
  }
  if (b.preferredLanguage !== undefined && b.preferredLanguage !== 'es' && b.preferredLanguage !== 'en')
    return false
  return true
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid JSON.' }, { status: 400 })
  }

  if (!validate(body)) {
    return NextResponse.json(
      { ok: false, message: 'Invalid payload. See /.well-known/openapi.yaml.' },
      { status: 400 }
    )
  }

  const quote = body
  const serviceLabel =
    business.services.find((s) => s.slug === quote.service)?.es ?? 'Consulta general'
  const msg = [
    `Hola! Soy ${quote.name}.`,
    `Servicio: ${serviceLabel}.`,
    quote.vehicle ? `Vehículo: ${quote.vehicle}.` : null,
    `Descripción: ${quote.description}`,
    quote.photoUrls?.length ? `Fotos: ${quote.photoUrls.join(', ')}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const contactUrl = `${business.contact.whatsapp}?text=${encodeURIComponent(msg)}`

  return NextResponse.json({
    ok: true,
    message:
      quote.preferredLanguage === 'en'
        ? 'Quote request received. The shop will contact you via WhatsApp during business hours (Mon–Sat 8–5 CST).'
        : 'Solicitud recibida. El taller le contactará por WhatsApp en horario de atención (Lun–Sáb 8–5).',
    contactUrl,
  })
}

export function GET() {
  return NextResponse.json(
    {
      ok: false,
      message: 'Use POST. See /.well-known/openapi.yaml.',
    },
    { status: 405, headers: { Allow: 'POST' } }
  )
}
