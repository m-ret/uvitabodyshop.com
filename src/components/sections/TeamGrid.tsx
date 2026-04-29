'use client'

import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { business } from '@/data/business'

type TeamMemberCopy = { role: string; bio: string; alt: string }

/**
 * Crew grid shared by `/sobre-nosotros` and the home page. Reads the `Team`
 * namespace via `useTranslations`; consumers control outer chrome via
 * `className` and opt into entrance animations via `revealClassName` /
 * `cardRevealClassName`. Each card carries a pointer-following radial-gradient
 * shine on hover — same visual rhyme as the home `Process` cards.
 */
export default function TeamGrid({
  className = '',
  revealClassName = '',
  cardRevealClassName = '',
}: {
  /** Outer section classes — host page chooses spacing + borders. */
  className?: string
  /** Class added to text blocks for host-page entrance animations. */
  revealClassName?: string
  /** Class added to each card for staggered entrance animations. */
  cardRevealClassName?: string
}) {
  const t = useTranslations('Team')
  const members = t.raw('members') as Record<string, TeamMemberCopy>

  const reveal = revealClassName ? ` ${revealClassName}` : ''
  const cardReveal = cardRevealClassName ? ` ${cardRevealClassName}` : ''

  const onCardMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const glow = e.currentTarget.querySelector(
      '.team-glow'
    ) as HTMLElement | null
    if (glow) {
      glow.style.opacity = '1'
      glow.style.background = `radial-gradient(420px circle at ${x}px ${y}px, rgba(204,0,0,0.18), transparent 45%)`
    }
  }

  const onCardLeave = (e: React.MouseEvent<HTMLLIElement>) => {
    const glow = e.currentTarget.querySelector(
      '.team-glow'
    ) as HTMLElement | null
    if (glow) glow.style.opacity = '0'
  }

  return (
    <section
      className={`relative max-w-6xl mx-auto w-full ${className}`}
      aria-labelledby="team-heading"
    >
      <p
        className={`font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4${reveal}`}
      >
        {t('eyebrow')}
      </p>
      <h2
        id="team-heading"
        className={`font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight uppercase text-white max-w-3xl${reveal}`}
      >
        {t('title')}
      </h2>
      <p
        className={`mt-6 text-zinc-400 text-base sm:text-lg leading-relaxed max-w-3xl${reveal}`}
      >
        {t('lede')}
      </p>
      <ul className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 list-none p-0 m-0">
        {business.team.map((m, i) => {
          const c = members[m.slug]
          return (
            <li
              key={m.slug}
              onMouseMove={onCardMove}
              onMouseLeave={onCardLeave}
              className={`group relative border border-zinc-800/80 bg-zinc-950/40 overflow-hidden flex flex-col transition-colors duration-500 hover:border-accent/40${cardReveal}`}
            >
              {/* Pointer-following red shine */}
              <div
                className="team-glow absolute inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-300"
                aria-hidden
              />

              <div className="relative z-10 aspect-[4/5] w-full overflow-hidden bg-zinc-950 border-b border-zinc-800/60">
                <Image
                  src={m.photo}
                  alt={c?.alt ?? m.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
              </div>
              <div className="relative z-10 p-5 flex-1 flex flex-col">
                <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-xl uppercase text-white mt-1.5 leading-tight">
                  {m.name}
                </h3>
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-accent/90 mt-2">
                  {c?.role}
                </p>
                <p className="text-zinc-500 text-sm mt-3 leading-relaxed flex-1">
                  {c?.bio}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
