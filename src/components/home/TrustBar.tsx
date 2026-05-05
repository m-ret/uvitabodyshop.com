'use client'

import { useTranslations } from 'next-intl'
import { business } from '@/data/business'
import BrandReel from '@/components/home/BrandReel'

/**
 * Home trust panel — 35/65 hairline split:
 *   left  → eyebrow + two trust marks (years of trade, written warranty)
 *   right → 26-second brand reel (locale + aspect routed inside <BrandReel />)
 *
 * Below `lg`, the panel stacks: text on top, video below.
 */
export default function TrustBar() {
  const t = useTranslations('Home.Trust')

  const items = [
    {
      label: t('yearsLabel', { years: business.yearsExperience }),
      sub: t('yearsSub'),
    },
    {
      label: t('warranty'),
      sub: business.capabilities.offersWarranty
        ? t('warrantySub')
        : t('warrantySubFallback'),
    },
  ]

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[35fr_65fr] gap-px border border-zinc-700/95 bg-zinc-700/60 shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset]">
        {/* LEFT — text 35% */}
        <div className="bg-background/95 px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 flex flex-col justify-between gap-10 sm:gap-14 lg:min-h-[460px]">
          <p className="font-mono text-[11px] sm:text-xs md:text-sm tracking-[0.32em] uppercase text-accent">
            {t('eyebrow')}
          </p>

          <div className="flex flex-col gap-8 sm:gap-10">
            {items.map((item) => (
              <div key={item.label}>
                <p className="font-display text-[clamp(2rem,4.4vw,3.25rem)] leading-[0.92] uppercase tracking-tight text-accent">
                  {item.label}
                </p>
                <p className="text-sm sm:text-base text-zinc-400 leading-snug mt-3 max-w-[22rem]">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          {/* Hairline footnote, mirrors the spec-sheet language used elsewhere */}
          <p
            aria-hidden="true"
            className="font-mono text-[10px] sm:text-[11px] tracking-[0.3em] uppercase text-zinc-500"
          >
            {t('footnote', {
              locality: business.address.locality.toUpperCase(),
              country: business.address.country.toUpperCase(),
            })}
          </p>
        </div>

        {/* RIGHT — video 65% */}
        <div className="relative bg-background portrait:max-md:aspect-[9/16] aspect-video lg:aspect-auto overflow-hidden">
          <BrandReel />
        </div>
      </div>
    </div>
  )
}
