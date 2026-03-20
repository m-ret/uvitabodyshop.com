'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import {
  services,
  processSteps,
  materialBrands,
  marqueeItems,
  contactInfo,
} from '@/data/content'

const CarPaintScene = dynamic(() => import('@/components/3d/CarPaintScene'), {
  ssr: false,
  loading: () => null,
})

/* ------------------------------------------------------------------ */
/*  CountUp                                                            */
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
            el.textContent = Math.round(eased * target).toLocaleString() + suffix
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
/*  Design5Page — Neo-Brutalist Tech UI                                */
/* ------------------------------------------------------------------ */

export default function Design5Page() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      /* Hero entrance */
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from('.d5-hero-label', { opacity: 0, y: 15, duration: 0.5, delay: 0.3 })
        .from('.d5-hero-title', { opacity: 0, y: 80, duration: 1 }, '-=0.2')
        .from('.d5-hero-desc', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
        .from('.d5-hero-cta', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.3')

      /* Stats */
      gsap.to('.d5-stat', {
        scrollTrigger: { trigger: '.d5-stats', start: 'top 80%' },
        y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      })

      /* Services */
      gsap.to('.d5-svc', {
        scrollTrigger: { trigger: '.d5-svc-grid', start: 'top 85%' },
        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      })

      /* Process */
      gsap.to('.d5-step', {
        scrollTrigger: { trigger: '.d5-process', start: 'top 75%' },
        y: 0, opacity: 1, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      })

      /* General reveals */
      gsap.utils.toArray<HTMLElement>('.d5-reveal').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        })
      })

      /* CTA */
      gsap.to('.d5-cta-block', {
        scrollTrigger: { trigger: '.d5-cta', start: 'top 85%' },
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="design5">

      {/* ===== NAV BAR ===== */}
      <header className="fixed top-0 left-0 right-0 z-50 px-5 sm:px-8 py-4 flex items-center justify-between" style={{ background: 'var(--d5-bg)', borderBottom: '1px solid var(--d5-border)' }}>
        <span className="font-display text-sm font-bold">UBS</span>
        <nav className="hidden md:flex items-center gap-8">
          {['Services', 'Process', 'Contact'].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} className="text-xs font-semibold tracking-wider uppercase transition-colors duration-200" style={{ color: 'var(--d5-fg-muted)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--d5-fg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--d5-fg-muted)' }}
            >{l}</a>
          ))}
        </nav>
        <a href="#contact" className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200" style={{ background: 'var(--d5-accent)', color: '#fff' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--d5-fg)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--d5-accent)' }}
        >
          Get Quote
        </a>
      </header>

      {/* ===== HERO — Grid + 3D immersive ===== */}
      <section className="relative min-h-screen d5-grid-bg overflow-hidden pt-[72px]" style={{ background: 'var(--d5-bg)' }}>
        {/* Accent dots */}
        <div className="d5-dot absolute top-24 left-5 sm:left-8" />
        <div className="d5-dot absolute top-24 right-5 sm:right-8" />
        <div className="d5-dot absolute bottom-8 right-5 sm:right-8" />

        {/* Oversized single word — RESTORATION — scales to fill full width */}
        <div className="pt-12 sm:pt-16 overflow-hidden">
          <h1 className="d5-hero-title font-display font-bold w-full text-center" style={{ fontSize: '15vw', color: 'var(--d5-fg)', lineHeight: '0.82', letterSpacing: '-0.06em' }}>
            RESTORATION
          </h1>
        </div>

        {/* Label row */}
        <div className="px-5 sm:px-8 mt-4 flex items-center gap-3" style={{ borderTop: '1px solid var(--d5-border)' }}>
          <div className="d5-dot mt-4" />
          <span className="d5-hero-label font-display text-xs font-bold mt-4 tracking-wider">BODY SHOP</span>
          <span className="d5-hero-label text-xs mt-4 tracking-wider" style={{ color: 'var(--d5-fg-muted)' }}>UVITA, COSTA RICA</span>
        </div>

        {/* Main content grid — description left, 3D car center, text right */}
        <div className="grid grid-cols-1 lg:grid-cols-4" style={{ borderTop: '1px solid var(--d5-border)', marginTop: '1.5rem' }}>
          {/* Left cell — description + CTA */}
          <div className="p-5 sm:p-8 flex flex-col justify-between lg:border-r" style={{ borderColor: 'var(--d5-border)' }}>
            <div>
              <p className="d5-hero-desc text-2xl sm:text-3xl lg:text-4xl leading-[1.1] font-bold" style={{ color: 'var(--d5-fg)' }}>
                Expert collision repair &amp; paint restoration — transforming
                damaged vehicles into factory-new&nbsp;condition.
              </p>
            </div>
            <div className="mt-8">
              <a
                href="#contact"
                className="d5-hero-cta inline-flex items-center px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200"
                style={{ background: 'var(--d5-accent)', color: '#fff' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--d5-fg)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--d5-accent)' }}
              >
                Get Your Estimate
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="ml-3"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>

          {/* Center cells — 3D Car (spans 2 cols) */}
          <div className="lg:col-span-2 relative min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] lg:border-r" style={{ borderColor: 'var(--d5-border)' }}>
            <div className="absolute inset-0">
              <CarPaintScene
                paintColor="#1a1a1a"
                rimColor="#ff5c00"
                rimColor2="#cc4a00"
                mistColor="#ff5c0011"
              />
            </div>
          </div>

          {/* Right cell — text metadata + stats */}
          <div className="p-5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--d5-accent)' }}>
              WHY US
            </p>
            <p className="text-base sm:text-lg leading-relaxed mb-6" style={{ color: 'var(--d5-fg-muted)' }}>
              9 years of precision craftsmanship. Controlled spray booth with infrared
              curing oven. Professional-grade materials. Written guarantee on every job.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="font-display text-4xl font-bold" style={{ color: 'var(--d5-fg)' }}>500+</div>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--d5-fg-light)' }}>VEHICLES</p>
              </div>
              <div>
                <div className="font-display text-4xl font-bold" style={{ color: 'var(--d5-fg)' }}>100%</div>
                <p className="text-[10px] font-bold uppercase tracking-wider mt-1" style={{ color: 'var(--d5-fg-light)' }}>GUARANTEED</p>
              </div>
            </div>
            <div className="pt-4" style={{ borderTop: '1px solid var(--d5-border)' }}>
              <p className="font-display text-[10px] font-bold tracking-wider" style={{ color: 'var(--d5-fg-muted)' }}>EST. 2017 — PUNTARENAS, CR</p>
            </div>
          </div>
        </div>

        {/* Partners / brands strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center" style={{ borderTop: '1px solid var(--d5-border)' }}>
          <div className="px-5 sm:px-8 py-3 sm:py-4 text-[10px] font-bold uppercase tracking-wider shrink-0 sm:border-r" style={{ color: 'var(--d5-fg-muted)', borderColor: 'var(--d5-border)', borderBottom: '1px solid var(--d5-border)' }}>
            Materials:
          </div>
          <div className="flex-1 flex flex-wrap items-center justify-around gap-2 py-3 sm:py-4 px-4">
            {materialBrands.map((b) => (
              <span key={b.name} className="font-display text-base sm:text-xl lg:text-2xl font-bold tracking-wider" style={{ color: 'var(--d5-fg-light)' }}>
                {b.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS — Horizontal strip ===== */}
      <section className="d5-stats" style={{ background: 'var(--d5-bg-dark)', borderTop: '1px solid var(--d5-border)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3">
          {[
            { value: 9, suffix: '+', label: 'Years' },
            { value: 500, suffix: '+', label: 'Vehicles' },
            { value: 100, suffix: '%', label: 'Guaranteed' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`d5-stat gsap-reveal py-12 sm:py-16 px-8 text-center ${i < 2 ? 'sm:border-r' : ''}`}
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="font-display text-6xl sm:text-7xl font-bold" style={{ color: 'var(--d5-accent)' }}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] mt-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES — Modular grid cells ===== */}
      <section id="services" className="py-20 sm:py-28 px-5 sm:px-8 d5-grid-bg" style={{ borderTop: '1px solid var(--d5-border)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="d5-reveal gsap-reveal flex items-center gap-3 mb-12">
            <div className="d5-dot" />
            <span className="font-display text-xs font-bold tracking-wider">SERVICES</span>
            <div className="flex-1 h-px" style={{ background: 'var(--d5-border)' }} />
          </div>

          <div className="d5-reveal gsap-reveal mb-16">
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: 'var(--d5-fg)' }}>
              EVERY SERVICE.<br />ONE STANDARD.
            </h2>
          </div>

          <div className="d5-svc-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: 'var(--d5-border)' }}>
            {services.map((s) => (
              <div
                key={s.number}
                className="d5-svc gsap-reveal group relative overflow-hidden transition-all duration-300"
                style={{ background: 'var(--d5-bg)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--d5-card)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--d5-bg)' }}
              >
                {/* Image */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="d5-svc-img object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* hard cut — no gradient fade */}
                  <span className="absolute top-4 left-4 font-display text-[10px] font-bold tracking-wider px-2 py-1" style={{ background: 'var(--d5-accent)', color: '#fff' }}>
                    {s.number}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--d5-fg-light)' }}>
                    {s.subtitle}
                  </p>
                  <h3 className="font-display text-base sm:text-lg font-bold mb-3 group-hover:text-[var(--d5-accent)] transition-colors duration-300" style={{ color: 'var(--d5-fg)' }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--d5-fg-muted)' }}>
                    {s.description}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA tile — fills the 6th cell */}
            <div
              className="d5-svc gsap-reveal group relative flex flex-col justify-between p-8 sm:p-10 transition-all duration-300"
              style={{ background: 'var(--d5-accent)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--d5-fg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--d5-accent)' }}
            >
              <div>
                <div className="w-10 h-10 flex items-center justify-center mb-6" style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                  <svg width="20" height="20" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="font-display text-2xl sm:text-3xl font-bold leading-tight text-white">
                  NEED SOMETHING ELSE?
                </p>
              </div>
              <div className="mt-8">
                <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  We handle every make and model. Tell us what you need — we&apos;ll make it happen.
                </p>
                <a
                  href="#contact"
                  className="inline-flex items-center font-display text-xs font-bold tracking-wider text-white"
                >
                  GET A QUOTE →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS — Numbered modular blocks ===== */}
      <section id="process" className="d5-process py-20 sm:py-28 px-5 sm:px-8" style={{ background: 'var(--d5-bg-dark)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Section header */}
          <div className="d5-reveal gsap-reveal flex items-center gap-3 mb-12">
            <div className="d5-dot" />
            <span className="font-display text-xs font-bold tracking-wider" style={{ color: '#fff' }}>PROCESS</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div className="d5-reveal gsap-reveal mb-16">
            <h2 className="font-display font-bold" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#fff' }}>
              FROM DAMAGE<br />TO PERFECTION.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
            {processSteps.map((step, i) => (
              <div
                key={step.number}
                className="d5-step gsap-reveal group relative p-6 sm:p-8 lg:p-10 overflow-hidden transition-all duration-300"
                style={{ background: 'var(--d5-bg-dark)', minHeight: '240px' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#222222' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--d5-bg-dark)' }}
              >
                {/* Ghost number */}
                <div className="absolute -bottom-4 -right-2 font-display font-bold leading-none select-none pointer-events-none" style={{ fontSize: 'clamp(8rem, 14vw, 12rem)', color: 'rgba(255,255,255,0.03)' }}>
                  {step.number}
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="d5-dot" />
                      <span className="font-display text-4xl sm:text-5xl font-bold" style={{ color: 'var(--d5-accent)' }}>
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-display text-xl sm:text-2xl font-bold mb-3 group-hover:text-[var(--d5-accent)] transition-colors duration-300" style={{ color: '#fff' }}>
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOTH — Grid split: image left, text right ===== */}
      <section className="d5-grid-bg" style={{ borderTop: '1px solid var(--d5-border)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — image cell */}
          <div className="relative min-h-[280px] sm:min-h-[350px] lg:min-h-[450px] overflow-hidden lg:border-r" style={{ borderColor: 'var(--d5-border)' }}>
            <Image
              src="https://img.freepik.com/free-photo/front-view-worker-spraying-powder-paint-from-gum_52683-97009.jpg?w=1920"
              alt="Worker spraying paint in professional booth"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'rgba(26,26,26,0.35)' }} />
            {/* Orange number overlay */}
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <div className="d5-dot" />
              <span className="font-display text-[10px] font-bold tracking-wider text-white">SPRAY BOOTH</span>
            </div>
          </div>

          {/* Right — text cell, dark bg */}
          <div className="d5-reveal gsap-reveal p-6 sm:p-10 lg:p-16 flex flex-col justify-center" style={{ background: 'var(--d5-bg-dark)' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="d5-dot" />
              <span className="font-display text-xs font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>EQUIPMENT</span>
            </div>
            <h2 className="font-display font-bold mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#fff', lineHeight: '0.9' }}>
              OVEN-CURED.<br />BOOTH-SPRAYED.<br />
              <span style={{ color: 'var(--d5-accent)' }}>GUARANTEED.</span>
            </h2>
            <p className="text-sm leading-relaxed max-w-md mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Sealed spray booth with infrared curing oven. Positive air pressure,
              multi-stage filtration, D65 daylight-calibrated lamps. Factory-grade
              environment — zero dust, perfect adhesion, every time.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Infrared Oven', 'Zero Dust', 'Color Match'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE — Split grid ===== */}
      <section className="d5-grid-bg" style={{ borderTop: '1px solid var(--d5-border)' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left — statement */}
          <div className="p-6 sm:p-10 lg:p-16 flex flex-col justify-center lg:border-r" style={{ borderColor: 'var(--d5-border)', borderBottom: '1px solid var(--d5-border)' }}>
            <div className="d5-reveal gsap-reveal flex items-center gap-3 mb-8">
              <div className="d5-dot" />
              <span className="font-display text-xs font-bold tracking-wider">OUR PROMISE</span>
            </div>
            <h2 className="d5-reveal gsap-reveal font-display font-bold mb-6" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: 'var(--d5-fg)' }}>
              IF IT&apos;S NOT PERFECT,<br />
              <span style={{ color: 'var(--d5-accent)' }}>IT&apos;S NOT DONE.</span>
            </h2>
            <p className="d5-reveal gsap-reveal text-base leading-relaxed max-w-lg" style={{ color: 'var(--d5-fg-muted)' }}>
              Every repair comes with our written guarantee. Professional-grade
              materials, precision tools, and 9 years of experience.
              Not satisfied? We make it right. Free.
            </p>
          </div>

          {/* Right — guarantee items */}
          <div className="p-6 sm:p-10 lg:p-16" style={{ background: 'var(--d5-bg-dark)', borderBottom: '1px solid var(--d5-border)' }}>
            <div className="space-y-6">
              {[
                'Color match accuracy — factory-grade or we redo it',
                'Paint adhesion and finish durability',
                'Structural integrity of all repaired areas',
                'No peeling, bubbling, or fading',
                'Free correction if any defect appears',
              ].map((item) => (
                <div key={item} className="d5-reveal gsap-reveal flex items-start gap-4">
                  <div className="d5-dot mt-1.5 shrink-0" />
                  <span className="text-sm font-semibold leading-snug" style={{ color: 'rgba(255,255,255,0.7)' }}>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="font-display text-[10px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>WRITTEN WARRANTY</span>
              <p className="font-display text-2xl font-bold mt-1" style={{ color: '#fff' }}>UVITA BODY SHOP</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA / CONTACT ===== */}
      <section id="contact" className="d5-cta py-20 sm:py-28 px-5 sm:px-8 d5-grid-bg" style={{ borderTop: '1px solid var(--d5-border)' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-px" style={{ background: 'var(--d5-border)' }}>
          {/* Left — info */}
          <div className="d5-cta-block gsap-reveal p-8 sm:p-12" style={{ background: 'var(--d5-bg)' }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="d5-dot" />
              <span className="font-display text-xs font-bold tracking-wider">CONTACT</span>
            </div>
            <h2 className="font-display font-bold mb-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: 'var(--d5-fg)' }}>
              READY TO RESTORE<br />
              <span style={{ color: 'var(--d5-accent)' }}>YOUR VEHICLE?</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--d5-fg-muted)' }}>
              Get a free estimate. Call, WhatsApp, or fill out the form. We respond within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-colors" style={{ background: '#25D366', color: '#fff' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp
              </a>
              <a href={`tel:${contactInfo.phone}`} className="inline-flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-wider transition-all" style={{ background: 'var(--d5-bg)', color: 'var(--d5-fg)', border: '1.5px solid var(--d5-border)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--d5-accent)'; e.currentTarget.style.color = 'var(--d5-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--d5-border)'; e.currentTarget.style.color = 'var(--d5-fg)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                {contactInfo.phoneDisplay}
              </a>
            </div>

            <div className="text-xs font-semibold space-y-1" style={{ color: 'var(--d5-fg-light)' }}>
              <p>{contactInfo.location}</p>
              <p>{contactInfo.hours}</p>
            </div>
          </div>

          {/* Right — form */}
          <div className="d5-cta-block gsap-reveal p-8 sm:p-12" style={{ background: 'var(--d5-card)' }}>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {[
                { id: 'd5-name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { id: 'd5-phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '+506 8769 9927' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--d5-fg)' }}>{f.label}</label>
                  <input type={f.type} id={f.id} required className="w-full px-4 py-3 text-sm focus:outline-none transition-all" style={{ background: 'var(--d5-bg)', border: '1.5px solid var(--d5-border)', color: 'var(--d5-fg)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--d5-accent)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--d5-border)' }}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="d5-service" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--d5-fg)' }}>Service</label>
                <select id="d5-service" className="w-full px-4 py-3 text-sm focus:outline-none transition-all" style={{ background: 'var(--d5-bg)', border: '1.5px solid var(--d5-border)', color: 'var(--d5-fg)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--d5-accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--d5-border)' }}
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
                <label htmlFor="d5-msg" className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--d5-fg)' }}>Message</label>
                <textarea id="d5-msg" rows={3} className="w-full px-4 py-3 text-sm focus:outline-none transition-all resize-none" style={{ background: 'var(--d5-bg)', border: '1.5px solid var(--d5-border)', color: 'var(--d5-fg)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--d5-accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--d5-border)' }}
                  placeholder="Describe the work you need..."
                />
              </div>
              <button type="submit" className="w-full py-4 text-sm font-bold uppercase tracking-wider transition-all duration-200" style={{ background: 'var(--d5-accent)', color: '#fff' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--d5-fg)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--d5-accent)' }}
              >
                Send Request →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-5 sm:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--d5-border)' }}>
        <span className="font-display text-sm font-bold">UVITA BODY SHOP</span>
        <span className="text-xs" style={{ color: 'var(--d5-fg-light)' }}>&copy; 2026 ALL RIGHTS RESERVED</span>
      </footer>

    </div>
  )
}
