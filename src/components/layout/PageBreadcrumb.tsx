'use client'

import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { BreadcrumbNode } from '@/lib/schema'

function joinClasses(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/**
 * Renders a hairline BreadcrumbList trail; last item is plain text.
 */
export default function PageBreadcrumb({ trail }: { trail: BreadcrumbNode[] }) {
  const t = useTranslations('PageLayout')
  if (trail.length === 0) return null

  return (
    <nav
      className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24 py-4"
      aria-label={t('breadcrumbNavAria')}
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-[0.12em] uppercase text-zinc-500 list-none p-0 m-0">
        {trail.map((node, i) => {
          const isLast = i === trail.length - 1
          return (
            <li key={`${node.label}-${i}`} className="flex items-center gap-2">
              {i > 0 && (
                <span className="text-zinc-700" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !node.href ? (
                <span
                  className={joinClasses(
                    isLast && 'text-zinc-300 max-w-[min(100%,14rem)] truncate sm:max-w-none'
                  )}
                >
                  {node.label}
                </span>
              ) : (
                <Link
                  href={node.href}
                  className="text-zinc-500 hover:text-accent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {node.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
