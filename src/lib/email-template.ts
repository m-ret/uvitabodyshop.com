import { business } from '@/data/business'
import type { UtmPayload } from '@/lib/utm'

export type QuoteEmailPayload = {
  name: string
  phone: string
  email?: string
  serviceLabel: string
  vehicle?: string
  description: string
  photoUrls?: string[]
  utm?: UtmPayload
}

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildQuoteEmail(p: QuoteEmailPayload) {
  const subject = `Cotización web — ${p.serviceLabel} — ${p.name}`.slice(0, 200)
  const lines = [
    p.utm && Object.values(p.utm).some(Boolean)
      ? `UTM: ${JSON.stringify(p.utm)}`
      : null,
    `Nombre: ${p.name}`,
    `Teléfono: ${p.phone}`,
    p.email ? `Correo: ${p.email}` : null,
    `Servicio: ${p.serviceLabel}`,
    p.vehicle ? `Vehículo: ${p.vehicle}` : null,
    '',
    'Descripción:',
    p.description,
    p.photoUrls?.length
      ? `\nFotos (URLs): ${p.photoUrls.join(', ')}`
      : null,
  ]
    .filter(Boolean)
    .join('\n')

  const rows: [string, string][] = [
    ['Nombre', p.name],
    ['Teléfono', p.phone],
    ['Correo', p.email ?? '—'],
    ['Servicio', p.serviceLabel],
    ['Vehículo', p.vehicle ?? '—'],
  ]

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #333;font-family:sans-serif;font-size:13px;color:#999;">${esc(
          k
        )}</td><td style="padding:8px 12px;border:1px solid #333;font-family:sans-serif;font-size:13px;color:#eee;">${esc(
          v
        )}</td></tr>`
    )
    .join('')

  const utmRow =
    p.utm && Object.values(p.utm).some(Boolean)
      ? `<tr><td colspan="2" style="padding:8px 12px;border:1px solid #333;font-family:monospace;font-size:11px;color:#f87171;">${esc(
          JSON.stringify(p.utm)
        )}</td></tr>`
      : ''

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8" /></head>
<body style="background:#0a0a0a;color:#e5e5e5;padding:24px;">
<p style="font-family:sans-serif;font-size:12px;color:#888;">${esc(
    business.name
  )} · lead desde uvitabodyshop.com</p>
<table style="border-collapse:collapse;max-width:560px;" cellpadding="0" cellspacing="0">
${tableRows}${utmRow}
<tr><td colspan="2" style="padding:12px;border:1px solid #333;font-family:sans-serif;font-size:13px;white-space:pre-wrap;">${esc(
    p.description
  )}</td></tr>
</table>
</body></html>`

  return { subject, text: lines, html }
}
