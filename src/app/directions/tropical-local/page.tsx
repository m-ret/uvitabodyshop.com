import type { Metadata } from 'next'
import { TropicalLocalPage } from '@/components/directions/tropical-local/TropicalLocalPage'

export const metadata: Metadata = {
  title: 'Design Direction C: Tropical Local — Uvita Body Shop',
  description:
    'Costa Rica-inspired warm palette, organic shapes, tropical WebGL hero, and fluid GSAP scroll animations. Design exploration for Uvita Body Shop.',
}

export default function TropicalLocalRoute() {
  return <TropicalLocalPage />
}
