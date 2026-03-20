import Link from 'next/link'

const designs = [
  {
    number: '01',
    name: 'Industrial Red',
    description: 'Oscuro, alto contraste. Tipografia Bebas Neue con energia automotriz cruda.',
    href: '/1',
    gradient: 'linear-gradient(135deg, #1a0000 0%, #cc0000 50%, #330000 100%)',
    ready: true,
  },
  {
    number: '02',
    name: 'Color Spectrum',
    description: 'Mosaico calido de colores. Tipografia Syne con acentos dorados sobre paleta de pintura.',
    href: '/2',
    gradient: 'linear-gradient(135deg, #0a1628 0%, #0d7377 25%, #c4922a 50%, #c45420 75%, #a82020 100%)',
    ready: true,
  },
  {
    number: '03',
    name: 'Forge',
    description: 'Precision industrial. Tipografia masiva con tonos de acero y chispas naranjas.',
    href: '/3',
    gradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1e 30%, #ff4d00 70%, #0a0a0a 100%)',
    ready: true,
  },
  {
    number: '04',
    name: 'Clean Machine',
    description: 'Tema claro. Acento azul marino, auto 3D oscuro sobre blanco, tarjetas con sombras.',
    href: '/4',
    gradient: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 30%, #1e3a5f 70%, #0f172a 100%)',
    ready: true,
  },
  {
    number: '05',
    name: 'Neo-Brutalist',
    description: 'Grilla visible, auto 3D inmersivo, Space Mono, acentos naranjas, celdas modulares.',
    href: '/5',
    gradient: 'linear-gradient(135deg, #f2f2ed 0%, #e0e0db 30%, #ff5c00 60%, #1a1a1a 100%)',
    ready: true,
  },
]

export default function ExplorationRoot() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5]">

      {/* ===== HERO ===== */}
      <header className="relative px-6 sm:px-12 lg:px-24 pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Blueprint grid background — more visible */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Corner marks */}
        <div className="absolute top-6 left-6 w-6 h-6 border-l border-t border-zinc-600" />
        <div className="absolute top-6 right-6 w-6 h-6 border-r border-t border-zinc-600" />
        <div className="absolute bottom-6 left-6 w-6 h-6 border-l border-b border-zinc-600" />
        <div className="absolute bottom-6 right-6 w-6 h-6 border-r border-b border-zinc-600" />

        <div className="w-2.5 h-2.5 bg-[#cc0000] mb-8"
          style={{ animationName: 'explorationFadeIn', animationDuration: '0.4s', animationFillMode: 'both', animationDelay: '0.1s' }}
        />

        <div className="max-w-4xl">
          <p
            className="font-mono text-xs tracking-[0.3em] uppercase text-zinc-400 mb-4"
            style={{ animationName: 'explorationFadeIn', animationDuration: '0.6s', animationFillMode: 'both', animationDelay: '0.15s' }}
          >
            Fase de Dise&ntilde;o &mdash; Uvita Body Shop
          </p>
          <h1
            className="font-display text-[clamp(2.5rem,8vw,7rem)] leading-[0.85] uppercase"
            style={{ animationName: 'explorationFadeIn', animationDuration: '0.8s', animationFillMode: 'both', animationDelay: '0.25s' }}
          >
            Elija Su
            <br />
            Direcci&oacute;n.
          </h1>
          <p
            className="text-zinc-400 mt-6 text-base sm:text-lg max-w-2xl leading-relaxed"
            style={{ animationName: 'explorationFadeIn', animationDuration: '0.6s', animationFillMode: 'both', animationDelay: '0.45s' }}
          >
            Hemos dise&ntilde;ado 5 direcciones &uacute;nicas para su sitio web. Cada una es un
            prototipo interactivo con elementos 3D, animaciones y contenido real.{' '}
            <strong className="text-zinc-300">Elija la que m&aacute;s le guste</strong> &mdash;
            nosotros la convertimos en su sitio web final.
          </p>
        </div>

        <div
          className="flex flex-wrap gap-x-8 gap-y-3 mt-10"
          style={{ animationName: 'explorationFadeIn', animationDuration: '0.6s', animationFillMode: 'both', animationDelay: '0.6s' }}
        >
          {[
            { num: '01', text: 'Explore los 5 dise\u00f1os' },
            { num: '02', text: 'Elija su favorito' },
            { num: '03', text: 'Nosotros construimos el sitio' },
          ].map((step) => (
            <div key={step.num} className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#cc0000] tracking-wider">{step.num}</span>
              <span className="text-sm text-zinc-400">{step.text}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ===== DESIGN GRID ===== */}
      <main className="px-6 sm:px-12 lg:px-24 pb-16 sm:pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {designs.map((d, i) => (
            <Link
              key={d.number}
              href={d.href}
              className="group relative flex flex-col overflow-hidden border border-zinc-800/50 bg-zinc-950 hover:border-zinc-600 transition-all duration-500"
              style={{
                animationName: 'explorationCardIn',
                animationDuration: '0.7s',
                animationFillMode: 'both',
                animationDelay: `${0.7 + i * 0.12}s`,
              }}
            >
              <div
                className="h-48 sm:h-56 transition-transform duration-700 group-hover:scale-105"
                style={{ background: d.gradient }}
              />
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-xs text-zinc-400">{d.number}</span>
                  <div className="flex-1 h-px bg-zinc-800 group-hover:bg-zinc-600 transition-colors duration-500" />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl uppercase mb-2 group-hover:text-white transition-colors duration-300">
                  {d.name}
                </h2>
                <p className="text-sm text-zinc-400 leading-relaxed flex-1">
                  {d.description}
                </p>
                <div className="mt-4">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-zinc-400 group-hover:text-white transition-colors">
                    Ver Dise&ntilde;o &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* 6th tile — Proposal CTA */}
          <a
            href="#propuesta"
            className="group relative flex flex-col overflow-hidden border border-[#cc0000]/30 bg-zinc-950 hover:border-[#cc0000] transition-all duration-500"
            style={{
              animationName: 'explorationCardIn',
              animationDuration: '0.7s',
              animationFillMode: 'both',
              animationDelay: `${0.7 + 5 * 0.12}s`,
            }}
          >
            <div className="h-48 sm:h-56 relative overflow-hidden" style={{ background: '#0a0a0a' }}>
              <div className="absolute inset-0 opacity-[0.12]" style={{
                backgroundImage: 'linear-gradient(rgba(204,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(204,0,0,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-none text-[#cc0000] uppercase">&#x20A1;447.000</span>
                <span className="font-mono text-xs tracking-[0.3em] uppercase text-zinc-400 mt-2">Sitio Web Completo</span>
              </div>
              <div className="absolute top-4 left-4 w-2.5 h-2.5 bg-[#cc0000]" />
              <div className="absolute bottom-4 right-4 w-2.5 h-2.5 bg-[#cc0000]" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-[#cc0000]">$$</span>
                <div className="flex-1 h-px bg-[#cc0000]/20 group-hover:bg-[#cc0000]/40 transition-colors duration-500" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl uppercase mb-2 text-[#cc0000]">
                La Propuesta
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed flex-1">
                Sitio web completo, 4 semanas, optimizado para SEO, captura de clientes incluida.
              </p>
              <div className="mt-4">
                <span className="font-mono text-xs tracking-wider uppercase text-[#cc0000]/70 group-hover:text-[#cc0000] transition-colors">
                  Leer Propuesta &darr;
                </span>
              </div>
            </div>
          </a>
        </div>
      </main>

      {/* ===== PROPUESTA ===== */}
      <section id="propuesta" className="relative border-t border-zinc-800/50">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div className="relative px-6 sm:px-12 lg:px-24 py-24 sm:py-32">
          <div className="max-w-5xl mx-auto">

            {/* Header */}
            <div className="mb-20">
              <div className="w-2.5 h-2.5 bg-[#cc0000] mb-6" />
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-zinc-400 mb-4">
                Propuesta de Desarrollo Web
              </p>
              <h2 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.85] uppercase mb-6">
                Su Sitio Web.
                <br />
                <span className="text-[#cc0000]">Hecho Bien.</span>
              </h2>
              <p className="text-zinc-500 text-base sm:text-lg max-w-2xl leading-relaxed">
                Uvita Body Shop es el &uacute;nico taller profesional de la Zona Sur
                de Costa Rica sin un sitio web dedicado. Todos los competidores en la zona
                son invisibles en l&iacute;nea. <strong className="text-zinc-300">Esta es su oportunidad de dominar los resultados de b&uacute;squeda.</strong>
              </p>
            </div>

            {/* La Oportunidad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 pb-20 border-b border-zinc-800/50">
              <div>
                <h3 className="font-display text-2xl sm:text-3xl uppercase mb-4">
                  La <span className="text-[#cc0000]">Oportunidad</span>
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Cuando alguien en Uvita, Dominical u Ojochal busca
                  &ldquo;taller de pintura cerca&rdquo; o &ldquo;enderezado y pintura Costa Rica&rdquo;
                  ahora mismo &mdash; no aparece nada de su negocio. Sin ficha de Google con
                  sitio web. Sin forma de ver su trabajo, su cabina, su garant&iacute;a.
                  Los clientes est&aacute;n eligiendo a otros por defecto, no por m&eacute;rito.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed mt-4">
                  Un sitio web profesional cambia eso de la noche a la ma&ntilde;ana. Usted se convierte en el primer
                  resultado. El &uacute;nico resultado con fotos reales, servicios reales, pruebas reales.
                </p>
              </div>
              <div className="space-y-6">
                {[
                  { label: 'Cero competidores en l\u00ednea', desc: 'Ning\u00fan taller en la Zona Sur tiene un sitio web real. Usted ser\u00eda el primero.' },
                  { label: 'Capture clientes 24/7', desc: 'WhatsApp, tel\u00e9fono y formulario \u2014 los clientes lo contactan mientras duerme.' },
                  { label: 'Due\u00f1o de los resultados de b\u00fasqueda', desc: 'SEO optimizado desde el d\u00eda uno. "Taller Uvita" = su sitio web.' },
                  { label: 'Credibilidad profesional', desc: 'Los clientes ven su cabina, materiales y garant\u00eda \u2014 antes de llamar.' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-[#cc0000] mt-1.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-300">{item.label}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Qu\u00e9 incluye */}
            <div className="mb-20 pb-20 border-b border-zinc-800/50">
              <h3 className="font-display text-2xl sm:text-3xl uppercase mb-10">
                Qu&eacute; <span className="text-[#cc0000]">Incluye</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: 'Dise\u00f1o a Medida', desc: 'Su direcci\u00f3n elegida, refinada y pulida a calidad de producci\u00f3n. No es una plantilla \u2014 construido desde cero.' },
                  { title: 'Responsive y R\u00e1pido', desc: 'Perfecto en cualquier dispositivo. Optimizado con Next.js, im\u00e1genes optimizadas y carga r\u00e1pida.' },
                  { title: 'Hero 3D Interactivo', desc: 'Modelo 3D de auto que responde al scroll y mouse. Ning\u00fan otro taller en Costa Rica tiene esto.' },
                  { title: 'Base SEO', desc: 'Metadata estructurada, schema markup, sitemap, encabezados optimizados y targeting de palabras clave para Uvita/Zona Sur.' },
                  { title: 'Captura de Clientes', desc: 'Formulario de contacto, integraci\u00f3n WhatsApp, click-to-call \u2014 cada visitante tiene un camino directo para contactarlo.' },
                  { title: 'Animaciones Premium', desc: 'Reveals con scroll, efectos parallax y micro-interacciones que hacen que el sitio se sienta vivo y profesional.' },
                ].map((item) => (
                  <div key={item.title} className="p-6 border border-zinc-800/50 bg-zinc-950/50">
                    <div className="w-2 h-2 bg-[#cc0000] mb-4" />
                    <h4 className="font-display text-lg uppercase mb-2">{item.title}</h4>
                    <p className="text-sm text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inversi\u00f3n */}
            <div className="mb-20 pb-20 border-b border-zinc-800/50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h3 className="font-display text-2xl sm:text-3xl uppercase mb-4">
                    Inversi&oacute;n
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6">
                    Un sitio web profesional que lo posiciona como el taller #1 de
                    la Zona Sur. Inversi&oacute;n &uacute;nica, sin mensualidades, usted es
                    due&ntilde;o de todo.
                  </p>
                  <div className="space-y-3">
                    {[
                      'Dise\u00f1o y desarrollo a medida',
                      'Elementos 3D interactivos',
                      'Optimizaci\u00f3n SEO completa',
                      'Sistema de captura de clientes',
                      'Responsive (m\u00f3vil primero)',
                      'Redacci\u00f3n de contenido',
                      'Dominio incluido por 1 a\u00f1o',
                      'Asistencia con hosting',
                      '30 d\u00edas de soporte post-lanzamiento',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#cc0000] shrink-0" />
                        <span className="text-sm text-zinc-400">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price card */}
                <div className="relative p-8 sm:p-10 border border-zinc-800/50 bg-zinc-950">
                  <div className="absolute top-3 left-3 w-4 h-4 border-l border-t border-[#cc0000]" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-r border-t border-[#cc0000]" />
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-l border-b border-[#cc0000]" />
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-r border-b border-[#cc0000]" />

                  <p className="font-mono text-xs tracking-[0.3em] uppercase text-zinc-400 mb-4">
                    Paquete Completo
                  </p>
                  <div className="font-display text-[clamp(3rem,9vw,6rem)] leading-none text-[#cc0000] uppercase">
                    &#x20A1;447.000
                  </div>
                  <p className="font-mono text-xs text-zinc-400 mt-2 mb-8">
                    Pago &uacute;nico &bull; Dominio incluido &bull; Usted es due&ntilde;o
                  </p>

                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-zinc-800" />
                    <span className="font-mono text-xs tracking-wider uppercase text-zinc-400">Cronograma</span>
                    <div className="flex-1 h-px bg-zinc-800" />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'].map((w, i) => (
                      <div key={w} className="p-3 border border-zinc-800/50">
                        <span className="font-mono text-[11px] tracking-wider uppercase text-zinc-400 block">{w}</span>
                        <span className="text-xs text-zinc-400 mt-1 block">
                          {['Dise\u00f1o', 'Desarrollo', 'Contenido', 'Lanzamiento'][i]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <a
                    href={`https://wa.me/50671077969?text=${encodeURIComponent("Hola! Me interesa la propuesta del sitio web para Uvita Body Shop. Quisiera hablar sobre el paquete de \u20A1447.000.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-8 py-4 text-center text-sm font-semibold tracking-wide uppercase bg-[#cc0000] text-white hover:bg-[#e60000] transition-colors duration-300"
                  >
                    Empecemos &rarr;
                  </a>
                </div>
              </div>
            </div>

            {/* Estrategia SEO */}
            <div className="mb-20">
              <h3 className="font-display text-2xl sm:text-3xl uppercase mb-4">
                Estrategia <span className="text-[#cc0000]">SEO</span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed max-w-2xl mb-8">
                Esto no es solo un sitio bonito. Est&aacute; construido para posicionar.
                Esto es lo que atacamos desde el d&iacute;a uno:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { keyword: '"taller de pintura uvita"', status: 'Sin competencia' },
                  { keyword: '"enderezado y pintura costa rica"', status: 'Baja competencia' },
                  { keyword: '"reparaci\u00f3n de colisi\u00f3n puntarenas"', status: 'Sin competencia' },
                  { keyword: '"pintura automotriz uvita"', status: 'Sin competencia' },
                  { keyword: '"body shop near me" (Zona Sur)', status: 'Sin competencia' },
                  { keyword: '"taller de enderezado zona sur"', status: 'Sin competencia' },
                ].map((item) => (
                  <div key={item.keyword} className="flex items-center justify-between p-4 border border-zinc-800/50 bg-zinc-950/50">
                    <span className="font-mono text-xs text-zinc-400">{item.keyword}</span>
                    <span className="font-mono text-xs tracking-wider uppercase text-[#cc0000]">{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Final */}
            <div className="text-center py-16">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-zinc-400 mb-6">
                &iquest;Listo para empezar?
              </p>
              <h3 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] uppercase mb-6">
                Elija un Dise&ntilde;o.
                <br />
                <span className="text-[#cc0000]">Nosotros Hacemos el Resto.</span>
              </h3>
              <a
                href={`https://wa.me/50671077969?text=${encodeURIComponent("Hola! Quiero iniciar el proyecto del sitio web para Uvita Body Shop.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-wide uppercase bg-[#cc0000] text-white hover:bg-[#e60000] transition-colors duration-300"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp para Empezar
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 sm:px-12 lg:px-24 py-8 border-t border-zinc-800/30">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-mono text-xs text-zinc-500">
            &copy; 2026 Uvita Body Shop
          </span>
          <span className="font-mono text-xs text-zinc-500">
            Dise&ntilde;ado por Marcelo
          </span>
        </div>
      </footer>

      <style>{`
        @keyframes explorationFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes explorationCardIn {
          from { opacity: 0; transform: translateY(30px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
