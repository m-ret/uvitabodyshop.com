import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import PageEndModule from '@/components/layout/PageEndModule'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }
type Section = { title: string; body: string }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' })
  return buildPageMetadata({
    locale,
    pathname: '/privacidad',
    title: t('metaTitle'),
    description: t('metaDesc'),
    ...(locale === 'es'
      ? { keywords: t.raw('metaKeywords') as string[] }
      : {}),
  })
}

export default async function PrivacidadPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'PrivacyPage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const sections = t.raw('sections') as Section[]

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
        <div className="max-w-3xl mx-auto w-full">
          <p className="font-mono text-xs text-zinc-500 mb-10">
            {t('lastUpdated')}
          </p>
          {sections.map((s) => (
            <section key={s.title} className="mb-10">
              <h2 className="font-display text-xl uppercase text-white mb-3">
                {s.title}
              </h2>
              <p className="text-zinc-400 text-base leading-relaxed">
                {s.body}
              </p>
            </section>
          ))}
        </div>
        <div className="max-w-6xl mx-auto w-full">
          <PageEndModule locale={locale} currentHref="/privacidad" />
        </div>
      </div>
    </PageLayout>
  )
}
