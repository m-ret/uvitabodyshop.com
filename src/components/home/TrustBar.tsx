'use client'

import { useTranslations } from 'next-intl'
import { business } from '@/data/business'

/**
 * Home trust strip — centered spec grid: display labels, mono eyebrow (DESIGN.md).
 */
export default function TrustBar() {
  const t = useTranslations('Home.Trust')

  const items = [
    {
      label: t('yearsLabel', { years: business.yearsExperience }),
      sub: t('yearsSub'),
    },
    {
      label: t('booth'),
      sub: business.capabilities.hasPaintBooth
        ? t('boothSub')
        : t('boothSubFallback'),
    },
    {
      label: t('warranty'),
      sub: business.capabilities.offersWarranty
        ? t('warrantySub')
        : t('warrantySubFallback'),
    },
  ]

  return (
    <div className="w-full max-w-6xl mx-auto text-center">
      <p className="font-mono text-[11px] sm:text-xs md:text-sm tracking-[0.32em] uppercase text-accent mb-7 sm:mb-10 md:mb-12">
        {t('eyebrow')}
      </p>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-px border border-zinc-700/95 bg-zinc-700/60 list-none p-0 m-0 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
        {items.map((item) => (
          <li
            key={item.label}
            className="relative bg-background/90 px-5 py-8 sm:px-7 sm:py-10 md:px-8 md:py-12 min-h-[7.5rem] sm:min-h-[8.5rem] flex flex-col items-center justify-center"
          >
            <p className="font-display text-[clamp(1.35rem,4vw,2.25rem)] leading-[0.92] uppercase tracking-tight text-accent">
              {item.label}
            </p>
            <p className="text-sm sm:text-base text-zinc-400 leading-snug sm:leading-relaxed mt-3 sm:mt-4 max-w-[16rem] mx-auto">
              {item.sub}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
