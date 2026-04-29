import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { headers } from 'next/headers'
import { business, siteUrl, buildStructuredData } from '@/data/business'
import { routing } from '@/i18n/routing'
import UtmCapture from '@/components/ui/UtmCapture'
import './globals.css'

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  display: 'swap',
})

/** Set by next-intl middleware on the request (see `HEADER_LOCALE_NAME`). */
const NEXT_INTL_LOCALE_HEADER = 'X-NEXT-INTL-LOCALE'

export const viewport: Viewport = {
  themeColor: '#050505',
  colorScheme: 'dark',
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} — Enderezado y Pintura Profesional en Uvita, Costa Rica`,
    template: `%s · ${business.name}`,
  },
  description: business.meta.descriptionEs,
  keywords: [...business.meta.keywords],
  applicationName: business.name,
  authors: [{ name: business.owner }],
  alternates: {
    canonical: '/',
    languages: {
      es: '/',
      en: '/en',
      'x-default': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CR',
    url: siteUrl,
    siteName: business.name,
    title: `${business.name} — Enderezado y Pintura Profesional`,
    description: business.meta.descriptionEs,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${business.name} — Enderezado y Pintura`,
    description: business.meta.descriptionEs,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'automotive',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headerList = await headers()
  const localeHeader = headerList.get(NEXT_INTL_LOCALE_HEADER)
  const locale =
    localeHeader === 'en' || localeHeader === 'es'
      ? localeHeader
      : routing.defaultLocale
  const htmlLang = locale === 'en' ? 'en' : 'es'
  const structuredData = buildStructuredData(locale)

  return (
    <html
      lang={htmlLang}
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <UtmCapture />
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  )
}
