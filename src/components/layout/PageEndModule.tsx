import { getTranslations } from 'next-intl/server'
import QuoteForm from '@/components/home/QuoteForm'
import ExploreNav, { type ExploreLink } from '@/components/layout/ExploreNav'

type PresetService =
  | 'enderezado'
  | 'pintura-completa'
  | 'retoques-pintura'
  | 'reparacion-golpes'
  | 'instalacion-accesorios'
  | 'otro'

const PRESET = new Set<string>([
  'enderezado',
  'pintura-completa',
  'retoques-pintura',
  'reparacion-golpes',
  'instalacion-accesorios',
  'otro',
])

function normalizeInitialService(slug: string): PresetService | '' {
  return PRESET.has(slug) ? (slug as PresetService) : ''
}

/**
 * Bottom-of-page composition shared by every inner SEO route except About:
 * embedded quote form on the left, sticky cross-link aside on the right. The
 * About page keeps its own image-on-top variant.
 *
 * - Reads the canonical Explore + LeadCapture namespaces server-side so call
 *   sites only pass routing-specific data.
 * - `prependLinks` lets guides/zones surface related services first.
 * - `currentHref` filters the active route from the list.
 */
export default async function PageEndModule({
  locale,
  currentHref,
  prependLinks = [],
  initialServiceSlug = '',
}: {
  locale: string
  currentHref?: string
  prependLinks?: ExploreLink[]
  initialServiceSlug?: string
}) {
  const tLead = await getTranslations({ locale, namespace: 'LeadCapture' })
  const tExplore = await getTranslations({ locale, namespace: 'Explore' })

  const baseLinks = tExplore.raw('links') as ExploreLink[]
  const merged: ExploreLink[] = []
  const seen = new Set<string>()
  for (const link of [...prependLinks, ...baseLinks]) {
    if (seen.has(link.href)) continue
    seen.add(link.href)
    merged.push(link)
  }

  const initialService = normalizeInitialService(initialServiceSlug)

  return (
    <section
      id="cotizar"
      className="mt-16 pt-16 border-t border-zinc-800/60 scroll-mt-28"
      aria-labelledby="embedded-quote-heading"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <div className="lg:col-span-7 min-w-0">
          <h2
            id="embedded-quote-heading"
            className="font-display text-xl sm:text-2xl uppercase text-white mb-3"
          >
            {tLead('title')}
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
            {tLead('description')}
          </p>
          <div className="max-w-xl border border-zinc-800/80 bg-zinc-950/40 p-6 sm:p-8">
            <QuoteForm
              key={initialService || 'embedded-lead'}
              initialService={initialService}
            />
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
          <ExploreNav
            title={tExplore('title')}
            lead={tExplore('lead')}
            ariaLabel={tExplore('navAria')}
            links={merged}
            currentHref={currentHref}
          />
        </aside>
      </div>
    </section>
  )
}
