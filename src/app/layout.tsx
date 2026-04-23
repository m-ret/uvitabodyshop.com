import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, DM_Sans, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { business, siteUrl, buildStructuredData } from '@/data/business'
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
      'x-default': '/',
    },
  },
  openGraph: {
    // images populated by src/app/opengraph-image.tsx (Next App Router convention)
    type: 'website',
    locale: 'es_CR',
    url: siteUrl,
    siteName: business.name,
    title: `${business.name} — Enderezado y Pintura Profesional`,
    description: business.meta.descriptionEs,
  },
  twitter: {
    // images populated by src/app/twitter-image.tsx
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
  icons: { icon: '/favicon.ico' },
  category: 'automotive',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const structuredData = buildStructuredData()
  return (
    <html
      lang="es"
      className={`${bebasNeue.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {children}
        <Analytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  )
}
