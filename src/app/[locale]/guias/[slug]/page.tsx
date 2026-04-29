import Image from 'next/image'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import {
  business,
  getGuideBySlug,
  getGuideContent,
  getServiceBySlug,
  zoneDisplayName,
} from '@/data/business'
import { buildPageMetadata } from '@/lib/metadata'
import { buildArticleSchema, jsonLd } from '@/lib/schema'
import PageLayout from '@/components/layout/PageLayout'
import PageEndModule from '@/components/layout/PageEndModule'
import type { ExploreLink } from '@/components/layout/ExploreNav'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  const pairs: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const g of business.guides) {
      pairs.push({ locale, slug: g.slug })
    }
  }
  return pairs
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const g = getGuideBySlug(slug)
  if (!g) {
    return buildPageMetadata({
      locale,
      pathname: '/',
      title: locale === 'en' ? 'Guide not found' : 'Guía no encontrada',
      description: business.meta.descriptionEs,
      index: false,
    })
  }
  const gc = getGuideContent(g, locale as 'es' | 'en')
  return buildPageMetadata({
    locale,
    pathname: `/guias/${g.slug}`,
    title: gc.title,
    description: gc.summary,
    ...(locale === 'es' ? { keywords: [...g.keywords] } : {}),
  })
}

function ArticleJsonLd({
  slug,
  locale,
}: {
  slug: string
  locale: 'es' | 'en'
}) {
  const g = getGuideBySlug(slug)
  if (!g) return null
  const gc = getGuideContent(g, locale)
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLd(
        buildArticleSchema({
          slug: g.slug,
          title: gc.title,
          description: gc.summary,
          image: g.heroImage,
          datePublished: g.publishedIso,
          dateModified: g.dateModified ?? g.publishedIso,
          locale,
        })
      )}
    />
  )
}

export default async function GuiaPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const g = getGuideBySlug(slug)
  if (!g) notFound()

  const localeUi = locale as 'es' | 'en'
  const gc = getGuideContent(g, localeUi)

  const tGuide = await getTranslations({ locale, namespace: 'GuidePage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const tSvc = await getTranslations({ locale, namespace: 'ServicePage' })

  const related = g.related
    .map((s) => getServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => s != null)

  const prependLinks: ExploreLink[] = related.map((s) => ({
    href: `/servicios/${s.slug}`,
    label: localeUi === 'en' ? s.en : s.es,
  }))

  return (
    <>
      <ArticleJsonLd slug={g.slug} locale={localeUi} />
      <PageLayout
        locale={locale}
        breadcrumb={[
          { href: '/', label: tLayout('breadcrumbHome') },
          { href: '/servicios', label: tSvc('breadcrumbServices') },
          { href: '', label: gc.eyebrow },
        ]}
        hero={
          <div className="px-6 sm:px-12 lg:px-24 pt-2 pb-8 sm:pb-10">
            <div className="max-w-6xl mx-auto w-full">
              <p className="font-mono text-xs text-accent/90 tracking-widest uppercase">
                {gc.eyebrow}
              </p>
              <div className="mt-4 relative w-full aspect-[21/9] min-h-[180px] border border-zinc-800/80">
                <Image
                  src={g.heroImage}
                  alt={gc.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1152px) 100vw, 1152px"
                />
              </div>
              <h1 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight uppercase text-white mt-8">
                {gc.title}
              </h1>
              <p className="mt-4 text-zinc-500 font-mono text-xs">
                {tGuide('minRead', {
                  minutes: g.readingMinutes,
                  date: g.publishedIso,
                })}
              </p>
              <p className="mt-6 text-zinc-400 text-base leading-relaxed">
                {gc.summary}
              </p>
            </div>
          </div>
        }
      >
        <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28">
          <div className="max-w-6xl mx-auto w-full">
          <nav
            className="mt-10 p-4 border border-zinc-800/60 bg-zinc-950/40"
            aria-label={tGuide('toc')}
          >
            <p className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest mb-3">
              {tGuide('toc')}
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-zinc-400">
              {gc.sections.map((sec, i) => (
                <li key={sec.heading}>
                  <a
                    href={`#g-${i}`}
                    className="text-accent/90 hover:text-accent"
                  >
                    {sec.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {gc.sections.map((sec, i) => (
            <section
              key={sec.heading}
              id={`g-${i}`}
              className="mt-12 scroll-mt-28"
            >
              <h2 className="font-display text-lg sm:text-xl uppercase text-white mb-4">
                {sec.heading}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                {sec.body}
              </p>
            </section>
          ))}

          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-zinc-800/50">
              <h2 className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4">
                {tGuide('related')}
              </h2>
              <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
                {related.map((s) => (
                  <li key={s!.slug}>
                    <Link
                      href={`/servicios/${s!.slug}`}
                      className="font-mono text-[10px] uppercase text-accent border border-zinc-700 px-3 py-2 hover:border-accent/60"
                    >
                      {locale === 'en' ? s!.en : s!.es}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <section
            aria-labelledby="guide-zones"
            className="mt-12 pt-10 border-t border-zinc-800/50"
          >
            <h2
              id="guide-zones"
              className="font-mono text-xs text-zinc-500 uppercase tracking-widest mb-4"
            >
              {locale === 'en' ? 'We serve' : 'Atendemos en'}
            </h2>
            <ul className="flex flex-wrap gap-3 list-none p-0 m-0">
              {business.zones.map((z) => (
                <li key={z.slug}>
                  <Link
                    href={`/zonas/${z.slug}`}
                    className="font-mono text-[10px] uppercase text-accent border border-zinc-700 px-3 py-2 hover:border-accent/60"
                  >
                    {zoneDisplayName(z, localeUi)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <PageEndModule
            locale={locale}
            currentHref={`/guias/${g.slug}`}
            prependLinks={prependLinks}
            initialServiceSlug={related[0]?.slug ?? ''}
          />
          </div>
        </div>
      </PageLayout>
    </>
  )
}
