import type { ReactNode } from 'react'
import Navigation from '@/components/ui/Navigation'
import SiteFooter from '@/components/ui/SiteFooter'
import PageBreadcrumb from '@/components/layout/PageBreadcrumb'
import PageContactCta from '@/components/layout/PageContactCta'
import { buildBreadcrumbSchema, type BreadcrumbNode, jsonLd } from '@/lib/schema'

export default function PageLayout({
  breadcrumb,
  showContactCta = true,
  hero,
  children,
  extraJsonLd,
  locale = 'es',
}: {
  /** Trail from Inicio; last node usually has empty `href` for the current page. */
  breadcrumb: BreadcrumbNode[]
  /** Set false on routes where a duplicate call-to-call strip would clutter the flow. */
  showContactCta?: boolean
  /** Optional hero band (e.g. `PageHero`) rendered after breadcrumbs and before the contact strip. */
  hero?: ReactNode
  children: ReactNode
  /** Colocated schema.org graph fragments (e.g. FAQPage, Service, Article). */
  extraJsonLd?: unknown | unknown[]
  /** Active locale for localized absolute URLs in JSON-LD breadcrumbs. */
  locale?: string
}) {
  const scripts: unknown[] = []
  if (breadcrumb.length > 0) {
    scripts.push(buildBreadcrumbSchema(breadcrumb, locale))
  }
  if (extraJsonLd !== undefined) {
    if (Array.isArray(extraJsonLd)) {
      scripts.push(...extraJsonLd)
    } else {
      scripts.push(extraJsonLd)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {scripts.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(data)}
        />
      ))}
      <Navigation />
      <div className="pt-[calc(env(safe-area-inset-top,0)+5.5rem)]" />
      <PageBreadcrumb trail={breadcrumb} />
      {hero ?? null}
      {showContactCta ? <PageContactCta /> : null}
      <div>{children}</div>
      <SiteFooter />
    </div>
  )
}
