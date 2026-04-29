import Image from 'next/image'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { business } from '@/data/business'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import PageEndModule from '@/components/layout/PageEndModule'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'ServicesIndexPage' })
  const keywords = t.raw('metaKeywords') as string[]
  return buildPageMetadata({
    locale,
    pathname: '/servicios',
    title: t('metaTitle'),
    description: t('metaDesc'),
    keywords,
  })
}

export default async function ServiciosIndexPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const localeUi = locale as 'es' | 'en'
  const t = await getTranslations({ locale, namespace: 'ServicesIndexPage' })
  const tSvc = await getTranslations({ locale, namespace: 'ServicePage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })

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
        <ul className="max-w-6xl mx-auto grid grid-cols-1 gap-6 list-none p-0 m-0">
          {business.services.map((s, i) => (
            <li key={s.slug}>
              <Link
                href={`/servicios/${s.slug}`}
                className="group flex flex-col sm:flex-row border border-zinc-800/80 bg-zinc-950/30 overflow-hidden hover:border-zinc-600 transition-colors"
              >
                <div className="relative w-full sm:w-2/5 aspect-[16/10] sm:aspect-auto sm:min-h-[200px]">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 40vw"
                  />
                </div>
                <div className="flex-1 p-6 sm:p-10">
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h2 className="font-display text-2xl sm:text-3xl uppercase text-white group-hover:text-accent transition-colors">
                    {localeUi === 'en' ? s.en : s.es}
                  </h2>
                  <p className="text-zinc-500 text-sm mt-3 max-w-2xl leading-relaxed">
                    {localeUi === 'en' ? s.descriptionEn : s.description}
                  </p>
                  <span className="mt-4 inline-block font-mono text-[10px] tracking-[0.2em] uppercase text-accent">
                    {tSvc('detailLink')}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="max-w-6xl mx-auto">
          <PageEndModule locale={locale} currentHref="/servicios" />
        </div>
      </div>
    </PageLayout>
  )
}
