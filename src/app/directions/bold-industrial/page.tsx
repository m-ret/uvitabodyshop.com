import type { Metadata } from 'next'
import { BoldIndustrialPage } from '@/components/directions/bold-industrial/BoldIndustrialPage'

export const metadata: Metadata = {
  title: 'Design Direction A: Bold Industrial — Uvita Body Shop',
  description:
    'Dark metallic palette, industrial typography, WebGL hero, and GSAP scroll animations. Design exploration for Uvita Body Shop.',
}

export default function BoldIndustrialRoute() {
  return <BoldIndustrialPage />
}
