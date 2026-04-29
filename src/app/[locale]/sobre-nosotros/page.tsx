import Image from 'next/image'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import PageEndModule from '@/components/layout/PageEndModule'
import TeamGrid from '@/components/sections/TeamGrid'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

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
  const paragraphs = t.raw('paragraphs') as string[]

  return (
    <PageLayout
      locale={locale}
      breadcrumb={[
        { href: '/', label: tLayout('breadcrumbHome') },
        { href: '', label: t('metaTitle') },
      ]}
      hero={
        <PageHero
          eyebrow={t('heroEyebrow')}
          title={t('heroTitle')}
          lede={t('heroLede')}
        />
      }
    >
      <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <aside className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <div className="relative aspect-[4/5] w-full min-h-[260px] max-h-[min(72vh,560px)] overflow-hidden border border-zinc-800 bg-zinc-950">
              <Image
                src="/images/fabricio.avif"
                alt={t('ownerImageAlt')}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
            </div>
          </aside>

          <div className="lg:col-span-7 min-w-0">
            <div className="max-w-5xl">
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
                  className="inline-flex items-center justify-center border border-accent px-6 py-3.5 font-mono text-xs tracking-[0.2em] uppercase text-white hover:bg-accent hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {t('contactLink')}
                </Link>
              </p>
            </div>
          </div>
        </div>

        <TeamGrid className="mt-20 sm:mt-24 pt-16 sm:pt-20 border-t border-zinc-800/60" />

        <div className="max-w-6xl mx-auto w-full">
          <PageEndModule locale={locale} currentHref="/sobre-nosotros" />
        </div>
      </div>
    </PageLayout>
  )
}
