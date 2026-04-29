import { hasLocale } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import HomePage from '@/components/home/HomePage'
import { buildPageMetadata } from '@/lib/metadata'
import {
  buildBreadcrumbSchema,
  buildWebsiteSchema,
  jsonLd,
} from '@/lib/schema'
import { routing } from '@/i18n/routing'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'Home' })
  const keywords = t.raw('metaKeywords') as string[]
  return buildPageMetadata({
    locale,
    pathname: '/',
    title: t('metaTitle'),
    description: t('metaDesc'),
    ogImage: '/opengraph-image',
    keywords,
  })
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const tLayout = await getTranslations({ locale, namespace: 'PageLayout' })
  const websiteSchema = buildWebsiteSchema(locale as 'es' | 'en')
  const homeBreadcrumb = buildBreadcrumbSchema(
    [{ href: '', label: tLayout('breadcrumbHome') }],
    locale
  )
  const homeJsonLd = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(websiteSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(homeBreadcrumb)}
      />
    </>
  )
  return <HomePage extraJsonLd={homeJsonLd} />
}
