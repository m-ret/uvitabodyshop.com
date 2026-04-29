import Image from 'next/image'
import { hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import {
  business,
  getServiceBySlug,
  type ServiceEntry,
} from '@/data/business'
import { buildPageMetadata } from '@/lib/metadata'
import { buildFaqSchema, buildServiceSchema, jsonLd } from '@/lib/schema'
import PageLayout from '@/components/layout/PageLayout'
import PageHero from '@/components/layout/PageHero'
import PageEndModule from '@/components/layout/PageEndModule'

type ServiceDetailMsg = {
  metaTitle: string
  metaDescription: string
  longDescription: string
  included: string[]
  process: { title: string; body: string }[]
  priceGuidance: string
  faqs: { q: string; a: string }[]
}

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() {
  const pairs: { locale: string; slug: string }[] = []
  for (const locale of routing.locales) {
    for (const s of business.services) {
      pairs.push({ locale, slug: s.slug })
    }
  }
  return pairs
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const s = getServiceBySlug(slug)
  const tSvc = await getTranslations({ locale, namespace: 'ServicePage' })
  if (!s) {
    return buildPageMetadata({
      locale,
      pathname: '/servicios',
      title: tSvc('notFoundTitle'),
      description: business.meta.descriptionEs,
      index: false,
    })
  }

  let metaTitle = s.meta.title
  let metaDescription = s.meta.description
  if (locale === 'en') {
    const messages = (await getMessages()) as {
      ServiceDetail?: Record<string, ServiceDetailMsg>
    }
    const d = messages.ServiceDetail?.[slug]
    if (d) {
      metaTitle = d.metaTitle
      metaDescription = d.metaDescription
    }
  }

  return buildPageMetadata({
    locale,
    pathname: `/servicios/${s.slug}`,
    title: metaTitle,
    description: metaDescription,
    ogImage: s.image,
    ...(locale === 'es' ? { keywords: s.meta.keywords } : {}),
  })
}

function ServiceJsonLd({
  service,
  locale,
  longDescription,
  priceGuidance,
}: {
  service: ServiceEntry
  locale: string
  longDescription: string
  priceGuidance: string
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={jsonLd(
        buildServiceSchema(service, {
          locale,
          longDescription,
          priceGuidance,
        })
      )}
    />
  )
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)
  const s = getServiceBySlug(slug)
  if (!s) notFound()

  const messages = (await getMessages()) as {
    ServiceDetail?: Record<string, ServiceDetailMsg>
  }
  const d = locale === 'en' ? messages.ServiceDetail?.[slug] : undefined

  const t = await getTranslations({ locale, namespace: 'ServicePage' })
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })

  const title = locale === 'en' ? s.en : s.es
  const longDescription = d?.longDescription ?? s.longDescription
  const included = d?.included ?? s.included
  const process = d?.process ?? s.process
  const priceGuidance = d?.priceGuidance ?? s.priceGuidance
  const faqs = d?.faqs ?? s.faqs

  return (
    <>
      <ServiceJsonLd
        service={s}
        locale={locale}
        longDescription={longDescription}
        priceGuidance={priceGuidance}
      />
      <PageLayout
        locale={locale}
        breadcrumb={[
          { href: '/', label: tLayout('breadcrumbHome') },
          { href: '/servicios', label: t('breadcrumbServices') },
          { href: '', label: title },
        ]}
        extraJsonLd={faqs.length > 0 ? buildFaqSchema(faqs) : undefined}
        hero={
          <>
            <div className="px-6 sm:px-12 lg:px-24 pb-8">
              <div className="max-w-6xl mx-auto">
                <div className="relative w-full aspect-[21/9] min-h-[200px] border border-zinc-800/80">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 100vw"
                  />
                </div>
              </div>
            </div>
            <PageHero title={title} lede={longDescription} />
          </>
        }
      >
        <div className="px-6 sm:px-12 lg:px-24 pb-20 max-w-6xl mx-auto space-y-16">
          <section aria-labelledby="incluye">
            <h2
              id="incluye"
              className="font-display text-xl sm:text-2xl uppercase text-white mb-6"
            >
              {t('included')}
            </h2>
            <ul className="list-disc list-outside pl-5 space-y-2 text-zinc-400 text-sm sm:text-base">
              {included.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="proceso">
            <h2
              id="proceso"
              className="font-display text-xl sm:text-2xl uppercase text-white mb-6"
            >
              {t('process')}
            </h2>
            <ol className="space-y-6 list-none p-0 m-0">
              {process.map((step) => (
                <li
                  key={step.title}
                  className="border-l-2 border-accent/40 pl-5 sm:pl-6"
                >
                  <p className="font-mono text-xs text-accent/90 tracking-wide">
                    {step.title}
                  </p>
                  <p className="text-zinc-400 text-sm sm:text-base mt-2">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="font-display text-xl sm:text-2xl uppercase text-white mb-4">
              {t('price')}
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl">
              {priceGuidance}
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl sm:text-2xl uppercase text-white mb-4">
              {t('faqs')}
            </h2>
            <div className="space-y-0 border-t border-zinc-800/80">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group border-b border-zinc-800/80"
                >
                  <summary className="cursor-pointer font-mono text-sm text-zinc-200 py-4 pr-2 list-none [&::-webkit-details-marker]:hidden">
                    {f.q}
                  </summary>
                  <p className="text-zinc-500 text-sm pb-4 pl-0">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <PageEndModule
            locale={locale}
            currentHref={`/servicios/${s.slug}`}
            initialServiceSlug={s.slug}
          />
        </div>
      </PageLayout>
    </>
  )
}
