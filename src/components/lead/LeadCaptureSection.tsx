import QuoteForm from '@/components/home/QuoteForm'

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
 * Embeds the home quote form on SEO templates (guides, zones, FAQ, etc.)
 * so long-tail pages capture leads without an extra navigation step.
 */
export default function LeadCaptureSection({
  title,
  description,
  initialServiceSlug = '',
}: {
  title: string
  description: string
  /** When set to a known service slug, preselects that option in the form. */
  initialServiceSlug?: string
}) {
  const initialService = normalizeInitialService(initialServiceSlug)

  return (
    <section
      id="cotizar"
      className="mt-16 pt-16 border-t border-zinc-800/60 scroll-mt-28"
      aria-labelledby="embedded-quote-heading"
    >
      <h2
        id="embedded-quote-heading"
        className="font-display text-xl sm:text-2xl uppercase text-white mb-3"
      >
        {title}
      </h2>
      <p className="text-zinc-500 text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
        {description}
      </p>
      <div className="max-w-xl border border-zinc-800/80 bg-zinc-950/40 p-6 sm:p-8">
        <QuoteForm
          key={initialService || 'embedded-lead'}
          initialService={initialService}
        />
      </div>
    </section>
  )
}
