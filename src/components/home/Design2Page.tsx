'use client'

import { useRef, useEffect, useMemo } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import Navigation from '@/components/ui/Navigation'
import {
  services,
  processSteps,
  materialBrands,
  contactInfo,
} from '@/data/content'

const CarPaintScene = dynamic(() => import('@/components/3d/CarPaintScene'), {
  ssr: false,
  loading: () => null,
})

/* ------------------------------------------------------------------ */
/*  Spectrum colors for service accent mapping                         */
/* ------------------------------------------------------------------ */

const spectrumColors = ['#0d7377', '#0a6847', '#c4922a', '#c45420', '#a82020']

/* ------------------------------------------------------------------ */
/*  Hero mosaic — generates a grid of color blocks from the spectrum   */
/* ------------------------------------------------------------------ */

const MOSAIC_COLS = 20
const MOSAIC_ROWS = 8

const spectrumBase = [
  '#0a1628',
  '#0d7377',
  '#0a6847',
  '#c4922a',
  '#d4731a',
  '#c45420',
  '#a82020',
]

function generateMosaicColors(): string[] {
  const colors: string[] = []
  for (let row = 0; row < MOSAIC_ROWS; row++) {
    for (let col = 0; col < MOSAIC_COLS; col++) {
      const t = col / (MOSAIC_COLS - 1)
      const idx = t * (spectrumBase.length - 1)
      const baseIdx = Math.floor(idx)
      const base = spectrumBase[Math.min(baseIdx, spectrumBase.length - 1)]

      // Random brightness variation
      const brightnessShift = Math.random() * 30 - 15
      const r = parseInt(base.slice(1, 3), 16)
      const g = parseInt(base.slice(3, 5), 16)
      const b = parseInt(base.slice(5, 7), 16)
      const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v + brightnessShift)))
      colors.push(`rgb(${clamp(r)}, ${clamp(g)}, ${clamp(b)})`)
    }
  }
  return colors
}

/* ------------------------------------------------------------------ */
/*  CountUp (shared utility)                                           */
/* ------------------------------------------------------------------ */

function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const animated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true
          const start = performance.now()
          const duration = 2000

          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - t, 3)
            el.textContent =
              Math.round(eased * target).toLocaleString() + suffix
            if (t < 1) requestAnimationFrame(tick)
          }

          requestAnimationFrame(tick)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, suffix])

  return <span ref={ref}>0{suffix}</span>
}

/* ------------------------------------------------------------------ */
/*  Design2Page                                                        */
/* ------------------------------------------------------------------ */

export default function Design2Page() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mosaicColors = useMemo(() => generateMosaicColors(), [])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      /* --- Hero entrance — mosaic columns stagger in --- */
      gsap.from('.mosaic-col', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.04,
        ease: 'power3.out',
        delay: 0.2,
      })

      /* --- Hero text entrance --- */
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.5 })
      heroTl
        .from('.d2-hero-label', { opacity: 0, y: 20, duration: 0.6 })
        .from('.d2-hero-title', { opacity: 0, y: 60, duration: 0.9 }, '-=0.3')
        .from('.d2-hero-sub', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.d2-hero-cta', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.3')

      /* --- Craft section --- */
      gsap.from('.d2-craft-text', {
        scrollTrigger: { trigger: '.d2-craft-section', start: 'top 75%' },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      })

      gsap.fromTo(
        '.d2-craft-image',
        { xPercent: 8, opacity: 0.3 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.d2-craft-section',
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        }
      )

      /* --- Services — alternating horizontal slide reveals --- */
      gsap.utils.toArray<HTMLElement>('.d2-svc-block').forEach((block, i) => {
        const isEven = i % 2 === 0
        gsap.from(block, {
          scrollTrigger: { trigger: block, start: 'top 85%' },
          x: isEven ? -60 : 60,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
        })
      })

      /* --- Process timeline — line draws + steps reveal --- */
      gsap.from('.d2-timeline-line', {
        scrollTrigger: { trigger: '.d2-process-section', start: 'top 75%' },
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'power3.out',
      })

      gsap.from('.d2-proc-step', {
        scrollTrigger: { trigger: '.d2-process-section', start: 'top 70%' },
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.2,
        ease: 'power3.out',
      })

      /* --- Materials strip --- */
      gsap.from('.d2-brand', {
        scrollTrigger: { trigger: '.d2-materials-section', start: 'top 80%' },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      })

      /* --- Trust grid --- */
      gsap.from('.d2-trust-item', {
        scrollTrigger: { trigger: '.d2-trust-grid', start: 'top 85%' },
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      })

      /* --- CTA section --- */
      gsap.from('.d2-cta-reveal', {
        scrollTrigger: { trigger: '.d2-cta-section', start: 'top 80%' },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="design2" style={{ background: 'var(--d2-bg)', color: 'var(--d2-fg)' }}>
      <Navigation />

      {/* ===== HERO — Mosaic + 3D car + clear messaging ===== */}
      <section className="relative min-h-screen overflow-hidden" style={{ background: 'var(--d2-bg)' }}>
        {/* Layer 1: Mosaic grid — the color spectrum identity */}
        <div
          className="absolute inset-0"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${MOSAIC_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${MOSAIC_ROWS}, 1fr)`,
          }}
          aria-hidden="true"
        >
          {mosaicColors.map((color, i) => {
            const col = i % MOSAIC_COLS
            return (
              <div
                key={i}
                className="mosaic-col"
                style={{
                  backgroundColor: color,
                  opacity: 0.5,
                  animationDelay: `${col * 0.04}s`,
                }}
              />
            )
          })}
        </div>

        {/* Layer 2: 3D Car — visual proof this is automotive */}
        <div className="absolute inset-0" aria-hidden="true">
          <CarPaintScene
            paintColor="#c4922a"
            rimColor="#c4922a"
            rimColor2="#d4731a"
            mistColor="#c4922a"
          />
        </div>

        {/* Dark overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--d2-bg)] via-[var(--d2-bg)]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--d2-bg)]/90 via-[var(--d2-bg)]/30 to-[var(--d2-bg)]/50" />

        {/* Hero content */}
        <div className="relative z-10 min-h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-3xl">
            <p className="d2-hero-label font-mono text-xs tracking-[0.25em] uppercase mb-8" style={{ color: 'var(--d2-accent)' }}>
              Auto Body &amp; Paint &mdash; Uvita, Costa Rica
            </p>

            <h1 className="d2-hero-title font-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] tracking-tight">
              Your paint,
              <br />
              perfected.
            </h1>

            <p className="d2-hero-sub text-lg sm:text-xl mt-8 max-w-lg leading-relaxed" style={{ color: 'rgba(240,236,232,0.6)' }}>
              Collision repair, full-body paint, and custom color matching.
              Spray booth. Infrared oven. 9&nbsp;years of precision craft.
            </p>

            {/* Service tags — immediate clarity */}
            <div className="d2-hero-sub flex flex-wrap gap-2 mt-6">
              {['Collision Repair', 'Full Paint', 'Color Match', 'Dent Repair', 'Custom'].map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-[0.12em] uppercase px-3 py-1.5"
                  style={{ border: '1px solid rgba(196,146,42,0.3)', color: 'rgba(240,236,232,0.45)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="#contact"
                className="d2-hero-cta inline-flex px-8 py-4 text-sm font-medium tracking-wide uppercase transition-colors duration-300"
                style={{ background: 'var(--d2-accent)', color: '#0c0c0e' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--d2-accent-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--d2-accent)')}
              >
                Free Estimate
              </a>
              <a
                href="#services"
                className="d2-hero-cta inline-flex px-8 py-4 border text-sm font-medium tracking-wide uppercase hover:text-white transition-all duration-300"
                style={{ borderColor: 'rgba(240,236,232,0.2)', color: 'rgba(240,236,232,0.6)' }}
              >
                View Services
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(240,236,232,0.3)' }}>
            Scroll
          </span>
          <div className="w-px h-10 animate-pulse" style={{ background: 'linear-gradient(to bottom, var(--d2-accent), transparent)' }} />
        </div>
      </section>

      {/* ===== CRAFT / ABOUT — Editorial two-column ===== */}
      <section className="d2-craft-section relative py-32 sm:py-44 px-6 sm:px-12 lg:px-24 overflow-hidden" style={{ background: 'var(--d2-bg)' }}>
        {/* Spectrum divider bar */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(to right, var(--d2-navy), var(--d2-teal), var(--d2-emerald), var(--d2-gold), var(--d2-amber), var(--d2-orange), var(--d2-crimson))`,
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="d2-craft-image relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?auto=format&fit=crop&w=2400&q=100"
              alt="Technician spray painting a vehicle panel with professional equipment"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--d2-bg), transparent)' }} />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--d2-accent)' }} />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(240,236,232,0.5)' }}>
                  Fabricio R&iacute;os Ort&iacute;z &mdash; Founder
                </span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="d2-craft-text font-mono text-xs tracking-[0.25em] uppercase mb-6" style={{ color: 'var(--d2-accent)' }}>
              The Craft
            </p>
            <h2 className="d2-craft-text font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9]">
              We don&apos;t fix cars.
            </h2>
            <h2 className="d2-craft-text font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] mt-2" style={{ color: 'var(--d2-accent)' }}>
              We restore them.
            </h2>
            <p className="d2-craft-text mt-8 max-w-lg leading-relaxed text-lg" style={{ color: 'rgba(240,236,232,0.5)' }}>
              9 years of hands-on experience. A controlled spray booth with
              infrared curing oven. Professional-grade materials from Roberlo,
              BESA, 3M, and VICCO. Every repair is backed by our guarantee
              &mdash; because we don&apos;t cut corners.
            </p>
          </div>
        </div>
      </section>

      {/* ===== SERVICES — Alternating blocks ===== */}
      <section id="services" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24" style={{ background: 'var(--d2-bg)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--d2-accent)' }}>
              What We Do
            </p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9]">
              Every service.
              <br />
              One standard:{' '}
              <span style={{ color: 'var(--d2-accent)' }}>perfect.</span>
            </h2>
          </div>

          <div className="space-y-16 sm:space-y-24">
            {services.map((s, i) => {
              const isEven = i % 2 === 0
              const accentColor = spectrumColors[i % spectrumColors.length]

              return (
                <div
                  key={s.number}
                  className={`d2-svc-block grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
                    !isEven ? 'lg:[direction:rtl]' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[16/10] lg:[direction:ltr]">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, var(--d2-bg), transparent 60%)` }} />
                    {/* Accent color bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: accentColor }} />
                  </div>

                  {/* Content */}
                  <div className="lg:[direction:ltr]">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="font-mono text-sm tracking-wider" style={{ color: accentColor }}>
                        {s.number}
                      </span>
                      <div className="flex-1 h-px" style={{ background: `${accentColor}30` }} />
                    </div>
                    <h3 className="font-display text-3xl sm:text-4xl mb-3 transition-colors duration-300" style={{ color: 'var(--d2-fg)' }}>
                      {s.title}
                    </h3>
                    <p className="font-mono text-[10px] tracking-[0.25em] uppercase mb-4" style={{ color: 'rgba(240,236,232,0.4)' }}>
                      {s.subtitle}
                    </p>
                    <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(240,236,232,0.5)' }}>
                      {s.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== 3D CAR SHOWCASE — Gold metallic ===== */}
      <section className="relative h-[60vh] sm:h-[80vh] min-h-[400px] sm:min-h-[600px] overflow-hidden" style={{ background: 'var(--d2-bg)' }}>
        <div className="absolute inset-0" aria-hidden="true">
          <CarPaintScene
            paintColor="#c4922a"
            rimColor="#c4922a"
            rimColor2="#d4731a"
            mistColor="#c4922a"
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--d2-bg), transparent 50%, var(--d2-bg))' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--d2-bg), transparent 40%, transparent 60%, var(--d2-bg))' }} />

        {/* Centered label */}
        <div className="relative z-10 h-full flex flex-col items-center justify-end pb-12 sm:pb-16">
          <p className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--d2-accent)' }}>
            Precision Metallic Finish
          </p>
        </div>
      </section>

      {/* ===== PROCESS — Vertical timeline ===== */}
      <section className="d2-process-section py-24 sm:py-32 px-6 sm:px-12 lg:px-24" style={{ background: 'var(--d2-bg)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-20 text-center">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--d2-accent)' }}>
              How We Work
            </p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9]">
              From damage to{' '}
              <span style={{ color: 'var(--d2-accent)' }}>perfection.</span>
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div
              className="d2-timeline-line absolute left-6 sm:left-8 top-0 bottom-0 w-px"
              style={{
                background: `linear-gradient(to bottom, var(--d2-teal), var(--d2-emerald), var(--d2-gold), var(--d2-crimson))`,
              }}
            />

            <div className="space-y-12 sm:space-y-16">
              {processSteps.map((step, i) => {
                const dotColor = spectrumColors[i % spectrumColors.length]
                return (
                  <div key={step.number} className="d2-proc-step relative pl-16 sm:pl-20">
                    {/* Dot */}
                    <div
                      className="absolute left-4 sm:left-6 top-1 w-4 h-4 rounded-full border-2"
                      style={{ borderColor: dotColor, background: 'var(--d2-bg)' }}
                    >
                      <div
                        className="absolute inset-1 rounded-full"
                        style={{ background: dotColor }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6">
                      <div className="shrink-0">
                        <span className="font-display text-4xl sm:text-5xl" style={{ color: dotColor }}>
                          {step.number}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-display text-2xl sm:text-3xl mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm leading-relaxed max-w-md" style={{ color: 'rgba(240,236,232,0.5)' }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MATERIALS + TRUST ===== */}
      <section className="d2-materials-section py-24 sm:py-32 px-6 sm:px-12 lg:px-24" style={{ background: 'var(--d2-bg)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-20">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--d2-accent)' }}>
              Professional Grade
            </p>
            <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] mb-6">
              The materials behind the{' '}
              <span style={{ color: 'var(--d2-accent)' }}>finish.</span>
            </h2>
            <p className="max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(240,236,232,0.5)' }}>
              We only use products trusted by factory paint shops worldwide.
              No shortcuts. No generic brands.
            </p>
          </div>

          {/* Brand strip with spectrum gradient underline */}
          <div className="relative mb-20">
            <div className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-4">
              {materialBrands.map((brand, i) => (
                <span key={brand.name} className="d2-brand flex items-center gap-6">
                  <span
                    className="font-display text-[clamp(2.5rem,5vw,4.5rem)] tracking-[0.05em] transition-colors duration-500"
                    style={{ color: 'rgba(240,236,232,0.3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--d2-accent)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(240,236,232,0.3)')}
                  >
                    {brand.name}
                  </span>
                  {i < materialBrands.length - 1 && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--d2-accent)', opacity: 0.6 }} aria-hidden="true" />
                  )}
                </span>
              ))}
            </div>
            {/* Spectrum underline */}
            <div
              className="mt-6 h-px mx-auto max-w-2xl"
              style={{
                background: `linear-gradient(to right, var(--d2-navy), var(--d2-teal), var(--d2-emerald), var(--d2-gold), var(--d2-amber), var(--d2-orange), var(--d2-crimson))`,
              }}
            />
          </div>

          {/* Trust grid */}
          <div className="d2-trust-grid grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(240,236,232,0.06)' }}>
            {[
              {
                label: 'Spray Booth',
                desc: 'Controlled environment with infrared curing oven for factory-grade results.',
                accent: 'var(--d2-teal)',
              },
              {
                label: 'Warranty',
                desc: 'Every job backed by our written guarantee. Not perfect? We make it right.',
                accent: 'var(--d2-gold)',
              },
              {
                label: 'All Vehicles',
                desc: 'Every make and model — sedans, trucks, SUVs. No exceptions.',
                accent: 'var(--d2-crimson)',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="d2-trust-item group p-8 sm:p-10"
                style={{ background: 'var(--d2-bg)' }}
              >
                <div
                  className="w-8 h-px mb-6 group-hover:w-16 transition-all duration-500"
                  style={{ background: item.accent }}
                />
                <p className="font-display text-2xl mb-3">
                  {item.label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,236,232,0.4)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA / CONTACT ===== */}
      <section
        id="contact"
        className="d2-cta-section py-24 sm:py-32 px-6 sm:px-12 lg:px-24"
        style={{ background: 'var(--d2-bg)', borderTop: '1px solid rgba(240,236,232,0.08)' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          <div className="d2-cta-reveal">
            <p className="font-mono text-xs tracking-[0.25em] uppercase mb-4" style={{ color: 'var(--d2-accent)' }}>
              Get Started
            </p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] mb-6">
              Ready to restore
              <br />
              your vehicle?
            </h2>
            <p className="leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(240,236,232,0.5)' }}>
              Get a free estimate. Call, WhatsApp, or fill out the form. We
              respond within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-white text-sm font-medium tracking-wide hover:bg-[#20BD5A] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center justify-center gap-3 px-6 py-4 border text-sm font-medium tracking-wide transition-all"
                style={{ borderColor: 'rgba(240,236,232,0.15)', color: 'rgba(240,236,232,0.6)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {contactInfo.phoneDisplay}
              </a>
            </div>

            <div className="font-mono text-xs space-y-1" style={{ color: 'rgba(240,236,232,0.3)' }}>
              <p>{contactInfo.location}</p>
              <p>{contactInfo.hours}</p>
            </div>
          </div>

          <div className="d2-cta-reveal">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="d2-name"
                  className="block font-mono text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: 'rgba(240,236,232,0.4)' }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="d2-name"
                  name="name"
                  required
                  className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(240,236,232,0.04)',
                    border: '1px solid rgba(240,236,232,0.1)',
                    color: 'var(--d2-fg)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--d2-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(240,236,232,0.1)')}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="d2-phone"
                  className="block font-mono text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: 'rgba(240,236,232,0.4)' }}
                >
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  id="d2-phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(240,236,232,0.04)',
                    border: '1px solid rgba(240,236,232,0.1)',
                    color: 'var(--d2-fg)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--d2-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(240,236,232,0.1)')}
                  placeholder="+506 8769 9927"
                />
              </div>
              <div>
                <label
                  htmlFor="d2-service"
                  className="block font-mono text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: 'rgba(240,236,232,0.4)' }}
                >
                  Service Needed
                </label>
                <select
                  id="d2-service"
                  name="service"
                  className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
                  style={{
                    background: 'rgba(240,236,232,0.04)',
                    border: '1px solid rgba(240,236,232,0.1)',
                    color: 'var(--d2-fg)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--d2-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(240,236,232,0.1)')}
                >
                  <option value="">Select a service</option>
                  <option value="collision">Collision &amp; Frame Repair</option>
                  <option value="paint">Full Paint &amp; Color Match</option>
                  <option value="touchup">Paint Touch-Up</option>
                  <option value="dent">Dent &amp; Impact Repair</option>
                  <option value="accessories">Accessories &amp; Custom</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="d2-message"
                  className="block font-mono text-xs tracking-[0.15em] uppercase mb-2"
                  style={{ color: 'rgba(240,236,232,0.4)' }}
                >
                  Message
                </label>
                <textarea
                  id="d2-message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                  style={{
                    background: 'rgba(240,236,232,0.04)',
                    border: '1px solid rgba(240,236,232,0.1)',
                    color: 'var(--d2-fg)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--d2-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(240,236,232,0.1)')}
                  placeholder="Describe the work you need..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 text-sm font-medium tracking-wide uppercase transition-colors duration-300"
                style={{ background: 'var(--d2-accent)', color: '#0c0c0e' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--d2-accent-hover)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--d2-accent)')}
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 sm:px-12 lg:px-24" style={{ borderTop: '1px solid rgba(240,236,232,0.08)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-display text-xl tracking-wider">
            Uvita Body Shop
          </span>
          <span className="font-mono text-xs" style={{ color: 'rgba(240,236,232,0.3)' }}>
            &copy; 2026 Uvita Body Shop. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}
