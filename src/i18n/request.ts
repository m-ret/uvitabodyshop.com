import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale

  const [common, pages, home] = await Promise.all([
    import(`../../messages/${locale}/common.json`),
    import(`../../messages/${locale}/pages.json`),
    import(`../../messages/${locale}/home.json`),
  ])

  const serviceDetail =
    locale === 'en'
      ? (await import('../../messages/en/service-detail.json')).default
      : {}

  return {
    locale,
    messages: {
      ...common.default,
      ...pages.default,
      ...home.default,
      ...serviceDetail,
    },
  }
})
