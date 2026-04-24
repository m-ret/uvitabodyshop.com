import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { business } from '@/data/business'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import LeadCaptureSection from '@/components/lead/LeadCaptureSection'
import { routing } from '@/i18n/routing'

const g = business.guarantee

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'GuaranteePage' })
  return buildPageMetadata({
    locale,
    pathname: '/garantia',
    title: t('metaTitle'),
    description: t('metaDesc'),
    ogImage: '/opengraph-image',
    keywords: ['garantía pintura automotriz', 'garantía taller uvita'],
  })
}

export default async function GarantiaPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'GuaranteePage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const tLead = await getTranslations({ locale, namespace: 'LeadCapture' })

  return (
    <PageLayout
      locale={locale}
      breadcrumb={[
        { href: '/', label: tLayout('breadcrumbHome') },
        { href: '', label: t('metaTitle') },
      ]}
    >
      <PageHero eyebrow={g.eyebrow} title={g.title} lede={g.summary} />
      <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28 max-w-3xl">
        <section className="mb-12" aria-labelledby="cobertura">
          <h2
            id="cobertura"
            className="font-display text-xl uppercase mb-4 text-white"
          >
            {t('coversTitle')}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm sm:text-base">
            {g.terms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="mb-12" aria-labelledby="limita">
          <h2
            id="limita"
            className="font-display text-xl uppercase mb-4 text-white"
          >
            {t('limitsTitle')}
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-zinc-400 text-sm sm:text-base">
            {g.limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="reclamo">
          <h2
            id="reclamo"
            className="font-display text-xl uppercase mb-4 text-white"
          >
            {t('claimTitle')}
          </h2>
          <ol className="list-decimal pl-5 space-y-3 text-zinc-400 text-sm sm:text-base">
            {g.claimProcess.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <LeadCaptureSection
          title={tLead('title')}
          description={tLead('description')}
        />
      </div>
    </PageLayout>
  )
}
