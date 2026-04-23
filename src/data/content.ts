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
    title: 'Frame & Body',
    subtitle: 'Collision & Frame Repair',
    description:
      'From fender benders to full structural damage. Computer-assisted measurement and hydraulic correction restore factory geometry.',
    // TODO(photo): swap for /images/services/enderezado.jpg (real shop photo)
    image:
      'https://images.unsplash.com/photo-1769021955466-ed4372792114?auto=format&fit=crop&w=2069&q=100',
    alt: 'Technician performing collision repair and frame straightening on vehicle',
  },
  {
    slug: 'pintura-completa',
    number: '02',
    title: 'Full Paint',
    subtitle: 'Full Paint & Color Match',
    description:
      'Multi-stage application in our dust-free spray booth with infrared curing oven. Primer, base coat, color coat, clear coat — flawless.',
    // TODO(photo): swap for /images/services/pintura-completa.jpg
    image:
      'https://img.freepik.com/free-photo/vehicle-covered-with-white-sheet-yellow-tape-car-service-garage_181624-3084.jpg?w=1480',
    alt: 'Vehicle masked and prepared for professional paint job in spray booth',
  },
  {
    slug: 'retoques-pintura',
    number: '03',
    title: 'Paint Touch-Up',
    subtitle: 'Paint Touch-Up & Correction',
    description:
      "Seamless spot repairs, scratch removal, and color blending. We match your original finish so perfectly you can't tell where the repair begins.",
    // TODO(photo): swap for /images/services/retoques-pintura.jpg
    image:
      'https://img.freepik.com/free-photo/preparing-car-before-spray-painting_1157-36582.jpg?w=1480',
    alt: 'Technician preparing and masking a car surface before paint touch-up',
  },
  {
    slug: 'reparacion-golpes',
    number: '04',
    title: 'Dent Repair',
    subtitle: 'Dent & Impact Repair',
    description:
      'Advanced techniques eliminate dents, dings, and impact damage. We restore body panels to their original shape without unnecessary replacement.',
    // TODO(photo): swap for /images/services/reparacion-golpes.jpg
    image:
      'https://img.freepik.com/free-photo/person-working-car-wrapping_23-2149342610.jpg?w=1480',
    alt: 'Technician working on vehicle body panel dent and impact repair',
  },
  {
    slug: 'instalacion-accesorios',
    number: '05',
    title: 'Accessories',
    subtitle: 'Accessories & Custom',
    description:
      'Custom bumpers, spoilers, side skirts, and aftermarket accessories. Professional installation with perfect paint-matched finish.',
    // TODO(photo): swap for /images/services/instalacion-accesorios.jpg
    image:
      'https://img.freepik.com/free-photo/medium-shot-man-wrapping-car_23-2149385726.jpg?w=1480',
    alt: 'Professional installing custom vinyl wrap and accessories on vehicle',
  },
]

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Evaluate',
    description:
      'Full damage assessment with photo documentation. Transparent quote — no surprises.',
  },
  {
    number: '02',
    title: 'Repair',
    description:
      'Structural and body work with Roberlo, BESA, 3M, and VICCO professional materials.',
  },
  {
    number: '03',
    title: 'Paint',
    description:
      'Multi-layer application in our spray booth with infrared curing oven. Dust-free, perfect match.',
  },
  {
    number: '04',
    title: 'Deliver',
    description:
      "Final quality inspection. Every angle, every surface. We don't release until it's perfect.",
  },
]

export const materialBrands: MaterialBrand[] = [
  { name: 'Roberlo', letter: 'R' },
  { name: 'BESA', letter: 'B' },
  { name: '3M', letter: '3M' },
  { name: 'VICCO', letter: 'V' },
]

export const marqueeItems = [
  'Collision Repair',
  'Full Paint',
  'Touch-Ups',
  'Dent Repair',
  'Accessories',
  'Guaranteed',
]
