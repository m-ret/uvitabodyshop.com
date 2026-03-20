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
/*  Scroll Progress Bar                                                */
/* ------------------------------------------------------------------ */

function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      if (!barRef.current) return
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      barRef.current.style.transform = `scaleX(${progress})`
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return <div ref={barRef} className="d3-scroll-progress" />
}

/* ------------------------------------------------------------------ */
/*  Design3Page                                                        */
/* ------------------------------------------------------------------ */

export default function Design3Page() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLHeadingElement>(null)
  const hScrollRef = useRef<HTMLDivElement>(null)
  const hScrollContainerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      /* --- Hero: text scales + fades on scroll --- */
      gsap.to('.d3-hero-title', {
        scrollTrigger: {
          trigger: '.d3-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        scale: 0.8,
        opacity: 0,
        y: -100,
        ease: 'none',
      })

      /* --- Hero: subtitle and label parallax --- */
      gsap.to('.d3-hero-sub', {
        scrollTrigger: {
          trigger: '.d3-hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: -60,
        opacity: 0,
        ease: 'none',
      })

      /* --- Hero entrance timeline --- */
      const heroTl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      heroTl
        .from('.d3-hero-line', {
          y: 120,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
        })
        .from('.d3-hero-label', { opacity: 0, x: -30, duration: 0.6 }, '-=0.6')
        .from('.d3-hero-sub', { opacity: 0, y: 30, duration: 0.6 }, '-=0.4')
        .from('.d3-hero-cta', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .from('.d3-hero-scroll', { opacity: 0, duration: 0.8 }, '-=0.2')

      /* --- Stats: numbers slide up with stagger --- */
      gsap.from('.d3-stat', {
        scrollTrigger: { trigger: '.d3-stats', start: 'top 80%' },
        y: 80,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })

      /* --- Craft section: massive text parallax --- */
      gsap.fromTo(
        '.d3-craft-heading',
        { y: 100 },
        {
          y: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: '.d3-craft',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      )

      gsap.from('.d3-craft-text', {
        scrollTrigger: { trigger: '.d3-craft', start: 'top 70%' },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      })

      gsap.fromTo(
        '.d3-craft-image',
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          ease: 'power3.inOut',
          duration: 1.2,
          scrollTrigger: {
            trigger: '.d3-craft',
            start: 'top 65%',
          },
        }
      )

      /* --- Horizontal scroll section (desktop only — mobile gets vertical stack) --- */
      const hScroll = hScrollRef.current
      const hContainer = hScrollContainerRef.current
      if (hScroll && hContainer && window.innerWidth >= 768) {
        const getScrollDistance = () => hScroll.scrollWidth - window.innerWidth

        gsap.to(hScroll, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: hContainer,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
      }

      /* --- Booth section: parallax + text reveal --- */
      gsap.fromTo(
        '.d3-booth-bg',
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.d3-booth',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      gsap.from('.d3-booth-text', {
        scrollTrigger: { trigger: '.d3-booth', start: 'top 70%' },
        y: 50,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      })

      /* --- Process: massive cards scale up + stagger --- */
      gsap.from('.d3-proc-card', {
        scrollTrigger: { trigger: '.d3-process', start: 'top 75%' },
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      })

      /* --- Materials: slide in from sides --- */
      gsap.from('.d3-mat-item', {
        scrollTrigger: { trigger: '.d3-materials', start: 'top 80%' },
        x: (i: number) => (i % 2 === 0 ? -60 : 60),
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
      })

      /* --- CTA: entire block slides up --- */
      gsap.from('.d3-cta-block', {
        scrollTrigger: { trigger: '.d3-cta', start: 'top 85%' },
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: 'power3.out',
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className="design3" style={{ background: 'var(--d3-bg)', color: 'var(--d3-fg)' }}>
      <ScrollProgress />
      <Navigation />

      {/* ===== HERO — 3D car background + scroll-reactive typography ===== */}
      <section className="d3-hero relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ background: 'var(--d3-bg)' }}>
        {/* 3D Car — visual context, tells you it's automotive */}
        <div className="absolute inset-0" aria-hidden="true">
          <CarPaintScene
            paintColor="#4a4a4e"
            rimColor="#ff4d00"
            rimColor2="#ff6a2a"
            mistColor="#ff4d0044"
          />
        </div>

        {/* Industrial grid overlay — subtle on top of the 3D scene */}
        <div className="absolute inset-0 d3-tech-grid opacity-30" />

        {/* Dark gradients for text legibility over the car */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--d3-bg)] via-[var(--d3-bg)]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--d3-bg)] via-transparent to-[var(--d3-bg)]/40" />

        {/* Diagonal accent line */}
        <div
          className="absolute top-0 right-[30%] w-px origin-top-right"
          style={{
            height: '140%',
            background: `linear-gradient(to bottom, transparent, var(--d3-accent), transparent)`,
            transform: 'rotate(-15deg)',
            opacity: 0.1,
          }}
        />

        {/* Content */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-24">
          <div className="max-w-7xl mx-auto">
            {/* Label — tells you exactly what we are */}
            <div className="d3-hero-label flex items-center gap-4 mb-10">
              <div className="w-12 h-px" style={{ background: 'var(--d3-accent)' }} />
              <span className="font-mono text-xs tracking-[0.3em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                Auto Body &amp; Paint &mdash; Uvita, Costa Rica
              </span>
            </div>

            {/* Title — massive, grounded in what we do */}
            <h1 ref={heroTextRef} className="d3-hero-title font-display leading-[0.85] tracking-[-0.03em]" style={{ fontSize: 'clamp(3.5rem, 12vw, 12rem)' }}>
              <span className="d3-hero-line block">Every</span>
              <span className="d3-hero-line block">dent.</span>
              <span className="d3-hero-line block" style={{ color: 'var(--d3-accent)' }}>Gone.</span>
            </h1>

            {/* Subtitle — states the service clearly */}
            <div className="d3-hero-sub mt-10 max-w-lg">
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(232,232,232,0.55)' }}>
                Collision repair, full-body paint, and custom finishes.
                Spray booth. Infrared oven. 9 years of precision.
              </p>
            </div>

            {/* Service micro-tags — immediate clarity */}
            <div className="d3-hero-sub flex flex-wrap gap-3 mt-6">
              {['Collision Repair', 'Full Paint', 'Dent Repair', 'Touch-Ups', 'Custom'].map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] tracking-[0.15em] uppercase px-3 py-1.5"
                  style={{ border: '1px solid rgba(255,77,0,0.25)', color: 'rgba(232,232,232,0.45)' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="#contact"
                className="d3-hero-cta inline-flex px-8 py-4 text-sm font-semibold tracking-wide uppercase transition-all duration-300"
                style={{ background: 'var(--d3-accent)', color: '#0a0a0a' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--d3-accent-hover)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,77,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--d3-accent)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Free Estimate
              </a>
              <a
                href="#services"
                className="d3-hero-cta inline-flex px-8 py-4 text-sm font-semibold tracking-wide uppercase transition-all duration-300"
                style={{ border: '1px solid rgba(232,232,232,0.15)', color: 'rgba(232,232,232,0.6)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--d3-accent)'
                  e.currentTarget.style.color = 'var(--d3-accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(232,232,232,0.15)'
                  e.currentTarget.style.color = 'rgba(232,232,232,0.6)'
                }}
              >
                View Services
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="d3-hero-scroll absolute bottom-8 left-6 sm:left-12 lg:left-24 flex items-center gap-4">
          <div className="w-px h-16" style={{ background: 'linear-gradient(to bottom, var(--d3-accent), transparent)' }} />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: 'rgba(232,232,232,0.3)' }}>
            Scroll to explore
          </span>
        </div>

        {/* Corner detail */}
        <div className="absolute top-6 right-6 sm:right-12 lg:right-24 font-mono text-[10px] tracking-wider uppercase" style={{ color: 'rgba(232,232,232,0.15)' }}>
          Design 03 / Forge
        </div>
      </section>

      {/* ===== STATS — Massive numbers ===== */}
      <section className="d3-stats py-16 sm:py-20 px-6 sm:px-12 lg:px-24" style={{ borderTop: '1px solid rgba(232,232,232,0.06)' }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: 9, suffix: '+', label: 'Years' },
            { value: 500, suffix: '+', label: 'Vehicles' },
            { value: 4, suffix: '', label: 'Pro Brands' },
            { value: 100, suffix: '%', label: 'Guaranteed' },
          ].map((stat) => (
            <div key={stat.label} className="d3-stat">
              <div className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-0.03em]" style={{ color: 'var(--d3-accent)' }}>
                <CountUp target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase mt-3" style={{ color: 'rgba(232,232,232,0.35)' }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CRAFT — Editorial with clip-reveal image ===== */}
      <section className="d3-craft relative py-32 sm:py-44 px-6 sm:px-12 lg:px-24 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 d3-tech-grid opacity-30" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div className="d3-craft-heading">
            <div className="d3-craft-text flex items-center gap-4 mb-6">
              <div className="w-8 h-px" style={{ background: 'var(--d3-accent)' }} />
              <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                The Craft
              </span>
            </div>
            <h2 className="d3-craft-text font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em]">
              We don&apos;t fix cars.
            </h2>
            <h2 className="d3-craft-text font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em] mt-1" style={{ color: 'var(--d3-accent)' }}>
              We forge them back.
            </h2>
            <p className="d3-craft-text mt-8 max-w-md text-base leading-relaxed" style={{ color: 'rgba(232,232,232,0.5)' }}>
              9 years of hands-on precision. A controlled spray booth with
              infrared curing oven. Professional-grade materials from the
              best names in the industry. Every repair is backed by our
              guarantee.
            </p>
            <div className="d3-craft-text mt-8 flex items-center gap-6 font-mono text-xs" style={{ color: 'rgba(232,232,232,0.3)' }}>
              <span>Roberlo</span>
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--d3-accent)' }} />
              <span>BESA</span>
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--d3-accent)' }} />
              <span>3M</span>
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--d3-accent)' }} />
              <span>VICCO</span>
            </div>
          </div>

          {/* Image — clip reveal */}
          <div className="d3-craft-image relative aspect-[4/5] overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1620584898989-d39f7f9ed1b7?auto=format&fit=crop&w=2400&q=100"
              alt="Technician spray painting a vehicle panel"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--d3-bg), transparent 50%)' }} />
            <div className="absolute bottom-6 left-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--d3-accent)' }} />
                <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(232,232,232,0.4)' }}>
                  Fabricio R&iacute;os &mdash; Founder
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES — Horizontal scroll showcase ===== */}
      <section id="services" style={{ borderTop: '1px solid rgba(232,232,232,0.06)' }}>
        {/* Section header */}
        <div className="px-6 sm:px-12 lg:px-24 pt-24 sm:pt-32 pb-12">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px" style={{ background: 'var(--d3-accent)' }} />
                <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                  Services
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em]">
                What we do.
              </h2>
            </div>
            <p className="hidden md:block font-mono text-[10px] tracking-wider uppercase" style={{ color: 'rgba(232,232,232,0.3)' }}>
              Scroll horizontally →
            </p>
          </div>
        </div>

        {/* === MOBILE: vertical stack (< md) === */}
        <div className="md:hidden px-6 pb-16 space-y-6">
          {services.map((s) => (
            <div
              key={s.number}
              className="d3-svc-card group relative overflow-hidden"
              style={{ height: '65vh', minHeight: '380px', border: '1px solid rgba(232,232,232,0.06)' }}
            >
              <div className="absolute inset-0">
                <Image src={s.image} alt={s.alt} fill sizes="100vw" className="object-cover" />
              </div>
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--d3-bg) 15%, rgba(10,10,10,0.4) 55%, rgba(10,10,10,0.15))' }} />
              <div className="absolute top-4 right-4 font-display text-[6rem] leading-none select-none pointer-events-none" style={{ color: 'rgba(232,232,232,0.03)' }}>
                {s.number}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                  {s.subtitle}
                </span>
                <h3 className="font-display text-3xl tracking-[-0.02em] mt-2">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: 'rgba(232,232,232,0.5)' }}>
                  {s.description}
                </p>
                <div className="mt-4 h-px w-12" style={{ background: 'var(--d3-accent)' }} />
              </div>
            </div>
          ))}
        </div>

        {/* === TABLET+: Horizontal scroll with GSAP pin (>= md) === */}
        <div ref={hScrollContainerRef} className="hidden md:flex relative overflow-hidden h-screen items-center">
          <div ref={hScrollRef} className="flex w-max">
            {services.map((s) => (
              <div
                key={s.number}
                className="d3-svc-card flex-shrink-0 w-[70vw] lg:w-[50vw] px-4 first:pl-12 first:lg:pl-24 last:pr-12 last:lg:pr-24"
              >
                <div
                  className="group relative overflow-hidden"
                  style={{ height: 'min(70vh, 640px)', border: '1px solid rgba(232,232,232,0.06)' }}
                >
                  <div className="absolute inset-0">
                    <Image src={s.image} alt={s.alt} fill sizes="70vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--d3-bg) 10%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.2))' }} />
                  <div className="absolute top-6 right-6 font-display text-[12rem] leading-none select-none pointer-events-none" style={{ color: 'rgba(232,232,232,0.03)' }}>
                    {s.number}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-10">
                    <span className="font-mono text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                      {s.subtitle}
                    </span>
                    <h3 className="font-display text-4xl lg:text-5xl tracking-[-0.02em] mt-2 group-hover:translate-x-2 transition-transform duration-500">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed max-w-sm" style={{ color: 'rgba(232,232,232,0.5)' }}>
                      {s.description}
                    </p>
                    <div className="mt-6 h-px w-12 group-hover:w-24 transition-all duration-500" style={{ background: 'var(--d3-accent)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SPRAY BOOTH — Full-bleed visual proof ===== */}
      <section className="d3-booth relative h-[50vh] sm:h-[70vh] min-h-[350px] sm:min-h-[500px] overflow-hidden">
        {/* Fade edges into dark background */}
        <div className="absolute top-0 left-0 right-0 h-24 z-20 pointer-events-none" style={{ background: 'linear-gradient(to bottom, var(--d3-bg), transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-24 z-20 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--d3-bg), transparent)' }} />

        {/* Background image */}
        <div className="d3-booth-bg absolute inset-0">
          <Image
            src="https://img.freepik.com/free-photo/front-view-worker-spraying-powder-paint-from-gum_52683-97009.jpg?w=1920"
            alt="Worker spraying paint in professional booth"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(10,10,10,0.55)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, var(--d3-bg)/80, transparent, var(--d3-bg)/40)' }} />

        {/* Industrial grid overlay */}
        <div className="absolute inset-0 d3-tech-grid opacity-20" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-2xl">
            <div className="d3-booth-text flex items-center gap-4 mb-6">
              <div className="w-8 h-px" style={{ background: 'var(--d3-accent)' }} />
              <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                Our Facility
              </span>
            </div>
            <h2 className="d3-booth-text font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.85] tracking-[-0.02em]">
              Spray booth.
              <br />
              Infrared oven.
              <br />
              <span style={{ color: 'var(--d3-accent)' }}>Zero compromise.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* ===== PROCESS — Massive 2x2 grid with pointer light ===== */}
      <section className="d3-process py-24 sm:py-32 px-6 sm:px-12 lg:px-24 overflow-hidden" style={{ background: 'var(--d3-bg)' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-16 sm:mb-24">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px" style={{ background: 'var(--d3-accent)' }} />
              <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                Process
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em]">
              Damage in.{' '}
              <span style={{ color: 'var(--d3-accent)' }}>Perfection out.</span>
            </h2>
          </div>

          {/* 2x2 grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {processSteps.map((step, i) => (
              <div
                key={step.number}
                className="d3-proc-card group relative overflow-hidden"
                style={{
                  background: 'var(--d3-steel)',
                  border: '1px solid rgba(232,232,232,0.06)',
                  minHeight: '320px',
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  const glow = e.currentTarget.querySelector('.proc-glow') as HTMLElement
                  if (glow) {
                    glow.style.opacity = '1'
                    glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,77,0,0.08), transparent 40%)`
                  }
                  const border = e.currentTarget.querySelector('.proc-border-glow') as HTMLElement
                  if (border) {
                    border.style.opacity = '1'
                    border.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,77,0,0.4), transparent 40%)`
                  }
                }}
                onMouseLeave={(e) => {
                  const glow = e.currentTarget.querySelector('.proc-glow') as HTMLElement
                  if (glow) glow.style.opacity = '0'
                  const border = e.currentTarget.querySelector('.proc-border-glow') as HTMLElement
                  if (border) border.style.opacity = '0'
                }}
              >
                {/* Pointer-following light */}
                <div className="proc-glow absolute inset-0 z-10 pointer-events-none opacity-0 transition-opacity duration-300" />

                {/* Pointer-following border glow — sits behind the card content to create glowing edge effect */}
                <div className="proc-border-glow absolute -inset-px z-0 pointer-events-none opacity-0 transition-opacity duration-300" style={{ borderRadius: 'inherit' }} />

                {/* Massive ghost number — fills the card */}
                <div
                  className="absolute -bottom-8 -right-4 font-display leading-none select-none pointer-events-none"
                  style={{ fontSize: 'clamp(10rem, 20vw, 18rem)', color: 'rgba(232,232,232,0.025)' }}
                >
                  {step.number}
                </div>

                {/* Top accent bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] transition-all duration-500"
                  style={{ background: `linear-gradient(to right, var(--d3-accent), transparent)`, opacity: 0.2 }}
                />
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'var(--d3-accent)', boxShadow: '0 0 15px rgba(255,77,0,0.5)' }}
                />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-between p-8 sm:p-10 lg:p-12">
                  <div>
                    {/* Step label + number */}
                    <div className="flex items-center gap-4 mb-8">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center font-display text-xl sm:text-2xl transition-all duration-500"
                        style={{
                          background: i === 0 ? 'var(--d3-accent)' : 'transparent',
                          color: i === 0 ? '#0a0a0a' : 'var(--d3-accent)',
                          border: `2px solid ${i === 0 ? 'var(--d3-accent)' : 'rgba(255,77,0,0.25)'}`,
                          boxShadow: i === 0 ? '0 0 25px rgba(255,77,0,0.35)' : 'none',
                        }}
                      >
                        {step.number}
                      </div>
                      <div className="h-px flex-1" style={{ background: 'rgba(232,232,232,0.06)' }} />
                      <span className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: 'rgba(232,232,232,0.25)' }}>
                        Step {step.number}
                      </span>
                    </div>

                    {/* Title — massive */}
                    <h3 className="font-display text-[clamp(2rem,4vw,3.5rem)] leading-[0.9] tracking-[-0.02em] mb-4 group-hover:translate-x-1 transition-transform duration-500">
                      {step.title}
                    </h3>
                  </div>

                  <div>
                    <p className="text-sm sm:text-base leading-relaxed max-w-md" style={{ color: 'rgba(232,232,232,0.45)' }}>
                      {step.description}
                    </p>

                    {/* Bottom accent — grows on hover */}
                    <div className="mt-8 w-10 h-px group-hover:w-20 transition-all duration-500" style={{ background: 'var(--d3-accent)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MATERIALS — Industrial grid ===== */}
      <section className="d3-materials py-24 sm:py-32 px-6 sm:px-12 lg:px-24" style={{ background: 'var(--d3-concrete)', borderTop: '1px solid rgba(232,232,232,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-8 h-px" style={{ background: 'var(--d3-accent)' }} />
              <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                Materials
              </span>
              <div className="w-8 h-px" style={{ background: 'var(--d3-accent)' }} />
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em]">
              Industrial grade.{' '}
              <span style={{ color: 'var(--d3-accent)' }}>Only.</span>
            </h2>
          </div>

          {/* Brand names — massive */}
          <div className="d3-mat-item flex flex-wrap items-center justify-center gap-x-8 sm:gap-x-16 gap-y-6 mb-20">
            {materialBrands.map((brand, i) => (
              <span key={brand.name} className="flex items-center gap-8 sm:gap-16">
                <span
                  className="font-display text-[clamp(2.5rem,5vw,4.5rem)] tracking-[0.05em] transition-colors duration-500 cursor-default"
                  style={{ color: 'rgba(232,232,232,0.2)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--d3-accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(232,232,232,0.2)')}
                >
                  {brand.name}
                </span>
                {i < materialBrands.length - 1 && (
                  <span className="hidden sm:block w-px h-8" style={{ background: 'rgba(232,232,232,0.1)' }} aria-hidden="true" />
                )}
              </span>
            ))}
          </div>

          {/* Trust items — industrial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(232,232,232,0.06)' }}>
            {[
              { label: 'Spray Booth', desc: 'Controlled environment with infrared curing oven for factory-grade results.' },
              { label: 'Warranty', desc: 'Every job backed by our written guarantee. Not perfect? We make it right.' },
              { label: 'All Vehicles', desc: 'Every make and model — sedans, trucks, SUVs. No exceptions.' },
            ].map((item) => (
              <div
                key={item.label}
                className="d3-mat-item group p-8 sm:p-10"
                style={{ background: 'var(--d3-concrete)' }}
              >
                <div className="w-8 h-px mb-6 group-hover:w-16 transition-all duration-500" style={{ background: 'var(--d3-accent)' }} />
                <p className="font-display text-xl sm:text-2xl tracking-[-0.02em] mb-3">
                  {item.label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(232,232,232,0.4)' }}>
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
        className="d3-cta py-24 sm:py-32 px-6 sm:px-12 lg:px-24"
        style={{ background: 'var(--d3-bg)', borderTop: '1px solid rgba(232,232,232,0.06)' }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          <div className="d3-cta-block">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px" style={{ background: 'var(--d3-accent)' }} />
              <span className="font-mono text-xs tracking-[0.25em] uppercase" style={{ color: 'var(--d3-accent)' }}>
                Contact
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] tracking-[-0.02em] mb-6">
              Let&apos;s build
              <br />
              <span style={{ color: 'var(--d3-accent)' }}>something.</span>
            </h2>
            <p className="leading-relaxed mb-8 max-w-md" style={{ color: 'rgba(232,232,232,0.5)' }}>
              Get a free estimate. Call, WhatsApp, or fill out the form.
              We respond within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-white text-sm font-semibold tracking-wide hover:bg-[#20BD5A] transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center justify-center gap-3 px-6 py-4 text-sm font-semibold tracking-wide transition-all"
                style={{ border: '1px solid rgba(232,232,232,0.1)', color: 'rgba(232,232,232,0.5)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--d3-accent)'
                  e.currentTarget.style.color = 'var(--d3-accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(232,232,232,0.1)'
                  e.currentTarget.style.color = 'rgba(232,232,232,0.5)'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {contactInfo.phoneDisplay}
              </a>
            </div>

            <div className="font-mono text-xs space-y-1" style={{ color: 'rgba(232,232,232,0.25)' }}>
              <p>{contactInfo.location}</p>
              <p>{contactInfo.hours}</p>
            </div>
          </div>

          {/* Form */}
          <div className="d3-cta-block">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {[
                { id: 'd3-name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { id: 'd3-phone', label: 'Phone / WhatsApp', type: 'tel', placeholder: '+506 8769 9927' },
              ].map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2"
                    style={{ color: 'rgba(232,232,232,0.35)' }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    name={field.id}
                    required
                    className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
                    style={{
                      background: 'var(--d3-steel)',
                      border: '1px solid rgba(232,232,232,0.06)',
                      color: 'var(--d3-fg)',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--d3-accent)')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(232,232,232,0.06)')}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="d3-service"
                  className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: 'rgba(232,232,232,0.35)' }}
                >
                  Service Needed
                </label>
                <select
                  id="d3-service"
                  name="service"
                  className="w-full px-4 py-3 text-sm focus:outline-none transition-colors"
                  style={{
                    background: 'var(--d3-steel)',
                    border: '1px solid rgba(232,232,232,0.06)',
                    color: 'var(--d3-fg)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--d3-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(232,232,232,0.06)')}
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
                  htmlFor="d3-message"
                  className="block font-mono text-[10px] tracking-[0.2em] uppercase mb-2"
                  style={{ color: 'rgba(232,232,232,0.35)' }}
                >
                  Message
                </label>
                <textarea
                  id="d3-message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 text-sm focus:outline-none transition-colors resize-none"
                  style={{
                    background: 'var(--d3-steel)',
                    border: '1px solid rgba(232,232,232,0.06)',
                    color: 'var(--d3-fg)',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--d3-accent)')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(232,232,232,0.06)')}
                  placeholder="Describe the work you need..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 text-sm font-semibold tracking-wide uppercase transition-all duration-300"
                style={{ background: 'var(--d3-accent)', color: '#0a0a0a' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--d3-accent-hover)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(255,77,0,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--d3-accent)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 sm:px-12 lg:px-24" style={{ borderTop: '1px solid rgba(232,232,232,0.06)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-display text-xl tracking-wide">
            Uvita Body Shop
          </span>
          <span className="font-mono text-xs" style={{ color: 'rgba(232,232,232,0.25)' }}>
            &copy; 2026 Uvita Body Shop. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}
