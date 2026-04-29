import type { Metadata } from 'next'
import { business, siteUrl } from '@/data/business'
import { routing } from '@/i18n/routing'

export interface PageMetaInput {
  title: string
  description: string
  /** Path without locale prefix, e.g. `/contacto` or `/servicios/enderezado`. */
  pathname: string
  ogImage?: string
  keywords?: string[]
  index?: boolean
  /** Active locale from `[locale]` segment. */
  locale: string
}

/** Public URL path including optional `/en` prefix. Root-aware: `/en/` is
 * normalized to `/en` so canonical and sitemap agree on a single shape. */
export function pathnameWithLocale(locale: string, pathname: string): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (locale === routing.defaultLocale) return p
  if (p === '/') return `/${locale}`
  return `/${locale}${p}`
}

/** Absolute URL for a localized path, stripping any trailing slash except
 * on the default-locale root (which stays as the bare site URL). */
export function absoluteUrlForPath(locale: string, pathname: string): string {
  const path = pathnameWithLocale(locale, pathname)
  if (path === '/') return siteUrl.replace(/\/$/, '')
  const u = new URL(path, siteUrl).toString()
  return u.replace(/\/$/, '')
}

export function buildPageMetadata(input: PageMetaInput): Metadata {
  const {
    title,
    description,
    pathname,
    ogImage,
    keywords,
    index = true,
    locale,
  } = input

  const absoluteCanonical = absoluteUrlForPath(locale, pathname)
  const ogImageUrl = ogImage
    ? new URL(ogImage, siteUrl).toString()
    : new URL('/opengraph-image', siteUrl).toString()

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = absoluteUrlForPath(l, pathname)
  }
  languages['x-default'] = absoluteUrlForPath(routing.defaultLocale, pathname)

  const resolvedKeywords =
    keywords !== undefined
      ? keywords
      : locale === 'en'
        ? undefined
        : [...business.meta.keywords]

  return {
    title,
    description,
    ...(resolvedKeywords !== undefined ? { keywords: resolvedKeywords } : {}),
    alternates: {
      canonical: absoluteCanonical,
      languages,
    },
    openGraph: {
      type: 'website',
      locale: locale === 'en' ? 'en_US' : 'es_CR',
      url: absoluteCanonical,
      siteName: business.name,
      title: `${title} · ${business.name}`,
      description,
      images: [{ url: ogImageUrl }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} · ${business.name}`,
      description,
      images: [ogImageUrl],
    },
    robots: index
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : { index: false, follow: true },
  }
}
