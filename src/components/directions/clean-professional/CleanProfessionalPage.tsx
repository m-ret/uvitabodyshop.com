'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const PaintParticleScene = dynamic(
  () =>
    import('@/components/3d/PaintParticleScene').then(
      (m) => m.PaintParticleScene
    ),
  { ssr: false }
)

gsap.registerPlugin(ScrollTrigger)

const jakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SERVICES = [
  {
    title: 'Collision Repair',
    description:
      'Full structural restoration after any impact. OEM-spec repairs backed by certified technicians.',
    icon: '◈',
  },
  {
    title: 'Paint Restoration',
    description:
      'Factory-matched finishes using premium materials. Showroom quality on every vehicle we touch.',
    icon: '◈',
  },
  {
    title: 'Frame Straightening',
    description:
      'Computerized laser measurement systems realign frames to manufacturer specifications.',
    icon: '◈',
  },
  {
    title: 'Dent Removal',
    description:
      'Paintless and traditional dent removal techniques for every panel and curve.',
    icon: '◈',
  },
  {
    title: 'Auto Detailing',
    description:
      'Deep-clean interior and exterior packages that restore your vehicle to day-one condition.',
    icon: '◈',
  },
  {
    title: 'Accessories Installation',
    description:
      'Professional installation of aftermarket accessories and trim. Factory-quality fit, every time.',
    icon: '◈',
  },
]

const STATS = [
  { value: 500, suffix: '+', label: 'Vehicles Restored' },
  { value: 20, suffix: '+', label: 'Years Experience' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
  { value: 48, suffix: 'h', label: 'Avg Turnaround' },
]

const TRUST_SIGNALS = [
  {
    icon: '✓',
    title: 'Lifetime Warranty',
    desc: 'All structural repairs covered for the life of your vehicle.',
  },
  {
    icon: '✓',
    title: 'OEM Certified Parts',
    desc: 'Only manufacturer-approved materials used on every repair.',
  },
  {
    icon: '✓',
    title: 'Premium Materials',
    desc: 'Roberlo, BESA, 3M, and VICCO products used on every repair.',
  },
  {
    icon: '✓',
    title: 'Free Estimates',
    desc: 'No-obligation assessment with transparent pricing.',
  },
]

const MATERIAL_PARTNERS = [
  'Roberlo',
  'BESA',
  '3M',
  'VICCO',
]

function CountUp({
  value,
  suffix,
  trigger,
}: {
  value: number
  suffix: string
  trigger: boolean
}) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const duration = 2000
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [trigger, value])

  return (
    <span>
      {display}
      {suffix}
    </span>
  )
}

export function CleanProfessionalPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const heroLeftRef = useRef<HTMLDivElement>(null)
  const heroRightRef = useRef<HTMLDivElement>(null)
  const heroBadgesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const trustRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLDivElement>(null)
  const sliderContainerRef = useRef<HTMLDivElement>(null)

  const [statsTriggered, setStatsTriggered] = useState(false)
  const [sliderPos, setSliderPos] = useState(50)
  const isDragging = useRef(false)

  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
  })

  // Before/after slider logic
  const handleSliderMouseDown = useCallback(() => {
    isDragging.current = true
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current || !sliderContainerRef.current) return
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.max(5, Math.min(95, x)))
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current || !sliderContainerRef.current) return
    const rect = sliderContainerRef.current.getBoundingClientRect()
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100
    setSliderPos(Math.max(5, Math.min(95, x)))
  }, [])

  const stopDrag = useCallback(() => {
    isDragging.current = false
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', stopDrag)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', stopDrag)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', stopDrag)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', stopDrag)
    }
  }, [handleMouseMove, handleTouchMove, stopDrag])

  useGSAP(
    () => {
      // Sticky header: fade in on scroll
      if (headerRef.current) {
        gsap.set(headerRef.current, { opacity: 0, y: -20 })
        ScrollTrigger.create({
          start: 80,
          onEnter: () =>
            gsap.to(headerRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: 'power3.out',
            }),
          onLeaveBack: () =>
            gsap.to(headerRef.current, {
              opacity: 0,
              y: -20,
              duration: 0.35,
              ease: 'power3.in',
            }),
        })
      }

      // Hero entrance — left slides from left, right slides from right
      if (heroLeftRef.current) {
        gsap.fromTo(
          heroLeftRef.current,
          { x: -60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.15 }
        )
      }
      if (heroRightRef.current) {
        gsap.fromTo(
          heroRightRef.current,
          { x: 60, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.3 }
        )
      }
      if (heroBadgesRef.current) {
        const badges = heroBadgesRef.current.querySelectorAll('.trust-badge')
        gsap.fromTo(
          badges,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.9,
          }
        )
      }

      // Stats
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 75%',
          onEnter: () => setStatsTriggered(true),
        })
        gsap.fromTo(
          statsRef.current.querySelectorAll('.stat-item'),
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Services cards
      if (servicesRef.current) {
        gsap.fromTo(
          servicesRef.current.querySelectorAll('.service-card'),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: servicesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Trust section
      if (trustRef.current) {
        gsap.fromTo(
          trustRef.current.querySelectorAll('.trust-card'),
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: trustRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Lead capture
      if (leadRef.current) {
        gsap.fromTo(
          leadRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leadRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    },
    { scope: containerRef }
  )

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    alert(`Thank you, ${formState.name}! We'll contact you within 2 hours.`)
  }

  const displayStyle = {
    fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans", sans-serif)',
  }
  const bodyStyle = {
    fontFamily: 'var(--font-inter, Inter, system-ui, sans-serif)',
  }

  return (
    <div
      ref={containerRef}
      className={`${jakartaSans.variable} ${inter.variable} min-h-screen bg-white text-[#1C1C1A]`}
      style={bodyStyle}
    >
      {/* ─── STICKY HEADER ────────────────────────────────────── */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-4 flex items-center justify-between"
        style={{
          backdropFilter: 'blur(16px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.80) 100%)',
          borderBottom: '1px solid rgba(26,82,118,0.08)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#1A5276]" />
          <span
            className="text-[#1C1C1A] font-bold text-sm tracking-wide"
            style={displayStyle}
          >
            UVITA BODY SHOP
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {['Services', 'Process', 'About'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[#1C1C1A] text-sm font-medium hover:text-[#1A5276] transition-colors duration-200"
              style={bodyStyle}
            >
              {item}
            </a>
          ))}
        </nav>
        <a
          href="#estimate"
          className="px-5 py-2.5 bg-[#1A5276] text-white text-sm font-semibold rounded-sm hover:bg-[#154360] transition-colors duration-200"
          style={displayStyle}
        >
          Get Estimate
        </a>
      </header>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">
        {/* Left: Photo simulation with WebGL overlay */}
        <div
          ref={heroLeftRef}
          className="relative flex-1 min-h-[50vh] lg:min-h-screen overflow-hidden"
        >
          {/* Simulated high-res paint photo */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 30% 40%, #1e3a5f 0%, #0d1b2e 40%, #0a1520 100%)
              `,
            }}
          />
          {/* Paint texture simulation */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                repeating-linear-gradient(
                  -45deg,
                  transparent,
                  transparent 2px,
                  rgba(26,82,118,0.15) 2px,
                  rgba(26,82,118,0.15) 4px
                )
              `,
            }}
          />
          {/* Glossy highlight simulation */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 50% 40% at 35% 30%, rgba(232,160,32,0.12) 0%, transparent 60%), radial-gradient(ellipse 70% 70% at 70% 60%, rgba(26,82,118,0.4) 0%, transparent 70%)',
            }}
          />
          {/* Bottom gradient for text readability */}
          <div
            className="absolute bottom-0 left-0 right-0 h-40"
            style={{
              background:
                'linear-gradient(to top, rgba(10,21,32,0.6) 0%, transparent 100%)',
            }}
          />

          {/* WebGL overlay - subtle particles */}
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <PaintParticleScene />
          </div>

          {/* Photo caption */}
          <div className="absolute bottom-8 left-8 right-8">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-px bg-[#E8A020]" />
              <span
                className="text-[#E8A020] text-xs tracking-[0.25em] uppercase font-semibold"
                style={displayStyle}
              >
                Design Direction B
              </span>
            </div>
            <p className="text-white/60 text-xs" style={bodyStyle}>
              Premium Paint Restoration — Uvita, Costa Rica
            </p>
          </div>
        </div>

        {/* Right: Headline + CTA + Trust */}
        <div
          ref={heroRightRef}
          className="relative flex-1 flex items-center bg-[#F7F7F5] px-8 lg:px-16 py-20 lg:py-0"
        >
          <div className="w-full max-w-[540px] mx-auto lg:mx-0">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-px bg-[#1A5276]" />
              <span
                className="text-[#1A5276] text-xs tracking-[0.3em] uppercase font-semibold"
                style={displayStyle}
              >
                Premium Auto Body
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-[clamp(3rem,6vw,5.5rem)] font-extrabold leading-[1.05] tracking-tight text-[#1C1C1A] mb-6"
              style={displayStyle}
            >
              Precision
              <br />
              <span className="text-[#1A5276]">Paint.</span>
              <br />
              Perfect
              <br />
              <span className="text-[#E8A020]">Finish.</span>
            </h1>

            <p
              className="text-[#4a4a48] text-lg leading-[1.7] mb-10 max-w-[420px]"
              style={bodyStyle}
            >
              Uvita Body Shop delivers factory-quality collision repair and
              paint restoration. Certified technicians, premium materials, and a
              lifetime warranty — backed by 20 years of craftsmanship.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href="#estimate"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#1A5276] text-white font-semibold text-sm tracking-wide rounded-sm hover:bg-[#154360] transition-colors duration-200"
                style={displayStyle}
              >
                Get Free Estimate
              </a>
              <a
                href="tel:+50612345678"
                className="inline-flex items-center justify-center px-8 py-4 border border-[#1C1C1A]/20 text-[#1C1C1A] font-medium text-sm rounded-sm hover:border-[#1A5276] hover:text-[#1A5276] transition-colors duration-200"
                style={bodyStyle}
              >
                Call Now
              </a>
            </div>

            {/* Trust stack */}
            <div
              ref={heroBadgesRef}
              className="flex flex-col gap-3 pt-8 border-t border-[#1C1C1A]/10"
            >
              {[
                'Lifetime warranty on all repairs',
                'OEM-certified technicians',
                'Free estimate — 2-hour response',
              ].map((badge) => (
                <div
                  key={badge}
                  className="trust-badge flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[#1A5276]/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#1A5276] text-[10px] font-bold">
                      ✓
                    </span>
                  </div>
                  <span
                    className="text-[#4a4a48] text-sm"
                    style={bodyStyle}
                  >
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-30">
          <div className="w-px h-10 bg-gradient-to-b from-[#1A5276] to-transparent animate-pulse" />
          <span
            className="text-[10px] tracking-[0.3em] uppercase text-[#1A5276]"
            style={displayStyle}
          >
            Scroll
          </span>
        </div>
      </section>

      {/* ─── BEFORE / AFTER SLIDER ────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#1A5276]" />
              <span
                className="text-[#1A5276] text-xs tracking-[0.3em] uppercase font-semibold"
                style={displayStyle}
              >
                Our Work
              </span>
              <div className="w-8 h-px bg-[#1A5276]" />
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-[#1C1C1A] leading-tight mb-4"
              style={displayStyle}
            >
              See The{' '}
              <span className="text-[#1A5276]">Difference</span>
            </h2>
            <p
              className="text-[#4a4a48] text-base max-w-md mx-auto"
              style={bodyStyle}
            >
              Drag to reveal the transformation. Every vehicle leaves looking
              factory-new.
            </p>
          </div>

          {/* Slider */}
          <div
            ref={sliderContainerRef}
            className="relative w-full max-w-[900px] mx-auto h-[400px] lg:h-[520px] select-none overflow-hidden rounded-sm cursor-col-resize"
            style={{ touchAction: 'none' }}
          >
            {/* BEFORE panel */}
            <div className="absolute inset-0">
              {/* Damaged vehicle simulation */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, #3d3d3d 0%, #5a5a5a 30%, #4a4a4a 60%, #2d2d2d 100%)',
                }}
              />
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background: `
                    repeating-linear-gradient(
                      30deg,
                      transparent,
                      transparent 3px,
                      rgba(0,0,0,0.3) 3px,
                      rgba(0,0,0,0.3) 5px
                    )
                  `,
                }}
              />
              {/* Dent simulation */}
              <div
                className="absolute"
                style={{
                  top: '25%',
                  left: '30%',
                  width: '180px',
                  height: '120px',
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(80,80,80,0.3) 50%, transparent 70%)',
                }}
              />
              <div
                className="absolute"
                style={{
                  top: '45%',
                  left: '15%',
                  width: '100px',
                  height: '60px',
                  background:
                    'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 70%)',
                }}
              />
              <div className="absolute bottom-8 left-8">
                <span
                  className="px-3 py-1.5 bg-black/50 text-white text-xs font-semibold tracking-wider uppercase rounded-sm"
                  style={displayStyle}
                >
                  Before
                </span>
              </div>
            </div>

            {/* AFTER panel — revealed by clip-path */}
            <div
              className="absolute inset-0"
              style={{
                clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                transition: isDragging.current ? 'none' : 'clip-path 0.05s',
              }}
            >
              {/* Repaired & painted simulation */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(135deg, #0d3052 0%, #1A5276 30%, #1d6895 60%, #0a2640 100%)',
                }}
              />
              {/* Glossy highlight */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 40% at 40% 35%, rgba(255,255,255,0.18) 0%, transparent 60%), radial-gradient(ellipse 40% 30% at 65% 55%, rgba(232,160,32,0.08) 0%, transparent 60%)',
                }}
              />
              {/* Paint depth lines */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `repeating-linear-gradient(
                    -20deg,
                    transparent,
                    transparent 8px,
                    rgba(255,255,255,0.04) 8px,
                    rgba(255,255,255,0.04) 9px
                  )`,
                }}
              />
              <div className="absolute bottom-8 left-8">
                <span
                  className="px-3 py-1.5 bg-[#1A5276]/80 text-white text-xs font-semibold tracking-wider uppercase rounded-sm"
                  style={displayStyle}
                >
                  After
                </span>
              </div>
            </div>

            {/* Divider handle */}
            <div
              className="absolute top-0 bottom-0 z-10 flex items-center justify-center cursor-col-resize"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              onMouseDown={handleSliderMouseDown}
              onTouchStart={() => {
                isDragging.current = true
              }}
            >
              <div className="w-0.5 h-full bg-white/80 shadow-lg" />
              <div
                className="absolute w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center border border-[#1A5276]/20"
                style={{ cursor: 'col-resize' }}
              >
                <span className="text-[#1A5276] text-xs select-none font-bold">
                  ⟨⟩
                </span>
              </div>
            </div>
          </div>

          <p
            className="text-center text-[#9a9a98] text-xs mt-6"
            style={bodyStyle}
          >
            Drag the handle left or right to compare
          </p>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-20 bg-[#F7F7F5]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#1C1C1A]/10">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="stat-item px-0 lg:px-12 py-8 lg:py-0 text-center"
              >
                <div
                  className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold leading-none text-[#1A5276] tabular-nums"
                  style={displayStyle}
                >
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    trigger={statsTriggered}
                  />
                </div>
                <div
                  className="text-[#4a4a48] text-sm font-medium mt-2"
                  style={bodyStyle}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────────── */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-[600px] mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#1A5276]" />
              <span
                className="text-[#1A5276] text-xs tracking-[0.3em] uppercase font-semibold"
                style={displayStyle}
              >
                What We Do
              </span>
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-[#1C1C1A] leading-tight"
              style={displayStyle}
            >
              Full-Service{' '}
              <span className="text-[#1A5276]">Auto Body Repair</span>
            </h2>
          </div>

          <div
            ref={servicesRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="service-card group p-8 border border-[#1C1C1A]/08 rounded-sm hover:border-[#1A5276]/30 hover:shadow-lg transition-all duration-300 cursor-default"
                style={{ borderColor: 'rgba(28,28,26,0.08)' }}
              >
                <div className="w-10 h-10 rounded-sm bg-[#1A5276]/06 flex items-center justify-center mb-6 group-hover:bg-[#1A5276]/12 transition-colors duration-300"
                  style={{ background: 'rgba(26,82,118,0.06)' }}>
                  <span className="text-[#1A5276] text-base">◈</span>
                </div>
                <h3
                  className="text-[#1C1C1A] font-bold text-base mb-3 leading-tight"
                  style={displayStyle}
                >
                  {service.title}
                </h3>
                <p
                  className="text-[#6a6a68] text-sm leading-[1.7]"
                  style={bodyStyle}
                >
                  {service.description}
                </p>
                <div className="mt-6 flex items-center gap-2 text-[#1A5276] text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={displayStyle}>
                  Learn more →
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST SIGNALS ────────────────────────────────────── */}
      <section className="py-24 bg-[#F7F7F5]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#1A5276]" />
              <span
                className="text-[#1A5276] text-xs tracking-[0.3em] uppercase font-semibold"
                style={displayStyle}
              >
                Why Choose Us
              </span>
              <div className="w-8 h-px bg-[#1A5276]" />
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-[#1C1C1A] leading-tight"
              style={displayStyle}
            >
              You're In{' '}
              <span className="text-[#1A5276]">Good Hands</span>
            </h2>
          </div>

          <div
            ref={trustRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {TRUST_SIGNALS.map((signal) => (
              <div
                key={signal.title}
                className="trust-card p-8 bg-white rounded-sm border border-[#1C1C1A]/06 text-center"
                style={{ borderColor: 'rgba(28,28,26,0.06)' }}
              >
                <div className="w-12 h-12 rounded-full bg-[#1A5276] flex items-center justify-center mx-auto mb-5">
                  <span className="text-white font-bold">{signal.icon}</span>
                </div>
                <h3
                  className="text-[#1C1C1A] font-bold text-base mb-3"
                  style={displayStyle}
                >
                  {signal.title}
                </h3>
                <p
                  className="text-[#6a6a68] text-sm leading-[1.7]"
                  style={bodyStyle}
                >
                  {signal.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Material partners */}
          <div className="border-t border-[#1C1C1A]/10 pt-12">
            <p
              className="text-center text-[#9a9a98] text-xs tracking-[0.2em] uppercase mb-8"
              style={displayStyle}
            >
              Premium Materials We Trust
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {MATERIAL_PARTNERS.map((partner) => (
                <div
                  key={partner}
                  className="px-6 py-3 border border-[#1C1C1A]/10 rounded-sm"
                >
                  <span
                    className="text-[#9a9a98] text-sm font-medium tracking-wide"
                    style={displayStyle}
                  >
                    {partner}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROCESS ──────────────────────────────────────────── */}
      <section id="process" className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-[600px] mx-auto text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#1A5276]" />
              <span
                className="text-[#1A5276] text-xs tracking-[0.3em] uppercase font-semibold"
                style={displayStyle}
              >
                How It Works
              </span>
              <div className="w-8 h-px bg-[#1A5276]" />
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-[#1C1C1A] leading-tight"
              style={displayStyle}
            >
              Simple Process,{' '}
              <span className="text-[#1A5276]">Zero Hassle</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Contact Us',
                desc: 'Call or submit online for a free, no-obligation estimate.',
              },
              {
                step: '02',
                title: 'Drop Off',
                desc: 'Bring your vehicle in. We assess the damage and walk you through every step.',
              },
              {
                step: '03',
                title: 'We Repair',
                desc: 'Precision work by certified technicians. Regular updates throughout.',
              },
              {
                step: '04',
                title: 'Drive Away',
                desc: 'Inspected, detailed, and ready — usually within 48 hours.',
              },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < 3 && (
                  <div className="hidden md:block absolute top-5 left-[60%] w-[calc(100%-10px)] h-px bg-gradient-to-r from-[#1A5276]/30 to-transparent" />
                )}
                <div className="w-10 h-10 rounded-full bg-[#1A5276] text-white flex items-center justify-center mx-auto mb-5 text-sm font-bold"
                  style={displayStyle}>
                  {item.step}
                </div>
                <h3
                  className="text-[#1C1C1A] font-bold text-base mb-3"
                  style={displayStyle}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[#6a6a68] text-sm leading-[1.7]"
                  style={bodyStyle}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEAD CAPTURE ─────────────────────────────────────── */}
      <section id="estimate" className="py-24 bg-[#1A5276] relative overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Amber accent top line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#E8A020] to-transparent" />

        <div ref={leadRef} className="relative max-w-[800px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#E8A020]" />
              <span
                className="text-[#E8A020] text-xs tracking-[0.3em] uppercase font-semibold"
                style={displayStyle}
              >
                Free Consultation
              </span>
              <div className="w-8 h-px bg-[#E8A020]" />
            </div>
            <h2
              className="text-[clamp(2rem,5vw,4rem)] font-extrabold text-white leading-tight mb-4"
              style={displayStyle}
            >
              Get Your Free
              <br />
              <span className="text-[#E8A020]">Estimate Today</span>
            </h2>
            <p className="text-white/70 text-base max-w-md mx-auto" style={bodyStyle}>
              Response within 2 business hours. No commitment required.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-sm p-8 lg:p-12 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  className="block text-[11px] tracking-[0.15em] uppercase text-[#4a4a48] font-semibold mb-2"
                  style={displayStyle}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full border border-[#1C1C1A]/15 text-[#1C1C1A] px-4 py-3 text-sm focus:outline-none focus:border-[#1A5276] transition-colors rounded-sm placeholder-[#c0c0be]"
                  placeholder="John Smith"
                  style={bodyStyle}
                />
              </div>
              <div>
                <label
                  className="block text-[11px] tracking-[0.15em] uppercase text-[#4a4a48] font-semibold mb-2"
                  style={displayStyle}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formState.phone}
                  onChange={(e) =>
                    setFormState({ ...formState, phone: e.target.value })
                  }
                  className="w-full border border-[#1C1C1A]/15 text-[#1C1C1A] px-4 py-3 text-sm focus:outline-none focus:border-[#1A5276] transition-colors rounded-sm placeholder-[#c0c0be]"
                  placeholder="+506 8888-0000"
                  style={bodyStyle}
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-[11px] tracking-[0.15em] uppercase text-[#4a4a48] font-semibold mb-2"
                style={displayStyle}
              >
                Service Needed
              </label>
              <select
                value={formState.service}
                onChange={(e) =>
                  setFormState({ ...formState, service: e.target.value })
                }
                className="w-full border border-[#1C1C1A]/15 text-[#1C1C1A] px-4 py-3 text-sm focus:outline-none focus:border-[#1A5276] transition-colors appearance-none rounded-sm bg-white"
                style={bodyStyle}
              >
                <option value="">Select a service...</option>
                {SERVICES.map((s) => (
                  <option key={s.title} value={s.title}>
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label
                className="block text-[11px] tracking-[0.15em] uppercase text-[#4a4a48] font-semibold mb-2"
                style={displayStyle}
              >
                Describe The Damage
              </label>
              <textarea
                rows={4}
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                className="w-full border border-[#1C1C1A]/15 text-[#1C1C1A] px-4 py-3 text-sm focus:outline-none focus:border-[#1A5276] transition-colors resize-none rounded-sm placeholder-[#c0c0be]"
                placeholder="Briefly describe the damage or service needed..."
                style={bodyStyle}
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1A5276] text-white font-bold text-sm tracking-[0.15em] uppercase rounded-sm hover:bg-[#154360] active:bg-[#0f3350] transition-colors duration-200"
              style={displayStyle}
            >
              Send My Free Estimate Request →
            </button>

            <p className="text-center text-[#9a9a98] text-xs mt-4" style={bodyStyle}>
              We never share your information. Privacy guaranteed.
            </p>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-12 bg-[#0a1520] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div
              className="font-bold text-white text-base tracking-wide"
              style={displayStyle}
            >
              Uvita <span className="text-[#E8A020]">Body Shop</span>
            </div>
            <div className="text-white/30 text-xs mt-1" style={bodyStyle}>
              Premium Auto Body Repair — Uvita, Costa Rica
            </div>
          </div>
          <div className="text-white/20 text-xs" style={bodyStyle}>
            © {new Date().getFullYear()} Uvita Body Shop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
