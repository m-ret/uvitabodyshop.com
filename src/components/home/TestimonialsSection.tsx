'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { business, type Testimonial } from '@/data/business'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function StarRow() {
  const t = useTranslations('Home.Testimonials')
  const rating = 5
  return (
    <p
      className="font-mono text-xs text-accent mb-3"
      aria-label={t('starAria', { rating })}
    >
      {'★'.repeat(rating)}
    </p>
  )
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="testimonial-card gsap-reveal border border-zinc-800/80 bg-zinc-950/50 p-6 sm:p-8">
      <StarRow />
      <p className="text-zinc-200 leading-relaxed text-sm sm:text-base">
        &ldquo;{t.quote}&rdquo;
      </p>
      <footer className="mt-4 pt-4 border-t border-zinc-800/60">
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500">
          {t.author}
          {t.vehicle && (
            <span className="block normal-case tracking-normal text-zinc-600 mt-1">
              {t.vehicle}
            </span>
          )}
        </p>
      </footer>
    </article>
  )
}

/**
 * Renders when ≥3 reviews exist — scroll reveal uses `gsap.to()` + `.gsap-reveal`.
 */
export default function TestimonialsSection() {
  const t = useTranslations('Home.Testimonials')
  const list = business.testimonials
  const reduced = useReducedMotion()
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (reduced) return
      if (list.length < 3) return
      const cards = root.current?.querySelectorAll('.testimonial-card')
      if (!cards?.length) return
      cards.forEach((el) => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top 90%' },
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
        })
      })
    },
    { scope: root, dependencies: [reduced, list.length] }
  )

  if (list.length < 3) return null

  return (
    <section
      ref={root}
      className="relative py-16 sm:py-24 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/40"
      data-section="testimonios"
      id="testimonios"
    >
      <div className="max-w-6xl mx-auto">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
          <span
            aria-hidden="true"
            className="inline-block size-1.5 bg-accent mr-3 align-middle"
          />
          {t('eyebrow')}
        </p>
        <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] uppercase text-white mb-12 sm:mb-16 max-w-2xl">
          {t('titleA')}{' '}
          <span className="text-accent">{t('titleB')}</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 list-none p-0 m-0">
          {list.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
