'use client'

import { useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import Navigation from '@/components/ui/Navigation'
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
/*  Design4Page — "Clean Machine" (Gumroad-style, LIGHT theme)         */
/* ------------------------------------------------------------------ */

export default function Design4Page() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      /* --- Hero entrance — NO CTA animation, they stay visible --- */
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      heroTl
        .from('.d4-hero-badge', { opacity: 0, y: 15, duration: 0.5, delay: 0.3 })
        .from('.d4-hero-line', { opacity: 0, y: 60, duration: 0.9, stagger: 0.12 }, '-=0.3')
        .from('.d4-hero-sub', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')

      /* --- Stats slide up --- */
      gsap.to('.d4-stat', {
        scrollTrigger: { trigger: '.d4-stats', start: 'top 80%' },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })

      /* --- Craft: massive heading parallax (stolen from Design 1) --- */
      gsap.fromTo(
        '.d4-craft-heading',
        { y: 80 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: { trigger: '.d4-craft', start: 'top bottom', end: 'bottom top', scrub: 1.5 },
        }
      )

      gsap.to('.d4-craft-text', {
        scrollTrigger: { trigger: '.d4-craft', start: 'top 70%' },
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      })

      gsap.fromTo(
        '.d4-craft-image',
        { xPercent: 10, opacity: 0.3 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.d4-craft', start: 'top 80%', end: 'center center', scrub: 1 },
        }
      )

      /* --- Service sticky cards: image parallax (stolen from Design 1) --- */
      gsap.utils.toArray<HTMLElement>('.d4-svc-img').forEach((img) => {
        gsap.fromTo(
          img,
          { y: -15 },
          {
            y: 15,
            ease: 'none',
            scrollTrigger: { trigger: img.closest('.d4-svc-card'), start: 'top bottom', end: 'bottom top', scrub: true },
          }
        )
      })

      /* --- Guarantee section (stolen from Design 1) --- */
      gsap.to('.d4-guarantee-text', {
        scrollTrigger: { trigger: '.d4-guarantee', start: 'top 75%' },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      })

      /* --- Booth section reveals --- */
      gsap.fromTo(
        '.d4-booth-img',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.d4-booth', start: 'top 75%' },
        }
      )

      gsap.to('.d4-booth-text', {
        scrollTrigger: { trigger: '.d4-booth', start: 'top 70%' },
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      })

      gsap.to('.d4-booth-card', {
        scrollTrigger: { trigger: '.d4-booth-cards', start: 'top 85%' },
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
      })

      /* --- Process steps --- */
      gsap.to('.d4-step', {
        scrollTrigger: { trigger: '.d4-process', start: 'top 75%' },
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
      })

      /* --- Materials --- */
      gsap.to('.d4-brand', {
        scrollTrigger: { trigger: '.d4-materials', start: 'top 80%' },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      })

      /* --- CTA --- */
      gsap.to('.d4-cta-block', {
        scrollTrigger: { trigger: '.d4-cta', start: 'top 85%' },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="design4">
      <Navigation />

      {/* ===== HERO — Car behind text, same as designs 1-3 ===== */}
      <section className="d4-hero fixed inset-0 h-screen overflow-hidden z-0" style={{ background: '#f5f7fa' }}>
        {/* 3D Car — absolute inset-0, BEHIND text */}
        <div className="absolute inset-0" aria-hidden="true">
          <CarPaintScene
            paintColor="#1a1a1e"
            rimColor="#1e3a5f"
            rimColor2="#2a4f7a"
            mistColor="#1e3a5f22"
          />
        </div>

        {/* Gradient overlays — same approach as designs 1-3 */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(245,247,250,0.75) 0%, rgba(245,247,250,0.4) 45%, transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, #f5f7fa 0%, transparent 30%)' }} />

        {/* Text on top */}
        <div className="d4-hero-content relative z-10 h-full flex flex-col items-center justify-center text-center px-6 sm:px-12 lg:px-24">
          <p className="d4-hero-badge font-mono text-xs font-bold tracking-[0.25em] uppercase mb-8" style={{ color: 'var(--d4-accent)' }}>
            Uvita Body Shop &mdash; Puntarenas, Costa Rica
          </p>

          <h1 className="font-display text-[clamp(2.2rem,11vw,10rem)] leading-[0.85] font-black tracking-tight">
            <span className="d4-hero-line block" style={{ color: 'var(--d4-fg)' }}>We&apos;ll make it look like</span>
            <span className="d4-hero-line block" style={{ color: 'var(--d4-accent)' }}>nothing happened.</span>
          </h1>

          <p className="d4-hero-sub text-base sm:text-lg font-semibold mt-8 max-w-lg leading-relaxed" style={{ color: 'var(--d4-fg-muted)' }}>
            Expert collision repair, paint restoration, and custom finishes.
            Every vehicle leaves our booth looking factory-new&nbsp;&mdash; or better.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-10">
            <a
              href="#contact"
              className="d4-hero-cta inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-[15px] font-extrabold tracking-wide transition-all duration-200"
              style={{ background: 'var(--d4-fg)', color: 'var(--d4-bg)', border: '2px solid var(--d4-fg)', boxShadow: '4px 4px 0 var(--d4-fg)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--d4-fg)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--d4-fg)' }}
            >
              Get Your Estimate
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
            <a
              href="https://wa.me/50688888888"
              className="d4-hero-cta inline-flex items-center gap-2 px-7 py-3.5 rounded-lg text-[15px] font-extrabold tracking-wide transition-all duration-200"
              style={{ background: 'var(--d4-bg-soft)', color: 'var(--d4-fg)', border: '2px solid var(--d4-fg)', boxShadow: '4px 4px 0 var(--d4-border)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--d4-fg)'; e.currentTarget.style.color = 'var(--d4-bg)'; e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--d4-border)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--d4-bg-soft)'; e.currentTarget.style.color = 'var(--d4-fg)'; e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--d4-border)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.106-1.138l-.294-.176-2.866.852.852-2.866-.176-.294A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="d4-hero-scroll hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: 'var(--d4-fg-light)', textShadow: '0 0 15px #f5f7fa' }}>
            Scroll
          </span>
          <div className="w-px h-10 animate-pulse" style={{ background: 'linear-gradient(to bottom, var(--d4-accent), transparent)' }} />
        </div>
      </section>

      {/* Spacer — pushes content below the fixed hero */}
      <div className="d4-hero-spacer h-screen" aria-hidden="true" />

      {/* Everything below scrolls over the hero */}
      <div className="relative z-10" style={{ background: 'var(--d4-bg)' }}>

      {/* ===== MARQUEE — transition strip from dark hero to light content ===== */}
      <div className="py-5 overflow-hidden" style={{ borderTop: '2px solid var(--d4-fg)', borderBottom: '2px solid var(--d4-fg)' }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {marqueeItems.map((item) => (
                <div key={item} className="flex items-center gap-4 px-4 text-sm font-bold tracking-[0.15em] uppercase" style={{ color: 'var(--d4-fg-muted)' }}>
                  <span style={{ fontFamily: 'var(--font-mona)' }}>{item}</span>
                  <span style={{ color: 'var(--d4-accent)' }} aria-hidden="true">&#x2022;</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== STATS — Massive number cards ===== */}
      <section className="d4-stats px-6 sm:px-12 lg:px-20 py-20 sm:py-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {[
            { value: 9, suffix: '+', label: 'Years of Experience', desc: 'Nearly a decade of hands-on collision repair and paint restoration in Uvita.' },
            { value: 500, suffix: '+', label: 'Vehicles Restored', desc: 'From fender benders to full repaints — every one backed by our guarantee.' },
            { value: 4, suffix: '', label: 'Professional Brands', desc: 'Roberlo, BESA, 3M, VICCO. No generic products. No shortcuts.' },
            { value: 100, suffix: '%', label: 'Satisfaction Guaranteed', desc: 'Written warranty on every job. Not perfect? We make it right, free.' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="d4-stat gsap-reveal group relative overflow-hidden rounded-xl p-6 sm:p-10 lg:p-12 transition-all duration-500"
              style={{
                background: i === 0 ? 'var(--d4-fg)' : 'var(--d4-bg-soft)',
                border: i === 0 ? '2px solid var(--d4-fg)' : '2px solid var(--d4-fg)',
                boxShadow: i === 0 ? '6px 6px 0 var(--d4-accent)' : '4px 4px 0 var(--d4-border)',
              }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                const y = e.clientY - rect.top
                const glow = e.currentTarget.querySelector('.stat-glow') as HTMLElement
                if (glow) {
                  glow.style.opacity = '1'
                  glow.style.background = `radial-gradient(500px circle at ${x}px ${y}px, ${i === 0 ? 'rgba(30,58,95,0.15)' : 'rgba(30,58,95,0.07)'}, transparent 40%)`
                }
              }}
              onMouseLeave={(e) => {
                const glow = e.currentTarget.querySelector('.stat-glow') as HTMLElement
                if (glow) glow.style.opacity = '0'
              }}
            >
              <div className="stat-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300" />

              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="font-display font-bold leading-[0.85] tracking-tight" style={{ fontSize: 'clamp(5rem, 12vw, 9rem)', color: i === 0 ? 'var(--d4-accent)' : 'var(--d4-fg)' }}>
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] mt-4" style={{ color: i === 0 ? 'rgba(255,255,255,0.5)' : 'var(--d4-accent)' }}>
                    {stat.label}
                  </p>
                </div>

                <p className="text-sm leading-relaxed mt-6 max-w-sm" style={{ color: i === 0 ? 'rgba(255,255,255,0.45)' : 'var(--d4-fg-muted)' }}>
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CRAFT — Editorial with clip-reveal ===== */}
      <section className="d4-craft py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image — clip reveal */}
          <div className="d4-craft-image relative aspect-[4/5] rounded-xl overflow-hidden" style={{ border: '2px solid var(--d4-fg)', boxShadow: '6px 6px 0 var(--d4-border)' }}>
            <Image
              src="https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?auto=format&fit=crop&w=2400&q=100"
              alt="Technician spray painting a vehicle panel"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--d4-accent)' }} />
                <span className="text-xs font-semibold" style={{ color: 'var(--d4-fg)' }}>Fabricio Ríos — Founder</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="d4-craft-heading">
            <span className="d4-craft-text gsap-reveal inline-flex px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider mb-6" style={{ background: 'var(--d4-accent)', color: '#fff', border: '2px solid var(--d4-fg)', boxShadow: '2px 2px 0 var(--d4-fg)' }}>
              About Us
            </span>
            <h2 className="d4-craft-text gsap-reveal font-display text-[clamp(2.5rem,7vw,5rem)] font-black leading-[1.0] tracking-tight" style={{ color: 'var(--d4-fg)' }}>
              Not your average body shop.
            </h2>
            <p className="d4-craft-text gsap-reveal mt-6 text-base sm:text-lg leading-relaxed" style={{ color: 'var(--d4-fg-muted)' }}>
              9 years of hands-on precision. A controlled spray booth with
              infrared curing oven. Professional-grade materials from Roberlo,
              BESA, 3M, and VICCO. Every repair is backed by our written
              guarantee — because we don&apos;t cut corners.
            </p>
            <div className="d4-craft-text gsap-reveal flex flex-wrap gap-2 mt-8">
              {materialBrands.map((b) => (
                <span key={b.name} className="px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300" style={{ background: 'var(--d4-bg-soft)', color: 'var(--d4-fg)', border: '2px solid var(--d4-fg)', boxShadow: '2px 2px 0 var(--d4-border)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--d4-accent)'; e.currentTarget.style.color = 'var(--d4-accent)'; e.currentTarget.style.boxShadow = '3px 3px 0 var(--d4-accent)'; e.currentTarget.style.transform = 'translate(-1px, -1px)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--d4-fg)'; e.currentTarget.style.color = 'var(--d4-fg)'; e.currentTarget.style.boxShadow = '2px 2px 0 var(--d4-border)'; e.currentTarget.style.transform = 'translate(0, 0)' }}
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES — Sticky stacking cards (stolen from Design 1) ===== */}
      <section id="services" className="d4-services pt-24 sm:pt-32 px-6 sm:px-12 lg:px-20" style={{ background: 'var(--d4-bg-soft)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <span className="inline-flex px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider mb-4" style={{ background: 'var(--d4-accent)', color: '#fff', border: '2px solid var(--d4-fg)', boxShadow: '2px 2px 0 var(--d4-fg)' }}>
              Services
            </span>
            <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] font-black tracking-tight" style={{ color: 'var(--d4-fg)' }}>
              Everything your car needs.
            </h2>
          </div>

          {/* Sticky stack — each card sticks with increasing top offset */}
          <div className="space-y-6">
            {services.map((s, i) => (
              <div
                key={s.number}
                className="d4-svc-card md:sticky"
                style={{ top: `${80 + i * 20}px`, zIndex: i + 1 }}
              >
                <div
                  className="group relative overflow-hidden rounded-xl transition-all duration-500"
                  style={{ background: 'var(--d4-card)', border: '2px solid var(--d4-fg)', boxShadow: '5px 5px 0 var(--d4-border)' }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const glow = e.currentTarget.querySelector('.svc-glow') as HTMLElement
                    if (glow) {
                      glow.style.opacity = '1'
                      glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(30,58,95,0.06), transparent 40%)`
                    }
                  }}
                  onMouseLeave={(e) => {
                    const glow = e.currentTarget.querySelector('.svc-glow') as HTMLElement
                    if (glow) glow.style.opacity = '0'
                  }}
                >
                  {/* Pointer-following light */}
                  <div className="svc-glow absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-300" />

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image with parallax */}
                    <div className="relative overflow-hidden h-64 md:h-[400px]">
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="d4-svc-img object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--d4-bg-soft) 0%, transparent 40%)' }} />
                      <span className="absolute top-4 left-4 inline-flex px-3 py-1.5 rounded-lg text-xs font-black" style={{ background: 'var(--d4-fg)', color: '#fff', border: '2px solid var(--d4-fg)' }}>
                        {s.number}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                      <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--d4-accent)' }}>
                        {s.subtitle}
                      </p>
                      <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-300" style={{ color: 'var(--d4-fg)' }}>
                        {s.title}
                      </h3>
                      <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--d4-fg-muted)' }}>
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Spacer so last card has room */}
          <div className="h-[30vh]" />
        </div>
      </section>

      {/* ===== SPRAY BOOTH — Editorial dark break ===== */}
      <section className="d4-booth py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden" style={{ background: 'var(--d4-fg)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Top: Image + Text — asymmetric editorial grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center mb-16 sm:mb-20">
            {/* Image — dominant, 3 cols */}
            <div className="lg:col-span-3">
              <div className="d4-booth-img relative aspect-[16/10] rounded-xl overflow-hidden" style={{ border: '2px solid rgba(255,255,255,0.2)', boxShadow: '8px 8px 0 var(--d4-accent)' }}>
                <Image
                  src="https://img.freepik.com/free-photo/front-view-worker-spraying-powder-paint-from-gum_52683-97009.jpg?w=1920"
                  alt="Worker spraying paint in professional booth"
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                />
                {/* Subtle inner gradient for depth */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,23,42,0.3) 0%, transparent 40%)' }} />
              </div>
            </div>

            {/* Text — 2 cols */}
            <div className="lg:col-span-2">
              <span className="d4-booth-text gsap-reveal inline-flex px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider mb-6" style={{ background: 'var(--d4-accent)', color: '#fff', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '2px 2px 0 rgba(255,255,255,0.15)' }}>
                Equipment
              </span>
              <h2 className="d4-booth-text gsap-reveal font-display text-[clamp(2.5rem,7vw,5rem)] font-black tracking-tight leading-[0.9] text-white mb-6">
                The Spray
                <br />
                Booth.
              </h2>
              <p className="d4-booth-text gsap-reveal text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Not a garage with a fan. A sealed, temperature-controlled spray booth
                with infrared curing oven — the same setup factory paint shops use.
                Zero dust. Perfect adhesion. Every single time.
              </p>
              <a
                href="#contact"
                className="d4-booth-text gsap-reveal inline-flex items-center gap-2 px-6 py-3.5 rounded-lg text-sm font-black tracking-wide transition-all duration-200"
                style={{ background: '#fff', color: 'var(--d4-fg)', border: '2px solid #fff', boxShadow: '4px 4px 0 var(--d4-accent)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--d4-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--d4-accent)' }}
              >
                Get a Quote
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
          </div>

          {/* Bottom: 3 feature cards — bold Gumroad treatment */}
          <div className="d4-booth-cards grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              { num: '01', title: 'Infrared Curing', desc: 'Even heat distribution bakes the finish to factory hardness. Faster cure, stronger bond, deeper gloss.' },
              { num: '02', title: 'Zero-Dust Environment', desc: 'Sealed booth with positive air pressure and multi-stage filtration. Nothing touches your paint but paint.' },
              { num: '03', title: 'Color-Matched Lighting', desc: 'D65 daylight-calibrated lamps let us match your original color under the same light you\'ll see it in.' },
            ].map((feat) => (
              <div
                key={feat.num}
                className="d4-booth-card gsap-reveal group rounded-xl p-7 sm:p-8 transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.12)', boxShadow: '4px 4px 0 rgba(255,255,255,0.06)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--d4-accent)'; e.currentTarget.style.borderColor = 'var(--d4-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)' }}
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-5 text-sm font-black" style={{ background: 'var(--d4-accent)', color: '#fff', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '2px 2px 0 rgba(255,255,255,0.1)' }}>
                  {feat.num}
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white tracking-tight mb-3 group-hover:translate-x-1 transition-transform duration-300">
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS — Bento grid with pointer-following shine ===== */}
      <section id="process" className="d4-process py-32 sm:py-44 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 text-center">
            <span className="inline-flex px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider mb-6" style={{ background: 'var(--d4-accent)', color: '#fff', border: '2px solid var(--d4-fg)', boxShadow: '2px 2px 0 var(--d4-fg)' }}>
              How It Works
            </span>
            <h2 className="font-display text-[clamp(3rem,8vw,7rem)] font-black tracking-tight leading-[0.9]" style={{ color: 'var(--d4-fg)' }}>
              From damage
              <br />
              to <span style={{ color: 'var(--d4-accent)' }}>perfection.</span>
            </h2>
          </div>

          {/* Asymmetric bento: row 1 = 3/5 + 2/5, row 2 = 2/5 + 3/5 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {processSteps.map((step, i) => {
              const isHero = i === 0 || i === 3
              const spanClass = isHero ? 'md:col-span-3' : 'md:col-span-2'
              const isDark = i === 0 || i === 3

              return (
                <div
                  key={step.number}
                  className={`d4-step gsap-reveal group relative overflow-hidden rounded-xl transition-all duration-300 ${spanClass}`}
                  style={{
                    background: isDark ? 'var(--d4-fg)' : 'var(--d4-bg-soft)',
                    border: '2px solid var(--d4-fg)',
                    minHeight: '280px',
                    boxShadow: isDark ? '6px 6px 0 var(--d4-accent)' : '4px 4px 0 var(--d4-border)',
                  }}
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const glow = e.currentTarget.querySelector('.step-glow') as HTMLElement
                    if (glow) {
                      glow.style.opacity = '1'
                      glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(30,58,95,0.06)'}, transparent 40%)`
                    }
                  }}
                  onMouseLeave={(e) => {
                    const glow = e.currentTarget.querySelector('.step-glow') as HTMLElement
                    if (glow) glow.style.opacity = '0'
                    e.currentTarget.style.boxShadow = isDark ? '6px 6px 0 var(--d4-accent)' : '4px 4px 0 var(--d4-border)'
                    e.currentTarget.style.transform = 'translate(0, 0)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = isDark ? '8px 8px 0 var(--d4-accent)' : '6px 6px 0 var(--d4-accent)'
                    e.currentTarget.style.transform = 'translate(-2px, -2px)'
                  }}
                >
                  {/* Pointer-following shine */}
                  <div className="step-glow absolute inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-300" />

                  {/* Massive ghost number */}
                  <div
                    className="absolute -bottom-8 -right-4 font-display font-black leading-none select-none pointer-events-none"
                    style={{ fontSize: 'clamp(8rem, 22vw, 20rem)', color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)' }}
                  >
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 sm:p-10 lg:p-12 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-8">
                        <span
                          className="font-display font-black leading-none"
                          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'var(--d4-accent)' }}
                        >
                          {step.number}
                        </span>
                        <div className="flex-1 h-px transition-colors duration-500" style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'var(--d4-border)' }} />
                      </div>
                      <h3
                        className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 group-hover:translate-x-1 transition-transform duration-300"
                        style={{ color: isDark ? '#fff' : 'var(--d4-fg)' }}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p
                      className="text-base leading-relaxed max-w-md"
                      style={{ color: isDark ? 'rgba(255,255,255,0.45)' : 'var(--d4-fg-muted)' }}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== TRUST STRIP — Bold interstitial ===== */}
      <section className="d4-materials py-14 sm:py-16 px-6 sm:px-12 lg:px-20 overflow-hidden" style={{ background: 'var(--d4-accent)', borderTop: '2px solid var(--d4-fg)', borderBottom: '2px solid var(--d4-fg)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="d4-brand gsap-reveal font-display text-[clamp(1.8rem,5vw,3.5rem)] font-black tracking-tight text-white leading-[1.1] text-center mb-8">
            500+ vehicles restored. 9&nbsp;years running.
            <br className="hidden sm:block" />
            Every make &amp; model. Zero&nbsp;comebacks.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['Written Warranty', 'Spray Booth', 'Infrared Oven', 'All Makes & Models', 'Roberlo', 'BESA', '3M', 'VICCO'].map((tag) => (
              <span
                key={tag}
                className="d4-brand gsap-reveal inline-flex px-4 py-2 rounded-lg text-sm font-black transition-all duration-200"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '2px 2px 0 rgba(0,0,0,0.15)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = 'var(--d4-accent)'; e.currentTarget.style.transform = 'translate(-1px, -1px)'; e.currentTarget.style.boxShadow = '3px 3px 0 rgba(0,0,0,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0 rgba(0,0,0,0.15)' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE — Editorial split with warranty card ===== */}
      <section className="d4-guarantee relative py-32 sm:py-44 px-6 sm:px-12 lg:px-20 overflow-hidden" style={{ background: 'var(--d4-fg)' }}>
        {/* Dot grid texture */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }} />

        {/* Decorative accent line */}
        <div className="absolute top-0 left-12 sm:left-20 w-px h-full" style={{ background: 'linear-gradient(to bottom, transparent, rgba(30,58,95,0.3), transparent)' }} />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left — massive statement */}
          <div>
            <span className="d4-guarantee-text gsap-reveal inline-flex px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider mb-8" style={{ background: 'var(--d4-accent)', color: '#fff', border: '2px solid rgba(255,255,255,0.2)', boxShadow: '2px 2px 0 rgba(255,255,255,0.1)' }}>
              Our Promise
            </span>
            <h2 className="d4-guarantee-text gsap-reveal font-display font-black leading-[0.85] tracking-tight mb-8" style={{ fontSize: 'clamp(2rem, 9vw, 7rem)', color: '#ffffff' }}>
              If it&apos;s not{' '}
              <span style={{ color: 'var(--d4-accent)' }}>perfect,</span>
              <br />
              it&apos;s not done.
            </h2>
            <p className="d4-guarantee-text gsap-reveal text-lg leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Every repair comes with our written guarantee. Professional-grade
              materials, precision tools, and 9 years of experience.
              Not satisfied? We make it right. Free.
            </p>

            {/* Proof points */}
            <div className="d4-guarantee-text gsap-reveal flex flex-wrap gap-3 mt-10">
              {['Written Warranty', 'Factory Materials', '9+ Years'].map((point) => (
                <span
                  key={point}
                  className="inline-flex px-4 py-2 rounded-lg text-sm font-black"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '2px solid rgba(255,255,255,0.12)' }}
                >
                  {point}
                </span>
              ))}
            </div>
          </div>

          {/* Right — physical warranty card */}
          <div
            className="d4-guarantee-text gsap-reveal relative rounded-xl overflow-hidden"
            style={{
              background: '#ffffff',
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '8px 8px 0 var(--d4-accent)',
            }}
          >
            {/* Card header */}
            <div className="px-6 sm:px-10 pt-6 sm:pt-10 pb-5" style={{ borderBottom: '2px dashed rgba(15,23,42,0.1)' }}>
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <span className="font-display text-sm font-black uppercase tracking-wider" style={{ color: 'var(--d4-fg)' }}>
                  Uvita Body Shop
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-black uppercase" style={{ background: 'var(--d4-accent)', color: '#fff' }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M13.5 5L6.5 12L2.5 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Guaranteed
                </span>
              </div>
              <h3 className="font-display text-3xl sm:text-4xl font-black tracking-tight" style={{ color: 'var(--d4-fg)' }}>
                Written Guarantee
              </h3>
            </div>

            {/* Card body */}
            <div className="px-6 sm:px-10 py-5 space-y-4">
              {[
                'Color match accuracy — factory-grade or we redo it',
                'Paint adhesion and finish durability',
                'Structural integrity of all repaired areas',
                'No peeling, bubbling, or fading',
                'Free correction if any defect appears',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="mt-1.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center" style={{ background: 'var(--d4-accent)' }}>
                    <svg width="10" height="10" viewBox="0 0 16 16" fill="none"><path d="M13 5L6.5 11.5L3 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span className="text-sm font-semibold leading-snug" style={{ color: 'var(--d4-fg)' }}>{item}</span>
                </div>
              ))}
            </div>

            {/* Card footer */}
            <div className="px-6 sm:px-10 pb-6 sm:pb-10 pt-4" style={{ borderTop: '2px dashed rgba(15,23,42,0.1)' }}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--d4-fg-light)' }}>Backed by</p>
                  <p className="font-display text-lg font-black" style={{ color: 'var(--d4-fg)' }}>9 Years of Precision</p>
                </div>
                <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'var(--d4-bg-soft)', border: '2px solid var(--d4-fg)' }}>
                  <span className="font-display text-2xl font-black" style={{ color: 'var(--d4-accent)' }}>UBS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA / CONTACT ===== */}
      <section id="contact" className="d4-cta py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          <div className="d4-cta-block gsap-reveal">
            <span className="inline-flex px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider mb-6" style={{ background: 'var(--d4-accent)', color: '#fff', border: '2px solid var(--d4-fg)', boxShadow: '2px 2px 0 var(--d4-fg)' }}>
              Contact
            </span>
            <h2 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] font-black tracking-tight mb-4" style={{ color: 'var(--d4-fg)' }}>
              Ready to fix
              <br />
              <span style={{ color: 'var(--d4-accent)' }}>your ride?</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--d4-fg-muted)' }}>
              Get a free estimate. Call, WhatsApp, or fill out the form. We respond within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-black transition-all duration-200" style={{ background: '#25D366', color: '#fff', border: '2px solid #1a9e4a', boxShadow: '4px 4px 0 #1a9e4a' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #1a9e4a' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 #1a9e4a' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp
              </a>
              <a href={`tel:${contactInfo.phone}`} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-black transition-all duration-200" style={{ background: 'var(--d4-bg-soft)', color: 'var(--d4-fg)', border: '2px solid var(--d4-fg)', boxShadow: '4px 4px 0 var(--d4-border)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--d4-accent)'; e.currentTarget.style.borderColor = 'var(--d4-accent)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--d4-border)'; e.currentTarget.style.borderColor = 'var(--d4-fg)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                {contactInfo.phoneDisplay}
              </a>
            </div>

            <div className="text-sm space-y-1" style={{ color: 'var(--d4-fg-light)' }}>
              <p>{contactInfo.location}</p>
              <p>{contactInfo.hours}</p>
            </div>
          </div>

          {/* Form */}
          <div className="d4-cta-block gsap-reveal rounded-xl p-8 sm:p-10" style={{ background: 'var(--d4-bg-soft)', border: '2px solid var(--d4-fg)', boxShadow: '6px 6px 0 var(--d4-border)' }}>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {[
                { id: 'd4-name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { id: 'd4-phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '+506 8769 9927' },
              ].map((f) => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--d4-fg)' }}>{f.label}</label>
                  <input type={f.type} id={f.id} required className="w-full px-4 py-3 rounded-lg text-sm font-semibold focus:outline-none transition-all" style={{ background: 'var(--d4-card)', border: '2px solid var(--d4-fg)', color: 'var(--d4-fg)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--d4-accent)'; e.currentTarget.style.boxShadow = '3px 3px 0 var(--d4-accent)' }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--d4-fg)'; e.currentTarget.style.boxShadow = 'none' }}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}
              <div>
                <label htmlFor="d4-service" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--d4-fg)' }}>Service</label>
                <select id="d4-service" className="w-full px-4 py-3 rounded-lg text-sm font-semibold focus:outline-none transition-all" style={{ background: 'var(--d4-card)', border: '2px solid var(--d4-fg)', color: 'var(--d4-fg)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--d4-accent)'; e.currentTarget.style.boxShadow = '3px 3px 0 var(--d4-accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--d4-fg)'; e.currentTarget.style.boxShadow = 'none' }}
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
                <label htmlFor="d4-msg" className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--d4-fg)' }}>Message</label>
                <textarea id="d4-msg" rows={3} className="w-full px-4 py-3 rounded-lg text-sm font-semibold focus:outline-none transition-all resize-none" style={{ background: 'var(--d4-card)', border: '2px solid var(--d4-fg)', color: 'var(--d4-fg)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--d4-accent)'; e.currentTarget.style.boxShadow = '3px 3px 0 var(--d4-accent)' }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--d4-fg)'; e.currentTarget.style.boxShadow = 'none' }}
                  placeholder="Tell us what happened..."
                />
              </div>
              <button type="submit" className="w-full py-4 rounded-lg text-sm font-black tracking-wide uppercase transition-all duration-200" style={{ background: 'var(--d4-accent)', color: '#fff', border: '2px solid var(--d4-fg)', boxShadow: '4px 4px 0 var(--d4-fg)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translate(-2px, -2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 var(--d4-fg)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0, 0)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--d4-fg)' }}
              >
                Send Request →
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="px-6 sm:px-12 lg:px-20 py-8" style={{ borderTop: '2px solid var(--d4-fg)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-display text-lg font-black uppercase tracking-wide" style={{ color: 'var(--d4-fg)' }}>Uvita Body Shop</span>
          <span className="text-xs" style={{ color: 'var(--d4-fg-light)' }}>&copy; 2026 Uvita Body Shop. All rights reserved.</span>
        </div>
      </footer>

      </div>{/* end scrolling content wrapper */}
    </div>
  )
}
