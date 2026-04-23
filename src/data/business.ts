/**
 * Business data — single source of truth for SEO, schema.org, llms.txt,
 * quote-request API, UI, and any place that needs a canonical fact about
 * Uvita Body Shop.
 *
 * Anything user-facing that duplicates these values is a bug.
 */

export interface Testimonial {
  id: string
  author: string
  vehicle?: string
  service?: string
  quote: string
  rating?: 1 | 2 | 3 | 4 | 5
  dateIso?: string
}

export interface GalleryItem {
  id: string
  src: string
  alt: string
  caption?: string
  beforeSrc?: string
  width?: number
  height?: number
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'tiktok' | 'google'
  url: string
  handle: string
}

export const business = {
  name: 'Uvita Body Shop',
  legalName: 'Uvita Body Shop',
  owner: 'Fabricio Ríos Ortiz',
  foundedYear: 2020,
  yearsInBusiness: 6,
  yearsExperience: 9,

  contact: {
    phone: '+5068769927',
    phoneDisplay: '(506) 8769-9927',
    whatsapp: 'https://wa.me/5068769927',
    whatsappNumber: '5068769927',
  },

  address: {
    locality: 'Uvita',
    region: 'Puntarenas',
    countryCode: 'CR',
    country: 'Costa Rica',
    areaServed: ['Uvita', 'Dominical', 'Ojochal', 'Bahía Ballena', 'Zona Sur'],
    locationDisplay: 'Uvita, Puntarenas, Costa Rica',
  },

  hours: {
    display: 'Lun–Sáb · 8:00 a.m. – 5:00 p.m.',
    opens: '08:00',
    closes: '17:00',
    daysOfWeek: [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    timeZone: 'America/Costa_Rica',
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
      description:
        'Reparación estructural y de chasis con medición computarizada.',
    },
    {
      slug: 'pintura-completa',
      es: 'Pintura completa',
      en: 'Full Paint',
      description:
        'Pintura de vehículo completo en cabina con horno infrarrojo.',
    },
    {
      slug: 'retoques-pintura',
      es: 'Retoques de pintura',
      en: 'Paint Touch-Up',
      description:
        'Retoques localizados, remoción de rayones, mezcla de color perfecta.',
    },
    {
      slug: 'reparacion-golpes',
      es: 'Reparación de golpes',
      en: 'Dent & Impact Repair',
      description:
        'Reparación de abolladuras e impactos sin reemplazo innecesario de paneles.',
    },
    {
      slug: 'instalacion-accesorios',
      es: 'Instalación de accesorios',
      en: 'Accessories & Custom',
      description:
        'Instalación de bumpers, spoilers, accesorios aftermarket con acabado perfecto.',
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

  // Client-provided URLs. Placeholders until confirmed; do not remove.
  // Editing a single entry here flips JSON-LD sameAs + the footer.
  socialLinks: [] as SocialLink[],

  // Static map: a single image URL (Mapbox static / Google Maps static).
  // Keeping `null` keeps the map section empty until we pick a provider.
  // mapLinkUrl is the "open in Maps" deep link.
  map: {
    embedUrl: null as string | null,
    linkUrl: 'https://maps.app.goo.gl/?q=Uvita+Body+Shop+Uvita+Costa+Rica',
  },

  // When empty, downstream UI hides these sections. Ready to receive
  // client-provided content without another PR.
  testimonials: [] as Testimonial[],
  gallery: [] as GalleryItem[],
} as const

/**
 * URL origin — override via NEXT_PUBLIC_SITE_URL in .env.local / Vercel env.
 * Default is the production domain.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ??
  'https://uvitabodyshop.com'

/**
 * UI-facing contact selector. One shape for every display consumer
 * (navigation, contact section, mobile menu, footer).
 */
export function displayContact() {
  return {
    phone: business.contact.phone,
    phoneDisplay: business.contact.phoneDisplay,
    whatsapp: business.contact.whatsapp,
    hoursDisplay: business.hours.display,
    locationDisplay: business.address.locationDisplay,
  }
}

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
        image: `${siteUrl}/opengraph-image`,
        logo: `${siteUrl}/logo.png`,
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
        sameAs: business.socialLinks.map((s) => s.url),
      },
    ],
  }
}
