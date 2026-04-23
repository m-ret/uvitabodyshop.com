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
    // TODO(photo): swap for /images/services/enderezado.jpg (real shop photo)
    image:
      'https://images.unsplash.com/photo-1769021955466-ed4372792114?auto=format&fit=crop&w=2069&q=100',
    alt: 'Técnico realizando enderezado de chasis y reparación de colisión',
  },
  {
    slug: 'pintura-completa',
    number: '02',
    title: 'Pintura completa',
    subtitle: 'Cabina y horno infrarrojo',
    description:
      'Aplicación en etapas dentro de nuestra cabina libre de polvo con horno de curado infrarrojo. Primer, base, color y laca — acabado perfecto.',
    // TODO(photo): swap for /images/services/pintura-completa.jpg
    image:
      'https://img.freepik.com/free-photo/vehicle-covered-with-white-sheet-yellow-tape-car-service-garage_181624-3084.jpg?w=1480',
    alt: 'Vehículo enmascarado y preparado para pintura completa en cabina profesional',
  },
  {
    slug: 'retoques-pintura',
    number: '03',
    title: 'Retoques de pintura',
    subtitle: 'Rayones y mezcla de color',
    description:
      'Reparaciones puntuales invisibles, remoción de rayones y mezcla de color. Igualamos tu acabado original con tal precisión que no vas a notar dónde arreglamos.',
    // TODO(photo): swap for /images/services/retoques-pintura.jpg
    image:
      'https://img.freepik.com/free-photo/preparing-car-before-spray-painting_1157-36582.jpg?w=1480',
    alt: 'Técnico preparando y enmascarando un panel antes de retocar la pintura',
  },
  {
    slug: 'reparacion-golpes',
    number: '04',
    title: 'Reparación de golpes',
    subtitle: 'Abolladuras e impactos',
    description:
      'Técnicas avanzadas para eliminar abolladuras y daños por impacto. Devolvemos los paneles a su forma original sin reemplazos innecesarios.',
    // TODO(photo): swap for /images/services/reparacion-golpes.jpg
    image:
      'https://img.freepik.com/free-photo/person-working-car-wrapping_23-2149342610.jpg?w=1480',
    alt: 'Técnico trabajando reparación de abolladura en un panel del vehículo',
  },
  {
    slug: 'instalacion-accesorios',
    number: '05',
    title: 'Accesorios',
    subtitle: 'Instalación y pintura a juego',
    description:
      'Bumpers, spoilers, estribos y accesorios aftermarket. Instalación profesional con acabado pintado a tono con la carrocería.',
    // TODO(photo): swap for /images/services/instalacion-accesorios.jpg
    image:
      'https://img.freepik.com/free-photo/medium-shot-man-wrapping-car_23-2149385726.jpg?w=1480',
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
