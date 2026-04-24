import Image from 'next/image'
import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { business } from '@/data/business'
import { buildPageMetadata } from '@/lib/metadata'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import LeadCaptureSection from '@/components/lead/LeadCaptureSection'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  return buildPageMetadata({
    locale,
    pathname: '/sobre-nosotros',
    title: t('metaTitle'),
    description: t('metaDesc'),
    ogImage: '/images/craft.avif',
    keywords: [
      'taller de pintura uvita',
      'sobre uvita body shop',
      'fabricio ríos body shop',
    ],
  })
}

export default async function SobreNosotrosPage({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'AboutPage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const tLead = await getTranslations({ locale, namespace: 'LeadCapture' })
  const { story } = business

  return (
    <PageLayout
      locale={locale}
      breadcrumb={[
        { href: '/', label: tLayout('breadcrumbHome') },
        { href: '', label: t('metaTitle') },
      ]}
    >
      <PageHero eyebrow={story.eyebrow} title={story.title} lede={story.lede} />
      <div className="px-6 sm:px-12 lg:px-24 pb-20 sm:pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className="relative aspect-[4/5] w-full border border-zinc-800 bg-zinc-950 max-h-[min(80vh,520px)]">
            <Image
              src="/images/craft.avif"
              alt="Fabricio Ríos Ortiz en el taller de Uvita Body Shop"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="max-w-prose">
            {story.paragraphs.map((p, i) => (
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
