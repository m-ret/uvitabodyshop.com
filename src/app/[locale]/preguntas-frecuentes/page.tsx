import { getTranslations, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/metadata'
import { buildFaqSchema } from '@/lib/schema'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import LeadCaptureSection from '@/components/lead/LeadCaptureSection'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'FaqPage' })
  return buildPageMetadata({
    locale,
    pathname: '/preguntas-frecuentes',
    title: t('metaTitle'),
    description: t('metaDesc'),
    keywords: [
      'preguntas body shop costa rica',
      'cotizar pintura carro uvita',
      'uvita body shop faq',
    ],
  })
}

export default async function PreguntasFrecuentesPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'FaqPage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const tLead = await getTranslations({ locale, namespace: 'LeadCapture' })
  const items = t.raw('items') as { q: string; a: string }[]

  return (
    <PageLayout
      locale={locale}
      breadcrumb={[
        { href: '/', label: tLayout('breadcrumbHome') },
        { href: '', label: t('metaTitle') },
      ]}
      extraJsonLd={buildFaqSchema(items)}
    >
      <PageHero
        eyebrow={t('heroEyebrow')}
        title={t('heroTitle')}
        lede={t('heroLede')}
      />
      <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28 max-w-3xl">
        {items.map((f) => (
          <div key={f.q} className="border-b border-zinc-800/80">
            <details className="group">
              <summary className="cursor-pointer font-mono text-sm text-zinc-200 py-4 pr-2 list-none [&::-webkit-details-marker]:hidden">
                {f.q}
              </summary>
              <p className="text-zinc-500 text-sm pb-4 pl-0 leading-relaxed">
                {f.a}
              </p>
            </details>
          </div>
        ))}

        <LeadCaptureSection
          title={tLead('title')}
          description={tLead('description')}
        />
      </div>
    </PageLayout>
  )
}
