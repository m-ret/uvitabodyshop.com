import type { MetadataRoute } from 'next'
import { business } from '@/data/business'
import { absoluteUrlForPath } from '@/lib/metadata'
import { routing } from '@/i18n/routing'

/**
 * Hand-curated lastmod per static path. Bump when you make a meaningful
 * content change. Keeping it stable across deploys is critical — Google
 * distrusts and ignores `<lastmod>` when it jitters every build.
 */
const staticPaths: {
  path: string
  priority: number
  change: MetadataRoute.Sitemap[0]['changeFrequency']
  lastModified: string
}[] = [
  { path: '/', priority: 1, change: 'weekly', lastModified: '2026-04-29' },
  { path: '/sobre-nosotros', priority: 0.8, change: 'monthly', lastModified: '2026-04-23' },
  { path: '/contacto', priority: 0.9, change: 'weekly', lastModified: '2026-04-29' },
  { path: '/servicios', priority: 0.9, change: 'weekly', lastModified: '2026-04-23' },
  { path: '/preguntas-frecuentes', priority: 0.7, change: 'monthly', lastModified: '2026-04-15' },
  { path: '/garantia', priority: 0.6, change: 'yearly', lastModified: '2026-05-04' },
  { path: '/privacidad', priority: 0.3, change: 'yearly', lastModified: '2026-04-15' },
]

type ChangeFreq = MetadataRoute.Sitemap[0]['changeFrequency']

/** Full alternates map shared by every `<url>` entry for one logical path. */
function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrlForPath(locale, path)
  }
  languages['x-default'] = absoluteUrlForPath(routing.defaultLocale, path)
  return languages
}

/**
 * One sitemap row per locale so each language has its own `<loc>`, while
 * every row repeats the same hreflang cluster (Codex review: English URLs
 * must remain first-class discovery targets, not only alternates).
 */
function sitemapEntriesForPath(
  path: string,
  priority: number,
  change: ChangeFreq,
  lastModified: Date
): MetadataRoute.Sitemap {
  const alternates = languageAlternates(path)
  return routing.locales.map((locale) => ({
    url: absoluteUrlForPath(locale, path),
    lastModified,
    changeFrequency: change,
    priority,
    alternates: { languages: alternates },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  const base: MetadataRoute.Sitemap = staticPaths.flatMap(
    ({ path, priority, change, lastModified }) =>
      sitemapEntriesForPath(path, priority, change, new Date(lastModified))
  )

  const serviceUrls: MetadataRoute.Sitemap = business.services.flatMap((s) =>
    sitemapEntriesForPath(
      `/servicios/${s.slug}`,
      0.85,
      'monthly',
      new Date(s.dateModified ?? '2026-04-23')
    )
  )

  const zoneUrls: MetadataRoute.Sitemap = business.zones.flatMap((z) =>
    sitemapEntriesForPath(
      `/zonas/${z.slug}`,
      0.75,
      'monthly',
      new Date(z.dateModified ?? '2026-04-23')
    )
  )

  const guideUrls: MetadataRoute.Sitemap = business.guides.flatMap((g) =>
    sitemapEntriesForPath(
      `/guias/${g.slug}`,
      0.7,
      'monthly',
      new Date(g.dateModified ?? g.publishedIso)
    )
  )

  return [...base, ...serviceUrls, ...zoneUrls, ...guideUrls]
}
