'use client'

import { useTranslations } from 'next-intl'
import { business } from '@/data/business'

/**
 * Compact trust strip for the home hero — mono labels, no radius (DESIGN.md).
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
    {
      label: `${business.rating.value}★ Google`,
      sub: t('googleReviews', { count: business.rating.count }),
    },
  ]

  return (
    <div className="mt-8 max-w-3xl">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-3">
        {t('eyebrow')}
      </p>
      <ul className="grid grid-cols-2 sm:grid-cols-4 gap-px border border-zinc-800/80 bg-zinc-800/50 list-none p-0 m-0">
        {items.map((item) => (
          <li
            key={item.label}
            className="bg-background/80 px-3 py-3 sm:px-4 sm:py-4"
          >
            <p className="font-mono text-[10px] sm:text-xs tracking-wider text-accent/90">
              {item.label}
            </p>
            <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-snug mt-1">
              {item.sub}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
