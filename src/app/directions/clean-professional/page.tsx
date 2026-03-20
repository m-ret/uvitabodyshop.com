import type { Metadata } from 'next'
import { CleanProfessionalPage } from '@/components/directions/clean-professional/CleanProfessionalPage'

export const metadata: Metadata = {
  title: 'Design Direction B: Clean Professional — Uvita Body Shop',
  description:
    'Light palette, photography-forward hero, subtle WebGL overlay, and GSAP scroll animations. Design exploration for Uvita Body Shop.',
}

export default function CleanProfessionalRoute() {
  return <CleanProfessionalPage />
}
