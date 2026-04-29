import { getTranslations, setRequestLocale } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/metadata'
import { buildFaqSchema } from '@/lib/schema'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import PageEndModule from '@/components/layout/PageEndModule'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'FaqPage' })
  const keywords = t.raw('metaKeywords') as string[]
  return buildPageMetadata({
    locale,
    pathname: '/preguntas-frecuentes',
    title: t('metaTitle'),
    description: t('metaDesc'),
    keywords,
  })
}

export default async function PreguntasFrecuentesPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'FaqPage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const items = t.raw('items') as { q: string; a: string }[]

  return (
    <PageLayout
      locale={locale}
      breadcrumb={[
        { href: '/', label: tLayout('breadcrumbHome') },
        { href: '', label: t('metaTitle') },
      ]}
      extraJsonLd={buildFaqSchema(items)}
      hero={
        <PageHero
          eyebrow={t('heroEyebrow')}
          title={t('heroTitle')}
          lede={t('heroLede')}
        />
      }
    >
      <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto w-full">
        {items.map((f) => (
          <div key={f.q} className="border-b border-zinc-800/80">
            <details className="group">
              <summary className="cursor-pointer py-4 pr-2 list-none [&::-webkit-details-marker]:hidden">
                <h3 className="inline font-mono text-sm text-zinc-200 font-normal">
                  {f.q}
                </h3>
              </summary>
              <p className="text-zinc-500 text-sm pb-4 pl-0 leading-relaxed">
                {f.a}
              </p>
            </details>
          </div>
        ))}

        <PageEndModule locale={locale} currentHref="/preguntas-frecuentes" />
        </div>
      </div>
    </PageLayout>
  )
}
