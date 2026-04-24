import Image from 'next/image'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { business, getGuideBySlug, getServiceBySlug } from '@/data/business'
import { buildPageMetadata } from '@/lib/metadata'
import { buildArticleSchema, jsonLd } from '@/lib/schema'
import PageLayout from '@/components/layout/PageLayout'
import LeadCaptureSection from '@/components/lead/LeadCaptureSection'
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
      title: 'Guía no encontrada',
      description: business.meta.descriptionEs,
      index: false,
    })
  }
  return buildPageMetadata({
    locale,
    pathname: `/guias/${g.slug}`,
    title: g.title,
    description: g.summary,
    ogImage: g.heroImage,
    ...(locale === 'es' ? { keywords: [...g.keywords] } : {}),
  })
}

function ArticleJsonLd({
  slug,
  locale,
}: {
  slug: string
  locale: string
}) {
  const g = getGuideBySlug(slug)
  if (!g) return null
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLd(
        buildArticleSchema({
          slug: g.slug,
          title: g.title,
          description: g.summary,
          image: g.heroImage,
          datePublished: g.publishedIso,
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

  const tGuide = await getTranslations({ locale, namespace: 'GuidePage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const tSvc = await getTranslations({ locale, namespace: 'ServicePage' })
  const tLead = await getTranslations({ locale, namespace: 'LeadCapture' })

  const related = g.related
    .map((s) => getServiceBySlug(s))
    .filter((s): s is NonNullable<typeof s> => s != null)

  return (
    <>
      <ArticleJsonLd slug={g.slug} locale={locale} />
      <PageLayout
        locale={locale}
        breadcrumb={[
          { href: '/', label: tLayout('breadcrumbHome') },
          { href: '/servicios', label: tSvc('breadcrumbServices') },
          { href: '', label: g.eyebrow },
        ]}
      >
        <div className="px-6 sm:px-12 lg:px-24 pt-2 pb-8">
          <p className="max-w-6xl mx-auto font-mono text-xs text-accent/90 tracking-widest uppercase">
            {g.eyebrow}
          </p>
          <div className="max-w-6xl mx-auto mt-4 relative w-full aspect-[21/9] min-h-[180px] border border-zinc-800/80">
            <Image
              src={g.heroImage}
              alt={g.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>

        <div className="px-6 sm:px-12 lg:px-24 pb-20 max-w-3xl">
          <h1 className="font-display text-[clamp(1.75rem,4vw,3rem)] leading-tight uppercase text-white">
            {g.title}
          </h1>
          <p className="mt-4 text-zinc-500 font-mono text-xs">
            {tGuide('minRead', {
              minutes: g.readingMinutes,
              date: g.publishedIso,
            })}
          </p>
          <p className="mt-6 text-zinc-400 text-base leading-relaxed">
            {g.summary}
          </p>

          <nav
            className="mt-10 p-4 border border-zinc-800/60 bg-zinc-950/40"
            aria-label={tGuide('toc')}
          >
            <p className="font-mono text-[10px] uppercase text-zinc-500 tracking-widest mb-3">
              {tGuide('toc')}
            </p>
            <ol className="list-decimal pl-5 space-y-1 text-sm text-zinc-400">
              {g.sections.map((sec, i) => (
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

          {g.sections.map((sec, i) => (
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

          <p className="mt-10">
            <Link
              href="/contacto"
              className="inline-flex px-6 py-3 bg-accent text-white text-xs font-medium tracking-wide uppercase hover:bg-accent-hover"
            >
              {tGuide('cta')}
            </Link>
          </p>

          <LeadCaptureSection
            title={tLead('title')}
            description={tLead('description')}
            initialServiceSlug={related[0]?.slug ?? ''}
          />
        </div>
      </PageLayout>
    </>
  )
}
