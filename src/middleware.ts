import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    /*
     * Match all pathnames except static assets, Next internals, API,
     * metadata routes (no file extension), and files with extensions.
     */
    '/((?!api|_next/static|_next/image|_vercel|opengraph-image|twitter-image|.*\\..*).*)',
  ],
}
