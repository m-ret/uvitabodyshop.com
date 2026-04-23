/**
 * Business data — single source of truth for SEO, schema.org, llms.txt,
 * quote-request API, and any place that needs a canonical fact about
 * Uvita Body Shop.
 *
 * Anything user-facing that duplicates these values is a bug.
 */

import { services as displayServices, contactInfo } from './content'

export const business = {
  name: 'Uvita Body Shop',
  legalName: 'Uvita Body Shop',
  owner: 'Fabricio Ríos Ortiz',
  foundedYear: 2020,
  yearsInBusiness: 6,
  yearsExperience: 9,

  contact: {
    phone: contactInfo.phone,
    phoneDisplay: contactInfo.phoneDisplay,
    whatsapp: contactInfo.whatsapp,
    whatsappNumber: '5068769927',
  },

  address: {
    locality: 'Uvita',
    region: 'Puntarenas',
    countryCode: 'CR',
    country: 'Costa Rica',
    areaServed: ['Uvita', 'Dominical', 'Ojochal', 'Bahía Ballena', 'Zona Sur'],
  },

  hours: {
    display: contactInfo.hours,
    opens: '08:00',
    closes: '17:00',
    daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  },

  capabilities: {
    paintBrands: ['Roberlo', 'BESA', '3M', 'VICCO'],
    hasPaintBooth: true,
    offersWarranty: true,
    handlesInsurance: false,
    acceptsPhotoQuotes: true,
    vehicleScope: 'all',
  },

  services: [
    {
      slug: 'enderezado',
      es: 'Enderezado',
      en: 'Frame & Collision Repair',
      description: 'Reparación estructural y de chasis con medición computarizada.',
    },
    {
      slug: 'pintura-completa',
      es: 'Pintura completa',
      en: 'Full Paint',
      description: 'Pintura de vehículo completo en cabina con horno infrarrojo.',
    },
    {
      slug: 'retoques-pintura',
      es: 'Retoques de pintura',
      en: 'Paint Touch-Up',
      description: 'Retoques localizados, remoción de rayones, mezcla de color perfecta.',
    },
    {
      slug: 'reparacion-golpes',
      es: 'Reparación de golpes',
      en: 'Dent & Impact Repair',
      description: 'Reparación de abolladuras e impactos sin reemplazo innecesario de paneles.',
    },
    {
      slug: 'instalacion-accesorios',
      es: 'Instalación de accesorios',
      en: 'Accessories & Custom',
      description: 'Instalación de bumpers, spoilers, accesorios aftermarket con acabado perfecto.',
    },
  ],

  pricing: {
    priceRange: '$$',
    currency: 'CRC',
    estimateMethod: 'photo-or-in-person',
  },

  meta: {
    contentLanguage: 'es',
    tagline: 'Enderezado y pintura de precisión. Uvita, Costa Rica.',
    descriptionEs:
      'Taller profesional de enderezado, pintura completa y reparación de colisión en Uvita, Costa Rica. 9 años de experiencia, cabina de pintura con horno, garantía en todos los trabajos. Roberlo, BESA, 3M, VICCO.',
    descriptionEn:
      'Professional auto body, paint, and collision repair in Uvita, Costa Rica. 9 years of experience, spray booth with infrared oven, warranty on all work. Roberlo, BESA, 3M, VICCO paint systems.',
    keywords: [
      'taller de pintura uvita',
      'enderezado y pintura costa rica',
      'reparación de colisión puntarenas',
      'pintura automotriz uvita',
      'body shop uvita',
      'taller de enderezado zona sur',
    ],
  },
} as const

/**
 * URL origin — override via NEXT_PUBLIC_SITE_URL in .env.local / Vercel env.
 * Default is the production domain.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://uvitabodyshop.com'

/**
 * schema.org `AutoBodyShop` + `LocalBusiness` JSON-LD graph.
 * Used in `app/layout.tsx` — do not duplicate this literal elsewhere.
 */
export function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['AutoBodyShop', 'LocalBusiness'],
        '@id': `${siteUrl}#business`,
        name: business.name,
        description: business.meta.descriptionEs,
        url: siteUrl,
        telephone: business.contact.phone,
        priceRange: business.pricing.priceRange,
        image: `${siteUrl}/og.jpg`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: business.address.locality,
          addressRegion: business.address.region,
          addressCountry: business.address.countryCode,
        },
        areaServed: business.address.areaServed.map((locality) => ({
          '@type': 'City',
          name: locality,
        })),
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: business.hours.daysOfWeek,
            opens: business.hours.opens,
            closes: business.hours.closes,
          },
        ],
        founder: { '@type': 'Person', name: business.owner },
        foundingDate: String(business.foundedYear),
        makesOffer: business.services.map((s) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.es,
            alternateName: s.en,
            description: s.description,
          },
        })),
        sameAs: [],
      },
    ],
  }
}

// Sanity check so TS prunes unused but reminds us that display data
// stays in content.ts:
export const _displayServicesCount = displayServices.length
