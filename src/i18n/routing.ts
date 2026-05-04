import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localePrefix: 'as-needed',
  // Don't 302 by Accept-Language: Googlebot sees one URL, English users
  // would get redirected to /en — soft cloaking. Locale switcher only.
  localeDetection: false,
})
