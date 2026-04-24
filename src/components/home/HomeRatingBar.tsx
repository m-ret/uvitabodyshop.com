'use client'

import { useTranslations } from 'next-intl'
import { business } from '@/data/business'

/**
 * Secondary trust line — Google aggregate + link-out to reviews (U16).
 */
export default function HomeRatingBar() {
  const t = useTranslations('Home.Trust')
  const { rating } = business
  if (rating.count < 1) return null

  return (
    <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
      <span className="font-display text-2xl sm:text-3xl text-white tabular-nums">
        {rating.value}
      </span>
      <span className="text-zinc-500" aria-hidden="true">
        ·
      </span>
      <span className="text-sm text-zinc-400">
        {t('googleReviews', { count: rating.count })}
      </span>
      {rating.url && (
        <a
          href={rating.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent hover:text-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t('reviewsLink')}
        </a>
      )}
    </div>
  )
}
