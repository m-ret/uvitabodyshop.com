import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { business, getZoneBySlug } from '@/data/business'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import PageEndModule from '@/components/layout/PageEndModule'
import type { ExploreLink } from '@/components/layout/ExploreNav'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string; zona: string }> }

export function generateStaticParams() {
  const pairs: { locale: string; zona: string }[] = []
  for (const locale of routing.locales) {
    for (const z of business.zones) {
      pairs.push({ locale, zona: z.slug })
    }
  }
  return pairs
}

export async function generateMetadata({ params }: Props) {
  const { locale, zona } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const z = getZoneBySlug(zona)
  if (!z) {
    return buildPageMetadata({
      locale,
      pathname: '/',
      title: 'Zona no encontrada',
      description: business.meta.descriptionEs,
      index: false,
    })
  }
  return buildPageMetadata({
    locale,
    pathname: `/zonas/${z.slug}`,
    title: `Taller de chapa y pintura cerca de ${z.name} · Zona Sur`,
    description: `${z.lede} Atención a ${z.name} y alrededores. ${business.hours.display}.`,
    ...(locale === 'es'
      ? {
          keywords: [
            `body shop ${z.name.toLowerCase()}`,
            'pintura automotriz zona sur',
            'enderezado costa rica',
          ],
        }
      : {}),
  })
}

export default async function ZonaPage({ params }: Props) {
  const { locale, zona: zonaSlug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const z = getZoneBySlug(zonaSlug)
  if (!z) notFound()

  const related = business.services.slice(0, 3)
  const tZone = await getTranslations({ locale, namespace: 'ZonePage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })

  const prependLinks: ExploreLink[] = related.map((s) => ({
    href: `/servicios/${s.slug}`,
    label: locale === 'en' ? s.en : s.es,
  }))

  return (
    <PageLayout
      locale={locale}
      breadcrumb={[
        { href: '/', label: tLayout('breadcrumbHome') },
        { href: '', label: `Zona: ${z.name}` },
      ]}
      hero={
        <PageHero
          eyebrow={z.eyebrow}
          title={`${business.name} · ${z.name}`}
          lede={z.lede}
        />
      }
    >
      <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto w-full">
        <p className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-6">
          {z.driveTime}
        </p>
        <ul className="space-y-4 list-none p-0 m-0">
          {z.localCues.map((line) => (
            <li
              key={line}
              className="border-l-2 border-accent/30 pl-4 text-zinc-400 text-sm sm:text-base leading-relaxed"
            >
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-10 pt-10 border-t border-zinc-800/50">
          <h2 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">
            {tZone('relatedServices')}
          </h2>
          <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
            {related.map((s) => (
              <li key={s.slug}>
                <Link
                  className="font-mono text-[10px] uppercase text-accent border border-zinc-700 px-3 py-2 hover:border-accent/60"
                  href={`/servicios/${s.slug}`}
                >
                  {locale === 'en' ? s.en : s.es}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <PageEndModule
          locale={locale}
          currentHref={`/zonas/${z.slug}`}
          prependLinks={prependLinks}
        />
        </div>
      </div>
    </PageLayout>
  )
}
