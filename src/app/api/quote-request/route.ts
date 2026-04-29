import { NextResponse } from 'next/server'
import { business } from '@/data/business'
import { sendQuoteLeadEmail } from '@/lib/email'
import { postLeadToSheet } from '@/lib/sheet'
import {
  checkRateLimit,
  getClientIp,
  isAllowedOrigin,
  isDwellTooShort,
  isHoneypotTriggered,
  smellsLikeSpam,
} from '@/lib/spam-guard'
import { formatUtmForMessage, type UtmPayload } from '@/lib/utm'

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
  utm?: UtmPayload
  /** Honeypot — must be empty/missing for real users. */
  website?: string
  /** Milliseconds between form mount and submit; bots submit instantly. */
  formDwellMs?: number
}

const VALID_SERVICES: readonly QuoteService[] = [
  'enderezado',
  'pintura-completa',
  'retoques-pintura',
  'reparacion-golpes',
  'instalacion-accesorios',
  'otro',
] as const

function isUtmValue(v: unknown): v is UtmPayload | undefined {
  if (v === undefined) return true
  if (v === null) return true
  if (typeof v !== 'object' || v === null) return false
  const o = v as Record<string, unknown>
  const keys: (keyof UtmPayload)[] = [
    'source',
    'medium',
    'campaign',
    'content',
    'term',
  ]
  for (const k of keys) {
    const x = o[k as string]
    if (x === undefined) continue
    if (typeof x !== 'string' || x.length > 200) return false
  }
  return true
}

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
  if (!isUtmValue(b.utm)) return false
  if (b.website !== undefined && (typeof b.website !== 'string' || b.website.length > 200))
    return false
  if (b.formDwellMs !== undefined && typeof b.formDwellMs !== 'number') return false
  return true
}

/** Localized fake-success body — used for silent rejects so bots can't probe. */
function fakeSuccess(language: 'es' | 'en' | undefined) {
  return {
    ok: true,
    message:
      language === 'en'
        ? 'Quote request received. The shop will contact you via WhatsApp during business hours (Mon–Sat 8–5 CST).'
        : 'Solicitud recibida. El taller le contactará por WhatsApp en horario de atención (Lun–Sáb 8–5).',
  }
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { ok: false, message: 'Forbidden.' },
      { status: 403 }
    )
  }

  const ip = getClientIp(request)
  const rl = checkRateLimit(ip)
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, message: 'Too many requests.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000))),
        },
      }
    )
  }

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

  if (
    isHoneypotTriggered(quote.website) ||
    isDwellTooShort(quote.formDwellMs) ||
    smellsLikeSpam(quote.description, quote.name, quote.vehicle)
  ) {
    return NextResponse.json(fakeSuccess(quote.preferredLanguage))
  }
  const serviceLabel =
    business.services.find((s) => s.slug === quote.service)?.es ?? 'Consulta general'

  const utmLine = formatUtmForMessage(quote.utm)
  const msg = [
    utmLine,
    `Hola! Soy ${quote.name}.`,
    `Servicio: ${serviceLabel}.`,
    quote.vehicle ? `Vehículo: ${quote.vehicle}.` : null,
    `Descripción: ${quote.description}`,
    quote.photoUrls?.length ? `Fotos: ${quote.photoUrls.join(', ')}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  const contactUrl = `${business.contact.whatsapp}?text=${encodeURIComponent(msg)}`

  const emailPayload = {
    name: quote.name,
    phone: quote.phone,
    email: quote.email,
    serviceLabel,
    vehicle: quote.vehicle,
    description: quote.description,
    photoUrls: quote.photoUrls,
    utm: quote.utm,
  }

  const sheetPayload = {
    ...emailPayload,
    service: quote.service,
    receivedAt: new Date().toISOString(),
  }

  const [emailRes, sheetRes] = await Promise.all([
    sendQuoteLeadEmail(emailPayload),
    postLeadToSheet(sheetPayload),
  ])

  void emailRes
  void sheetRes

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
