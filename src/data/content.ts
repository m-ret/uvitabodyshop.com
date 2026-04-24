/* ------------------------------------------------------------------ */
/*  Display-only content — service cards, process steps, brand tickers */
/*  Canonical business facts live in src/data/business.ts             */
/* ------------------------------------------------------------------ */

export interface Service {
  /** Matches business.services[].slug for 1:1 mapping */
  slug: string
  number: string
  title: string
  subtitle: string
  description: string
  /**
   * Hero image for the service card.
   * TODO(photo): Replace stock URL with /images/services/<slug>.jpg once
   * real photography arrives from the client. Swap this single field per
   * service — no other code changes needed.
   */
  image: string
  alt: string
}

export interface ProcessStep {
  number: string
  title: string
  description: string
}

export interface MaterialBrand {
  name: string
  letter: string
}

export const services: Service[] = [
  {
    slug: 'enderezado',
    number: '01',
    title: 'Enderezado',
    subtitle: 'Chasis y estructura',
    description:
      'Desde golpes leves hasta daños estructurales completos. Medición computarizada y corrección hidráulica para recuperar la geometría de fábrica.',
    image: '/images/services/enderezado.avif',
    alt: 'Técnico realizando enderezado de chasis y reparación de colisión',
  },
  {
    slug: 'pintura-completa',
    number: '02',
    title: 'Pintura completa',
    subtitle: 'Cabina y horno infrarrojo',
    description:
      'Aplicación en etapas dentro de nuestra cabina libre de polvo con horno de curado infrarrojo. Primer, base, color y laca — acabado perfecto.',
    image: '/images/services/pintura-completa.avif',
    alt: 'Vehículo enmascarado y preparado para pintura completa en cabina profesional',
  },
  {
    slug: 'retoques-pintura',
    number: '03',
    title: 'Retoques de pintura',
    subtitle: 'Rayones y mezcla de color',
    description:
      'Reparaciones puntuales invisibles, remoción de rayones y mezcla de color. Igualamos tu acabado original con tal precisión que no vas a notar dónde arreglamos.',
    image: '/images/services/retoques-pintura.avif',
    alt: 'Técnico enmascarando un panel con cinta antes de retocar la pintura',
  },
  {
    slug: 'reparacion-golpes',
    number: '04',
    title: 'Reparación de golpes',
    subtitle: 'Abolladuras e impactos',
    description:
      'Técnicas avanzadas para eliminar abolladuras y daños por impacto. Devolvemos los paneles a su forma original sin reemplazos innecesarios.',
    image: '/images/services/reparacion-golpes.avif',
    alt: 'Técnico trabajando reparación de abolladura en un panel del vehículo',
  },
  {
    slug: 'instalacion-accesorios',
    number: '05',
    title: 'Accesorios',
    subtitle: 'Instalación y pintura a juego',
    description:
      'Bumpers, spoilers, estribos y accesorios aftermarket. Instalación profesional con acabado pintado a tono con la carrocería.',
    image: '/images/services/instalacion-accesorios.avif',
    alt: 'Instalación profesional de accesorios y acabado personalizado en vehículo',
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Evaluar',
    description:
      'Revisión completa del daño con documentación fotográfica. Cotización transparente — sin sorpresas.',
  },
  {
    number: '02',
    title: 'Reparar',
    description:
      'Trabajo estructural y de carrocería con materiales profesionales Roberlo, BESA, 3M y VICCO.',
  },
  {
    number: '03',
    title: 'Pintar',
    description:
      'Aplicación multicapa en cabina con horno de curado infrarrojo. Libre de polvo, color exacto.',
  },
  {
    number: '04',
    title: 'Entregar',
    description:
      'Inspección final de calidad. Cada ángulo, cada superficie. No liberamos el vehículo hasta que quede impecable.',
  },
]

export const materialBrands: MaterialBrand[] = [
  { name: 'Roberlo', letter: 'R' },
  { name: 'BESA', letter: 'B' },
  { name: '3M', letter: '3M' },
  { name: 'VICCO', letter: 'V' },
]

/**
 * Marquee ticker. English labels are permitted per DESIGN.md §3 (technical
 * tickers), but we keep it mostly Spanish so the site reads Spanish at a
 * glance. Do not add customer-facing English sentences here.
 */
export const marqueeItems = [
  'Enderezado',
  'Pintura completa',
  'Retoques',
  'Abolladuras',
  'Accesorios',
  'Garantía escrita',
  'Made in Costa Rica',
  'Since 2020',
]
