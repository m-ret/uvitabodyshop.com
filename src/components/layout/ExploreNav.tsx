import { Link } from '@/i18n/navigation'

export type ExploreLink = { href: string; label: string }

/**
 * Cross-link rail surfaced on inner pages — visual peer of the About page's
 * sticky aside. Filters out the active route so the user never sees a link to
 * the page they are already on.
 */
export default function ExploreNav({
  title,
  lead,
  ariaLabel,
  links,
  currentHref,
}: {
  title: string
  lead: string
  ariaLabel: string
  links: ExploreLink[]
  /** Pathname (locale-relative, e.g. `/servicios`) to omit from the list. */
  currentHref?: string
}) {
  const visible = currentHref
    ? links.filter((l) => l.href !== currentHref)
    : links
  if (visible.length === 0) return null

  return (
    <nav
      aria-label={ariaLabel}
      className="border border-zinc-800/80 bg-zinc-950/50 p-6 sm:p-7"
    >
      <h2 className="font-display text-lg sm:text-xl uppercase tracking-tight text-white mb-2">
        {title}
      </h2>
      <p className="text-sm text-zinc-500 leading-relaxed mb-6">{lead}</p>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {visible.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="group flex w-full items-center justify-between gap-3 border border-zinc-800 bg-background/60 px-4 py-3 font-mono text-[11px] tracking-[0.18em] uppercase text-zinc-300 transition-colors hover:border-accent/60 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <span className="text-left leading-snug">{link.label}</span>
              <span
                className="shrink-0 text-accent transition-transform group-hover:translate-x-0.5"
                aria-hidden
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
