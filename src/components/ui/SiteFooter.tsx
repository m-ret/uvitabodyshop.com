'use client'

import type { ReactElement } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { business } from '@/data/business'
import Wordmark from './Wordmark'

const ICONS: Record<string, ReactElement> = {
  facebook: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  ),
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.53 2h3a5.5 5.5 0 0 0 4.5 4.5v3a8.43 8.43 0 0 1-4.5-1.32v6.31a6.5 6.5 0 1 1-6.5-6.5c.34 0 .68.03 1 .09v3.07a3.5 3.5 0 1 0 2.5 3.34V2z" />
    </svg>
  ),
  google: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 10.8v2.7h6.3a5.5 5.5 0 0 1-6.3 4.2 6 6 0 1 1 0-12 5.4 5.4 0 0 1 3.9 1.5l2-1.9A8.2 8.2 0 0 0 12 3a9 9 0 1 0 0 18c5.2 0 8.7-3.6 8.7-8.8 0-.6-.1-1-.1-1.4H12z" />
    </svg>
  ),
}

const PLATFORM_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  google: 'Google Business',
}

export default function SiteFooter() {
  const t = useTranslations('Footer')
  const { socialLinks } = business

  const footerPageLinks = [
    { href: '/sobre-nosotros', labelKey: 'about' as const },
    { href: '/servicios', labelKey: 'services' as const },
    { href: '/contacto', labelKey: 'contact' as const },
    { href: '/garantia', labelKey: 'warranty' as const },
    { href: '/preguntas-frecuentes', labelKey: 'faq' as const },
    { href: '/#contact', labelKey: 'quoteHome' as const },
  ]

  return (
    <footer className="py-12 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/50">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex items-center gap-5">
            <Wordmark variant="mark" theme="dark" size={64} />
            <div className="flex flex-col">
              <span className="font-display text-xl uppercase tracking-wider leading-none">
                Uvita Body Shop
              </span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 mt-1">
                {t('locationLine')}
              </span>
            </div>
          </div>

          {socialLinks.length > 0 && (
            <ul className="flex items-center gap-3 list-none">
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${PLATFORM_LABELS[link.platform] ?? link.platform} — ${link.handle}`}
                    className="inline-flex size-10 items-center justify-center border border-zinc-800 text-zinc-400 hover:text-accent hover:border-zinc-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {ICONS[link.platform]}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm text-zinc-500 border-t border-zinc-800/30 pt-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-3">
              {t('pages')}
            </p>
            <ul className="space-y-2 list-none p-0 m-0">
              {footerPageLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-zinc-500 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {t(l.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-3">
              {t('zones')}
            </p>
            <ul className="space-y-2 list-none p-0 m-0">
              {business.zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={`/zonas/${z.slug}`}
                    className="text-zinc-500 hover:text-accent"
                  >
                    {z.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-3">
              {t('guides')}
            </p>
            <ul className="space-y-2 list-none p-0 m-0">
              {business.guides.map((g) => (
                <li key={g.slug}>
                  <Link
                    href={`/guias/${g.slug}`}
                    className="text-zinc-500 hover:text-accent"
                  >
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <span className="font-mono text-xs text-zinc-600">{t('copyright')}</span>
      </div>
    </footer>
  )
}
