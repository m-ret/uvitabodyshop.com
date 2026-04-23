import { business } from '@/data/business'
import { renderOgImage } from './_og-image'

export const runtime = 'nodejs'
export const alt = `${business.name} — ${business.meta.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return renderOgImage()
}
