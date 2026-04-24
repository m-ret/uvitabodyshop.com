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

/** Public URL path including optional `/en` prefix. */
export function pathnameWithLocale(locale: string, pathname: string): string {
  const p = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (locale === routing.defaultLocale) return p
  return `/${locale}${p}`
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

  const canonicalPath = pathnameWithLocale(locale, pathname)
  const absoluteCanonical = new URL(canonicalPath, siteUrl).toString()
  const ogImageUrl = ogImage
    ? new URL(ogImage, siteUrl).toString()
    : new URL('/opengraph-image', siteUrl).toString()

  const languages: Record<string, string> = {}
  for (const l of routing.locales) {
    languages[l] = pathnameWithLocale(l, pathname)
  }
  languages['x-default'] = pathnameWithLocale(routing.defaultLocale, pathname)

  return {
    title,
    description,
    keywords: keywords ?? [...business.meta.keywords],
    alternates: {
      canonical: canonicalPath,
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
