import Image from 'next/image'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import LeadCaptureSection from '@/components/lead/LeadCaptureSection'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

type ExploreLink = { href: string; label: string }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  const keywords = t.raw('metaKeywords') as string[]
  return buildPageMetadata({
    locale,
    pathname: '/sobre-nosotros',
    title: t('metaTitle'),
    description: t('metaDesc'),
    ogImage: '/images/craft.avif',
    keywords,
  })
}

export default async function SobreNosotrosPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const tLead = await getTranslations({ locale, namespace: 'LeadCapture' })
  const paragraphs = t.raw('paragraphs') as string[]
  const exploreLinks = t.raw('exploreLinks') as ExploreLink[]

  return (
    <PageLayout
      locale={locale}
      breadcrumb={[
        { href: '/', label: tLayout('breadcrumbHome') },
        { href: '', label: t('metaTitle') },
      ]}
    >
      <PageHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        lede={t('heroLede')}
      />
      <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <aside className="lg:col-span-5 space-y-10">
            <div className="relative aspect-[4/5] w-full min-h-[260px] max-h-[min(72vh,560px)] overflow-hidden border border-zinc-800 bg-zinc-950">
              <Image
                src="/images/craft.avif"
                alt={t('ownerImageAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
            </div>

            <nav
              aria-label={t('exploreNavAria')}
              className="border border-zinc-800/80 bg-zinc-950/50 p-6 sm:p-7"
            >
              <h2 className="font-display text-lg sm:text-xl uppercase tracking-tight text-white mb-2">
                {t('exploreTitle')}
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                {t('exploreLead')}
              </p>
              <ul className="m-0 flex list-none flex-col gap-2 p-0">
                {exploreLinks.map((link) => (
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
          </aside>

          <div className="lg:col-span-7 min-w-0">
            <div className="max-w-prose">
              {paragraphs.map((p, i) => (
                <p
                  key={i}
                  className="text-zinc-400 text-base sm:text-lg leading-relaxed mb-6 last:mb-0"
                >
                  {p}
                </p>
              ))}
              <p className="mt-10">
                <Link
                  href="/contacto"
                  className="font-mono text-xs tracking-[0.2em] uppercase text-accent hover:text-accent-hover"
                >
                  {t('contactLink')}
                </Link>
              </p>
            </div>

            <LeadCaptureSection
              title={tLead('title')}
              description={tLead('description')}
            />
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
