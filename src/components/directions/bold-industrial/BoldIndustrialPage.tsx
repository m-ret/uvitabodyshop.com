'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const MetallicScene = dynamic(
  () => import('@/components/3d/MetallicScene').then((m) => m.MetallicScene),
  { ssr: false }
)

gsap.registerPlugin(ScrollTrigger)

const SERVICES = [
  {
    title: 'Collision Repair',
    description:
      'Full structural restoration after any impact. OEM-spec repairs backed by certified technicians.',
    icon: '⬡',
  },
  {
    title: 'Paint Restoration',
    description:
      'Factory-matched finishes using premium materials. Showroom quality on every vehicle we touch.',
    icon: '⬡',
  },
  {
    title: 'Frame Straightening',
    description:
      'Computerized laser measurement systems realign frames to manufacturer specifications.',
    icon: '⬡',
  },
  {
    title: 'Dent Removal',
    description:
      'Paintless and traditional dent removal techniques for every panel and curve.',
    icon: '⬡',
  },
  {
    title: 'Auto Detailing',
    description:
      'Deep-clean interior and exterior packages that restore your vehicle to day-one condition.',
    icon: '⬡',
  },
  {
    title: 'Accessories Installation',
    description:
      'Professional installation of aftermarket accessories and trim. Factory-quality fit, every time.',
    icon: '⬡',
  },
]

const STATS = [
  { value: 500, suffix: '+', label: 'Vehicles Restored' },
  { value: 20, suffix: '+', label: 'Years Experience' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' },
  { value: 48, suffix: 'h', label: 'Avg Turnaround' },
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
    let start = 0
    const duration = 1800
    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      start = Math.round(eased * value)
      setDisplay(start)
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

export function BoldIndustrialPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const leadRef = useRef<HTMLDivElement>(null)
  const [statsTriggered, setStatsTriggered] = useState(false)
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    service: '',
    message: '',
  })

  useGSAP(
    () => {
      // Hero text entrance
      gsap.fromTo(
        heroTextRef.current,
        { x: -80, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, ease: 'power3.out', delay: 0.2 }
      )
      gsap.fromTo(
        taglineRef.current,
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.5 }
      )
      gsap.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.8 }
      )

      // Services cards stagger
      if (servicesRef.current) {
        const cards = servicesRef.current.querySelectorAll('.service-card')
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: servicesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Stats section
      if (statsRef.current) {
        ScrollTrigger.create({
          trigger: statsRef.current,
          start: 'top 75%',
          onEnter: () => setStatsTriggered(true),
        })

        const statItems = statsRef.current.querySelectorAll('.stat-item')
        gsap.fromTo(
          statItems,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Lead capture section
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
    // Form submission placeholder
    alert(`Thank you, ${formState.name}! We'll contact you within 2 hours.`)
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#080808] text-[#f5f5f0] font-sans"
    >
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg, transparent, transparent 40px, #c9a84c 40px, #c9a84c 41px
            ), repeating-linear-gradient(
              90deg, transparent, transparent 40px, #c9a84c 40px, #c9a84c 41px
            )`,
          }}
        />

        {/* Gold top border */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 py-24">
          {/* Left: copy */}
          <div className="flex-1 lg:max-w-[560px] z-10">
            <div ref={heroTextRef}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[2px] w-12 bg-[#c9a84c]" />
                <span
                  className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase font-medium"
                  style={{ fontFamily: 'var(--font-mono, monospace)' }}
                >
                  Design Direction A
                </span>
              </div>

              <h1
                className="text-[clamp(3.5rem,8vw,7rem)] font-black leading-none tracking-tight uppercase mb-4"
                style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}
              >
                <span className="block text-[#f5f5f0]">BUILT</span>
                <span className="block text-[#c9a84c]">STRONGER.</span>
                <span className="block text-[#f5f5f0]">FINISHED</span>
                <span className="block text-[#c9a84c]">FLAWLESS.</span>
              </h1>
            </div>

            <p
              ref={taglineRef}
              className="text-[#a0a0a0] text-lg leading-relaxed mb-10 max-w-[440px]"
            >
              Uvita Body Shop restores your vehicle to factory-perfect condition.
              Premium collision repair, expert paint matching, and precision
              frame work — backed by 20+ years of craftsmanship.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#estimate"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#c9a84c] text-[#080808] font-bold text-sm tracking-[0.15em] uppercase hover:bg-[#e4c06e] transition-colors duration-200"
              >
                Get Free Estimate
              </a>
              <a
                href="tel:+50612345678"
                className="inline-flex items-center justify-center px-8 py-4 border border-[#333] text-[#f5f5f0] font-medium text-sm tracking-wide hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors duration-200"
              >
                Call Now
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 pt-8 border-t border-[#1e1e1e]">
              {['Lifetime Warranty', 'Premium Materials', 'Free Estimates'].map(
                (badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-2 text-xs text-[#888] uppercase tracking-wider"
                  >
                    <div className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full" />
                    {badge}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right: WebGL */}
          <div className="flex-1 lg:flex-[1.1] h-[420px] lg:h-[640px] w-full relative">
            <MetallicScene />
            {/* Radial glow behind scene */}
            <div className="absolute inset-0 pointer-events-none" style={{
              background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(201,168,76,0.06) 0%, transparent 70%)'
            }} />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-gradient-to-b from-[#c9a84c] to-transparent animate-pulse" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#888]">Scroll</span>
        </div>
      </section>

      {/* ─── SERVICES ─────────────────────────────────────────── */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">
                What We Do
              </span>
            </div>
            <h2
              className="text-[clamp(2.5rem,5vw,4.5rem)] font-black uppercase tracking-tight text-[#f5f5f0]"
              style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}
            >
              Full-Service
              <br />
              <span className="text-[#c9a84c]">Auto Body Repair</span>
            </h2>
          </div>

          <div
            ref={servicesRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]"
          >
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="service-card bg-[#0d0d0d] p-8 group hover:bg-[#111] transition-colors duration-300 cursor-default"
              >
                <div className="w-10 h-10 border border-[#c9a84c] flex items-center justify-center mb-6 group-hover:bg-[#c9a84c] transition-colors duration-300">
                  <span className="text-[#c9a84c] group-hover:text-[#080808] text-lg transition-colors">
                    ✦
                  </span>
                </div>
                <h3 className="text-[#f5f5f0] font-bold text-lg mb-3 uppercase tracking-wide">
                  {service.title}
                </h3>
                <p className="text-[#666] text-sm leading-relaxed">
                  {service.description}
                </p>
                <div className="mt-6 h-[1px] w-0 bg-[#c9a84c] group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STATS ────────────────────────────────────────────── */}
      <section
        ref={statsRef}
        className="py-24 relative overflow-hidden"
      >
        {/* Dark grid backdrop */}
        <div className="absolute inset-0 bg-[#080808]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #c9a84c 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#1e1e1e]">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="stat-item px-0 lg:px-12 py-8 lg:py-0 text-center lg:text-left"
              >
                <div
                  className="text-[clamp(3rem,6vw,5rem)] font-black leading-none text-[#c9a84c] tabular-nums"
                  style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}
                >
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    trigger={statsTriggered}
                  />
                </div>
                <div className="text-[#888] text-xs uppercase tracking-[0.2em] mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ──────────────────────────────────────────── */}
      <section className="py-24 bg-[#0d0d0d]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">
                How It Works
              </span>
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-black uppercase tracking-tight text-[#f5f5f0]"
              style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}
            >
              Simple Process,
              <br />
              <span className="text-[#c9a84c]">Zero Hassle</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Contact Us', desc: 'Call or submit online for a free, no-obligation estimate.' },
              { step: '02', title: 'Drop Off', desc: 'Bring your vehicle in. We assess the damage and walk you through the repair plan.' },
              { step: '03', title: 'We Repair', desc: 'Precision work by certified technicians. Regular updates throughout.' },
              { step: '04', title: 'Drive Away', desc: 'Inspected, detailed, and ready. Usually within 48 hours.' },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                {i < 3 && (
                  <div className="hidden md:block absolute top-4 left-full w-full h-px bg-gradient-to-r from-[#c9a84c] to-transparent z-10 opacity-30" />
                )}
                <div className="text-[#1e1e1e] text-[5rem] font-black leading-none select-none"
                  style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}>
                  {item.step}
                </div>
                <h3 className="text-[#f5f5f0] font-bold text-base uppercase tracking-wide -mt-4 mb-3">
                  {item.title}
                </h3>
                <p className="text-[#666] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEAD CAPTURE ─────────────────────────────────────── */}
      <section id="estimate" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#080808]" />
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent" />

        <div
          ref={leadRef}
          className="relative max-w-[800px] mx-auto px-6 lg:px-12"
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-[2px] w-8 bg-[#c9a84c]" />
              <span className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase">
                Free Consultation
              </span>
              <div className="h-[2px] w-8 bg-[#c9a84c]" />
            </div>
            <h2
              className="text-[clamp(2rem,5vw,4rem)] font-black uppercase tracking-tight text-[#f5f5f0] mb-4"
              style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}
            >
              Get Your Free
              <br />
              <span className="text-[#c9a84c]">Estimate Today</span>
            </h2>
            <p className="text-[#666] text-base max-w-md mx-auto">
              Response within 2 business hours. No commitment required.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border border-[#1e1e1e] p-8 lg:p-12 bg-[#0d0d0d]"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#888] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  className="w-full bg-[#111] border border-[#222] text-[#f5f5f0] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors placeholder-[#333]"
                  placeholder="John Smith"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.2em] uppercase text-[#888] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formState.phone}
                  onChange={(e) =>
                    setFormState({ ...formState, phone: e.target.value })
                  }
                  className="w-full bg-[#111] border border-[#222] text-[#f5f5f0] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors placeholder-[#333]"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#888] mb-2">
                Service Needed
              </label>
              <select
                value={formState.service}
                onChange={(e) =>
                  setFormState({ ...formState, service: e.target.value })
                }
                className="w-full bg-[#111] border border-[#222] text-[#f5f5f0] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors appearance-none"
              >
                <option value="" className="bg-[#111]">
                  Select a service...
                </option>
                {SERVICES.map((s) => (
                  <option key={s.title} value={s.title} className="bg-[#111]">
                    {s.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-[10px] tracking-[0.2em] uppercase text-[#888] mb-2">
                Tell Us What Happened
              </label>
              <textarea
                rows={4}
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                className="w-full bg-[#111] border border-[#222] text-[#f5f5f0] px-4 py-3 text-sm focus:outline-none focus:border-[#c9a84c] transition-colors resize-none placeholder-[#333]"
                placeholder="Briefly describe the damage or service needed..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#c9a84c] text-[#080808] font-bold text-sm tracking-[0.2em] uppercase hover:bg-[#e4c06e] active:bg-[#b8963e] transition-colors duration-200"
            >
              Send My Free Estimate Request →
            </button>

            <p className="text-center text-[#444] text-xs mt-4">
              We never share your information. Privacy guaranteed.
            </p>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-12 border-t border-[#111]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div
              className="text-xl font-black uppercase tracking-widest text-[#f5f5f0]"
              style={{ fontFamily: 'Impact, "Arial Narrow", sans-serif' }}
            >
              UVITA <span className="text-[#c9a84c]">BODY SHOP</span>
            </div>
            <div className="text-[#444] text-xs mt-1">
              Premium Auto Body Repair — Costa Rica
            </div>
          </div>
          <div className="text-[#333] text-xs">
            © {new Date().getFullYear()} Uvita Body Shop. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
