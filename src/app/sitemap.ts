import type { MetadataRoute } from 'next'
import { business, siteUrl } from '@/data/business'
import { pathnameWithLocale } from '@/lib/metadata'
import { routing } from '@/i18n/routing'

const staticPaths: {
  path: string
  priority: number
  change: MetadataRoute.Sitemap[0]['changeFrequency']
}[] = [
  { path: '/', priority: 1, change: 'weekly' },
  { path: '/sobre-nosotros', priority: 0.8, change: 'monthly' },
  { path: '/contacto', priority: 0.9, change: 'weekly' },
  { path: '/servicios', priority: 0.9, change: 'weekly' },
  { path: '/preguntas-frecuentes', priority: 0.7, change: 'monthly' },
  { path: '/garantia', priority: 0.6, change: 'yearly' },
]

function withLocales(
  path: string,
  priority: number,
  change: MetadataRoute.Sitemap[0]['changeFrequency'],
  lastModified: Date
): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: new URL(pathnameWithLocale(locale, path), siteUrl).toString(),
    lastModified,
    changeFrequency: change,
    priority,
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const base: MetadataRoute.Sitemap = staticPaths.flatMap(
    ({ path, priority, change }) => withLocales(path, priority, change, now)
  )

  const serviceUrls: MetadataRoute.Sitemap = business.services.flatMap(
    (s) =>
      withLocales(`/servicios/${s.slug}`, 0.85, 'monthly', now)
  )

  const zoneUrls: MetadataRoute.Sitemap = business.zones.flatMap((z) =>
    withLocales(`/zonas/${z.slug}`, 0.75, 'monthly', now)
  )

  const guideUrls: MetadataRoute.Sitemap = business.guides.flatMap((g) =>
    withLocales(`/guias/${g.slug}`, 0.7, 'monthly', new Date(g.publishedIso))
  )

  return [...base, ...serviceUrls, ...zoneUrls, ...guideUrls]
}
