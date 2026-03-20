import type { Metadata } from 'next'
import { ExplorationPage } from '@/components/explore/ExplorationPage'

export const metadata: Metadata = {
  title: 'Design Exploration — Uvita Body Shop',
  description:
    'Compare three distinct design directions for the Uvita Body Shop website. Bold Industrial, Clean Professional, and Tropical Local.',
  robots: 'noindex',
}

export default function ExploreRoute() {
  return <ExplorationPage />
}
