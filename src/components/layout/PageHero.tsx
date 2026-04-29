import type { ReactNode } from 'react'

/**
 * Shared hero for deep marketing routes — typographic match to HomePage/DESIGN.md
 * (mono eyebrow, display H1, zinc lede, no border-radius in layout).
 */
export default function PageHero({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: string
  children?: ReactNode
}) {
  return (
    <div className="px-6 sm:px-12 lg:px-24 pb-10 sm:pb-12 pt-2">
      <div className="max-w-6xl mx-auto w-full">
        {eyebrow && (
          <p className="font-mono text-xs tracking-[0.25em] uppercase text-zinc-500 mb-4">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] uppercase tracking-tight text-white">
          {title}
        </h1>
        {lede && (
          <p className="mt-6 text-base sm:text-lg text-zinc-400 leading-relaxed max-w-5xl text-pretty">
            {lede}
          </p>
        )}
        {children}
      </div>
    </div>
  )
}
