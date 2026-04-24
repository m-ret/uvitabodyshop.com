import { Suspense } from 'react'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { business, displayContact } from '@/data/business'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import ContactQuoteForm from '@/components/contact/ContactQuoteForm'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'ContactPage' })
  const c = displayContact(locale as 'es' | 'en')
  const keywords = t.raw('metaKeywords') as string[]
  return buildPageMetadata({
    locale,
    pathname: '/contacto',
    title: t('metaTitle'),
    description: `${t('metaDesc')} ${c.hoursDisplay}. ${business.address.locationDisplay}.`,
    keywords,
  })
}

function FormFallback({ message }: { message: string }) {
  return <p className="text-sm text-zinc-500 font-mono">{message}</p>
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'ContactPage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const c = displayContact(locale as 'es' | 'en')

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
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          <div className="order-2 lg:order-1">
            <Suspense fallback={<FormFallback message={t('formLoading')} />}>
              <ContactQuoteForm />
            </Suspense>
          </div>
          <div className="order-1 lg:order-2 space-y-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                {t('whatsapp')}
              </p>
              <a
                href={c.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-200 text-lg border-b border-zinc-700 hover:border-accent hover:text-accent"
              >
                {c.phoneDisplay}
              </a>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                {t('hours')}
              </p>
              <p className="text-zinc-400">{c.hoursDisplay}</p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                {t('location')}
              </p>
              <p className="text-zinc-400">{c.locationDisplay}</p>
            </div>
            <div className="border border-zinc-800 aspect-video w-full overflow-hidden">
              <iframe
                title={t('mapTitle')}
                src={business.map.embedUrl}
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={business.map.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[10px] tracking-[0.2em] uppercase text-accent hover:text-accent-hover"
            >
              {t('mapsLink')}
            </a>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
