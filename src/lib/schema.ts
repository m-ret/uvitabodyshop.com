import {
  business,
  siteUrl,
  type ServiceEntry,
  type Testimonial,
} from '@/data/business'
import { pathnameWithLocale } from '@/lib/metadata'

/** Pull the lowest CRC figure from a price string. Handles both Spanish
 * (`₡250.000` — `.` as thousands separator) and English (`₡250,000` — `,`
 * as thousands separator) number formatting. */
function extractMinPrice(text: string | undefined): number | null {
  if (!text) return null
  const m = text.match(/₡\s*([\d.,]+)/)
  if (!m) return null
  const n = parseInt(m[1].replace(/[.,]/g, ''), 10)
  return Number.isFinite(n) ? n : null
}

export interface BreadcrumbNode {
  /** Absolute or site-relative path; empty string for the current page. */
  href: string
  label: string
}

/**
 * schema.org `BreadcrumbList`. Pass the trail from root to current page.
 * The last node typically has an empty `href` — schema.org doesn't
 * require one, and the UI renders it as plain text.
 */
export function buildBreadcrumbSchema(
  trail: BreadcrumbNode[],
  locale = 'es'
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((node, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: node.label,
      item: node.href
        ? new URL(pathnameWithLocale(locale, node.href), siteUrl).toString()
        : undefined,
    })),
  }
}

/**
 * schema.org `Service` for a service detail page. Emits provider +
 * areaServed + offers so Google can rank the page for the service name.
 */
export function buildServiceSchema(
  service: ServiceEntry,
  options?: { locale?: string; longDescription?: string; priceGuidance?: string }
) {
  const locale = options?.locale ?? 'es'
  const primaryName = locale === 'en' ? service.en : service.es
  const secondaryName = locale === 'en' ? service.es : service.en
  const longDescription =
    options?.longDescription ?? service.longDescription
  const priceGuidance = options?.priceGuidance ?? service.priceGuidance
  const servicePath = `/servicios/${service.slug}`
  const offerPath = `/contacto?servicio=${encodeURIComponent(service.slug)}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: primaryName,
    alternateName: secondaryName,
    description: longDescription,
    url: new URL(pathnameWithLocale(locale, servicePath), siteUrl).toString(),
    image: new URL(service.image, siteUrl).toString(),
    serviceType: primaryName,
    provider: {
      '@type': 'AutoBodyShop',
      '@id': `${siteUrl}#business`,
      name: business.name,
    },
    areaServed: business.address.areaServed.map((city) => ({
      '@type': 'City',
      name: city,
    })),
    offers: {
      '@type': 'Offer',
      priceCurrency: business.pricing.currency,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: business.pricing.currency,
        ...(extractMinPrice(priceGuidance) !== null
          ? { minPrice: extractMinPrice(priceGuidance) as number }
          : {}),
        description: priceGuidance,
      },
      availability: 'https://schema.org/InStock',
      url: new URL(pathnameWithLocale(locale, offerPath), siteUrl).toString(),
    },
  }
}

export interface FaqEntry {
  q: string
  a: string
}

/**
 * schema.org `FAQPage`. Pass an array of Q/A pairs. Keep the answers as
 * plain-text strings — Google strips HTML beyond basic formatting.
 */
export function buildFaqSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

/**
 * schema.org `Review` for a single testimonial. Inlined into the business
 * graph via `buildStructuredData()`; exposed here for per-page emission
 * when it makes sense (e.g. a dedicated testimonials page).
 */
export function buildReviewSchema(testimonial: Testimonial) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    author: { '@type': 'Person', name: testimonial.author },
    reviewBody: testimonial.quote,
    datePublished: testimonial.dateIso,
    itemReviewed: {
      '@type': 'AutoBodyShop',
      '@id': `${siteUrl}#business`,
      name: business.name,
    },
    reviewRating: testimonial.rating
      ? {
          '@type': 'Rating',
          ratingValue: testimonial.rating,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  }
}

/**
 * schema.org `BlogPosting` for the editorial guides at /guias/[slug].
 * Pins the publisher to the business node and includes inLanguage so
 * multilingual graphs are unambiguous.
 */
export function buildArticleSchema(args: {
  slug: string
  title: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  /** Matches page canonical (`/guias/...` vs `/en/guias/...`). */
  locale?: string
}) {
  const locale = args.locale ?? 'es'
  const pagePath = pathnameWithLocale(locale, `/guias/${args.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: args.title,
    description: args.description,
    image: new URL(args.image, siteUrl).toString(),
    datePublished: args.datePublished,
    dateModified: args.dateModified ?? args.datePublished,
    inLanguage: locale === 'en' ? 'en' : 'es',
    author: { '@type': 'Person', name: business.owner },
    publisher: {
      '@type': 'AutoBodyShop',
      '@id': `${siteUrl}#business`,
      name: business.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': new URL(pagePath, siteUrl).toString(),
    },
  }
}

/**
 * schema.org `Person` for a crew member. References the business node
 * via `worksFor` so Google links the person to the LocalBusiness.
 */
export function buildPersonSchema(args: {
  name: string
  /** Site-relative path to the portrait. */
  photo: string
  /** Localized job title (e.g. "Frame & sheet metal"). */
  role: string
  locale?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: args.name,
    image: new URL(args.photo, siteUrl).toString(),
    jobTitle: args.role,
    worksFor: { '@type': 'AutoBodyShop', '@id': `${siteUrl}#business` },
    inLanguage: args.locale === 'en' ? 'en' : 'es',
  }
}

/**
 * schema.org `WebSite` for the home page. Pinned to the LocalBusiness
 * publisher so Google recognizes the site as the business's web presence.
 */
export function buildWebsiteSchema(locale: 'es' | 'en' = 'es') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}#website`,
    url: locale === 'en' ? `${siteUrl}/en` : siteUrl.replace(/\/$/, ''),
    name: business.name,
    inLanguage: locale === 'en' ? 'en' : 'es',
    publisher: { '@type': 'AutoBodyShop', '@id': `${siteUrl}#business` },
  }
}

/**
 * schema.org `Service` narrowed to a single zone — surfaces "body shop {town}"
 * intent without diluting the canonical Service-per-service-detail schemas.
 */
export function buildZoneServiceSchema(args: {
  zoneName: string
  zoneSlug: string
  description: string
  locale?: string
}) {
  const locale = args.locale ?? 'es'
  const pagePath = pathnameWithLocale(locale, `/zonas/${args.zoneSlug}`)
  const serviceName =
    locale === 'en'
      ? `Auto body & paint near ${args.zoneName}`
      : `Chapa y pintura cerca de ${args.zoneName}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: args.description,
    url: new URL(pagePath, siteUrl).toString(),
    provider: { '@type': 'AutoBodyShop', '@id': `${siteUrl}#business` },
    areaServed: { '@type': 'City', name: args.zoneName },
    inLanguage: locale === 'en' ? 'en' : 'es',
  }
}

/**
 * Tiny helper: one-shot renderer for inline `<script type="application/ld+json">`.
 * Usage:
 *   <script dangerouslySetInnerHTML={jsonLd(buildFaqSchema(faqs))} />
 */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data) }
}
