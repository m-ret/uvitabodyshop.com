'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Playfair_Display, DM_Sans } from 'next/font/google'

const TropicalScene = dynamic(
  () => import('@/components/3d/TropicalScene').then((m) => m.TropicalScene),
  { ssr: false }
)

gsap.registerPlugin(ScrollTrigger)

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
  weight: ['300', '400', '500', '600'],
})

const SERVICES = [
  {
    title: 'Collision Repair',
    description:
      'Full structural restoration after any impact. OEM-spec repairs backed by our certified local team.',
    emoji: '🛡️',
  },
  {
    title: 'Paint Restoration',
    description:
      'Factory-matched finishes using premium materials. Your car leaves looking brand new every time.',
    emoji: '🎨',
  },
  {
    title: 'Frame Straightening',
    description:
      'Computerized laser measurement systems realign frames to exact manufacturer specifications.',
    emoji: '⚙️',
  },
  {
    title: 'Dent Removal',
    description:
      'Paintless and traditional dent removal for every panel, curve, and crease on your vehicle.',
    emoji: '✨',
  },
  {
    title: 'Auto Detailing',
    description:
      'Deep-clean interior and exterior packages that restore your vehicle to day-one condition.',
    emoji: '🌿',
  },
  {
    title: 'Insurance Claims',
    description:
      "Direct-to-insurer billing. We handle the paperwork — you just hand us the keys.",
    emoji: '📋',
  },
]

const STATS = [
  { value: 500, suffix: '+', label: 'Happy Customers' },
  { value: 20, suffix: '+', label: 'Years in Uvita' },
  { value: 98, suffix: '%', label: 'Satisfaction Rate' },
  { value: 48, suffix: 'h', label: 'Avg Turnaround' },
]

const TESTIMONIALS = [
  {
    name: 'Carlos M.',
    location: 'Uvita',
    text: 'Excelente trabajo. My truck looked better than when I bought it. Fast, friendly, and honest pricing. These guys are the real deal.',
    rating: 5,
  },
  {
    name: 'Sarah K.',
    location: 'Dominical',
    text: "Had a fender bender on the coastal highway. They handled everything with my insurance and the repair was perfect. Couldn't be happier!",
    rating: 5,
  },
  {
    name: 'Roberto A.',
    location: 'Ojochal',
    text: "Third time coming here. Always consistent, always quality. They're part of our community and it shows in how they treat every customer.",
    rating: 5,
  },
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

function WaveDivider({
  fromColor,
  toColor,
  flip = false,
}: {
  fromColor: string
  toColor: string
  flip?: boolean
}) {
  return (
    <div style={{ background: fromColor, lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        style={{ display: 'block', width: '100%', height: '56px' }}
        className={flip ? 'scale-y-[-1]' : ''}
      >
        <path
          d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z"
          fill={toColor}
        />
      </svg>
    </div>
  )
}

export function TropicalLocalPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const heroSceneRef = useRef<HTMLDivElement>(null)
  const heroCtaRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const testimonialsRef = useRef<HTMLDivElement>(null)
  const processRef = useRef<HTMLDivElement>(null)
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
      // Hero entrance — organic, staggered
      if (heroTextRef.current) {
        gsap.fromTo(
          heroTextRef.current.querySelectorAll('.hero-line'),
          { y: 45, opacity: 0, rotate: 1.5 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1.1,
            stagger: 0.15,
            ease: 'expo.out',
          }
        )
        gsap.fromTo(
          heroTextRef.current.querySelector('.hero-body'),
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.6 }
        )
      }

      if (heroCtaRef.current) {
        gsap.fromTo(
          heroCtaRef.current,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out', delay: 1.0 }
        )
      }

      if (heroSceneRef.current) {
        gsap.fromTo(
          heroSceneRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out', delay: 0.25 }
        )
      }

      // Services cards — wave stagger
      if (servicesRef.current) {
        gsap.fromTo(
          servicesRef.current.querySelectorAll('.service-card'),
          { y: 60, opacity: 0, rotate: 1 },
          {
            y: 0,
            opacity: 1,
            rotate: 0,
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

      // Stats count-up trigger
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
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Testimonials — slide in from right
      if (testimonialsRef.current) {
        gsap.fromTo(
          testimonialsRef.current.querySelectorAll('.testimonial-card'),
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: testimonialsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Process steps
      if (processRef.current) {
        gsap.fromTo(
          processRef.current.querySelectorAll('.process-step'),
          { y: 35, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.15,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: processRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        )
      }

      // Lead capture form
      if (leadRef.current) {
        gsap.fromTo(
          leadRef.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
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
    fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
  }
  const bodyStyle = {
    fontFamily: 'var(--font-dm, "DM Sans", system-ui, sans-serif)',
  }

  return (
    <div
      ref={containerRef}
      className={`${playfair.variable} ${dmSans.variable} min-h-screen bg-[#FEFAE0] text-[#1B2F23]`}
      style={bodyStyle}
    >
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Warm organic background */}
        <div className="absolute inset-0 bg-[#FEFAE0]" />
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 85% 50%, #D8F3DC 0%, transparent 65%), radial-gradient(ellipse 45% 40% at 15% 70%, #fff8e0 0%, transparent 55%)',
          }}
        />
        {/* Organic glow blobs */}
        <div
          className="absolute right-0 top-1/4 w-[480px] h-[480px] rounded-full opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #40916C, transparent)',
            filter: 'blur(70px)',
          }}
        />
        <div
          className="absolute -left-20 bottom-1/4 w-[300px] h-[300px] rounded-full opacity-12 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #F4A261, transparent)',
            filter: 'blur(50px)',
          }}
        />

        <div className="relative w-full max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-12 py-24">
          {/* Left: headline + CTA */}
          <div ref={heroTextRef} className="flex-1 lg:max-w-[560px] z-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-[#F4A261]" />
              <span
                className="text-[#40916C] text-xs tracking-[0.25em] uppercase font-semibold"
                style={bodyStyle}
              >
                Design Direction C
              </span>
            </div>

            <h1
              className="text-[clamp(3rem,7vw,6rem)] font-bold leading-[1.08] text-[#1B2F23] mb-6"
              style={displayStyle}
            >
              <span className="hero-line block">Your Trusted</span>
              <span className="hero-line block text-[#2D6A4F]">Auto Body</span>
              <span className="hero-line block">
                Shop in{' '}
                <em className="text-[#F4A261] not-italic" style={displayStyle}>
                  Uvita.
                </em>
              </span>
            </h1>

            <p
              className="hero-body text-[#4a6b5a] text-lg leading-[1.8] mb-10 max-w-[440px]"
              style={bodyStyle}
            >
              Family-owned and community-rooted. We&apos;ve been restoring
              vehicles along Costa Rica&apos;s Southern Pacific coast for over
              20 years — one perfect finish at a time.
            </p>

            <div ref={heroCtaRef} className="flex flex-col sm:flex-row gap-4">
              <a
                href="#estimate"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#2D6A4F] text-white font-semibold text-sm tracking-wide rounded-full hover:bg-[#40916C] transition-colors duration-300"
                style={bodyStyle}
              >
                Get Free Estimate
              </a>
              <a
                href="tel:+50612345678"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#2D6A4F] text-[#2D6A4F] font-semibold text-sm rounded-full hover:bg-[#D8F3DC] transition-colors duration-300"
                style={bodyStyle}
              >
                Call Us Now
              </a>
            </div>

            {/* Local trust badges */}
            <div
              className="flex flex-wrap items-center gap-5 mt-10 pt-8"
              style={{ borderTop: '1px solid rgba(45,106,79,0.15)' }}
            >
              {['Licensed & Insured', 'OEM Certified', 'Free Estimates'].map(
                (badge) => (
                  <div
                    key={badge}
                    className="flex items-center gap-2 text-xs text-[#4a6b5a]"
                    style={bodyStyle}
                  >
                    <div className="w-4 h-4 rounded-full bg-[#D8F3DC] flex items-center justify-center flex-shrink-0">
                      <span className="text-[#2D6A4F] text-[8px] font-bold">
                        ✓
                      </span>
                    </div>
                    {badge}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right: WebGL tropical scene */}
          <div
            ref={heroSceneRef}
            className="flex-1 h-[400px] lg:h-[600px] w-full"
          >
            <TropicalScene />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span
            className="text-[10px] tracking-[0.3em] uppercase text-[#2D6A4F]"
            style={bodyStyle}
          >
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-[#2D6A4F] to-transparent animate-pulse" />
        </div>
      </section>

      {/* Wave: cream → light-green */}
      <WaveDivider fromColor="#FEFAE0" toColor="#D8F3DC" />

      {/* ─── SERVICES ─────────────────────────────────────────── */}
      <section className="py-20 bg-[#D8F3DC]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#2D6A4F]" />
              <span
                className="text-[#2D6A4F] text-xs tracking-[0.3em] uppercase font-semibold"
                style={bodyStyle}
              >
                What We Do
              </span>
              <div className="w-8 h-px bg-[#2D6A4F]" />
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#1B2F23] leading-tight mb-4"
              style={displayStyle}
            >
              Full-Service{' '}
              <span className="text-[#2D6A4F]">Auto Body Repair</span>
            </h2>
            <p
              className="text-[#4a6b5a] text-base max-w-[480px] mx-auto"
              style={bodyStyle}
            >
              From minor dents to major collision damage — we handle it all with
              the care your vehicle deserves.
            </p>
          </div>

          <div
            ref={servicesRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="service-card bg-white rounded-2xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D8F3DC] flex items-center justify-center mb-5 text-2xl">
                  {service.emoji}
                </div>
                <h3
                  className="text-[#1B2F23] font-semibold text-lg mb-3 leading-tight"
                  style={displayStyle}
                >
                  {service.title}
                </h3>
                <p
                  className="text-[#6a8a7a] text-sm leading-[1.7]"
                  style={bodyStyle}
                >
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: light-green → deep-green */}
      <WaveDivider fromColor="#D8F3DC" toColor="#2D6A4F" />

      {/* ─── STATS ────────────────────────────────────────────── */}
      <section ref={statsRef} className="py-24 bg-[#2D6A4F]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/15">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="stat-item px-0 lg:px-12 py-8 lg:py-0 text-center"
              >
                <div
                  className="text-[clamp(3rem,6vw,5rem)] font-bold leading-none text-[#E9C46A] tabular-nums"
                  style={displayStyle}
                >
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                    trigger={statsTriggered}
                  />
                </div>
                <div
                  className="text-white/70 text-sm font-medium mt-3"
                  style={bodyStyle}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: deep-green → cream */}
      <WaveDivider fromColor="#2D6A4F" toColor="#FEFAE0" />

      {/* ─── TESTIMONIALS ─────────────────────────────────────── */}
      <section className="py-20 bg-[#FEFAE0]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#F4A261]" />
              <span
                className="text-[#7C5C40] text-xs tracking-[0.3em] uppercase font-semibold"
                style={bodyStyle}
              >
                What People Say
              </span>
              <div className="w-8 h-px bg-[#F4A261]" />
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#1B2F23] leading-tight"
              style={displayStyle}
            >
              Loved by Our{' '}
              <em className="text-[#F4A261]" style={displayStyle}>
                Community
              </em>
            </h2>
          </div>

          <div
            ref={testimonialsRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {TESTIMONIALS.map((testimonial) => (
              <div
                key={testimonial.name}
                className="testimonial-card bg-white rounded-2xl p-8 shadow-sm"
                style={{ border: '1px solid rgba(45,106,79,0.08)' }}
              >
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-[#E9C46A] text-lg">
                      ★
                    </span>
                  ))}
                </div>
                <p
                  className="text-[#3a5a48] text-base leading-[1.8] mb-6"
                  style={{ ...displayStyle, fontStyle: 'italic' }}
                >
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D8F3DC] flex items-center justify-center flex-shrink-0">
                    <span
                      className="text-[#2D6A4F] font-bold text-sm"
                      style={displayStyle}
                    >
                      {testimonial.name[0]}
                    </span>
                  </div>
                  <div>
                    <div
                      className="text-[#1B2F23] font-semibold text-sm"
                      style={bodyStyle}
                    >
                      {testimonial.name}
                    </div>
                    <div
                      className="text-[#6a8a7a] text-xs"
                      style={bodyStyle}
                    >
                      {testimonial.location}, Costa Rica
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave: cream → warm-white */}
      <WaveDivider fromColor="#FEFAE0" toColor="#F5F0E8" />

      {/* ─── PROCESS ──────────────────────────────────────────── */}
      <section className="py-20 bg-[#F5F0E8]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#2D6A4F]" />
              <span
                className="text-[#2D6A4F] text-xs tracking-[0.3em] uppercase font-semibold"
                style={bodyStyle}
              >
                How It Works
              </span>
              <div className="w-8 h-px bg-[#2D6A4F]" />
            </div>
            <h2
              className="text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#1B2F23] leading-tight"
              style={displayStyle}
            >
              Simple, Friendly{' '}
              <span className="text-[#2D6A4F]">Process</span>
            </h2>
          </div>

          <div
            ref={processRef}
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Reach Out',
                desc: 'Call, WhatsApp, or submit online for a free no-obligation estimate.',
                icon: '📞',
              },
              {
                step: '02',
                title: 'Drop Off',
                desc: 'Bring your vehicle in. We handle all the insurance paperwork for you.',
                icon: '🚗',
              },
              {
                step: '03',
                title: 'We Repair',
                desc: 'Our certified team works with care and keeps you updated throughout.',
                icon: '🔧',
              },
              {
                step: '04',
                title: 'Drive Happy',
                desc: 'Your vehicle, inspected and detailed — ready in as little as 48 hours.',
                icon: '🌟',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="process-step text-center relative"
              >
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 left-[65%] w-[calc(100%-10px)] h-px bg-gradient-to-r from-[#2D6A4F]/25 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-full bg-white border-2 border-[#D8F3DC] flex items-center justify-center mx-auto mb-5 text-2xl shadow-sm">
                  {item.icon}
                </div>
                <div
                  className="text-[#2D6A4F] font-bold text-xs tracking-[0.2em] mb-2"
                  style={bodyStyle}
                >
                  {item.step}
                </div>
                <h3
                  className="text-[#1B2F23] font-semibold text-lg mb-3"
                  style={displayStyle}
                >
                  {item.title}
                </h3>
                <p
                  className="text-[#6a8a7a] text-sm leading-[1.7]"
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
      <section
        id="estimate"
        className="py-24 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #1B2F23 0%, #2D6A4F 55%, #40916C 100%)',
        }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #E9C46A 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Golden top accent */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#E9C46A] to-transparent" />

        <div
          ref={leadRef}
          className="relative max-w-[800px] mx-auto px-6 lg:px-12"
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#E9C46A]" />
              <span
                className="text-[#E9C46A] text-xs tracking-[0.3em] uppercase font-semibold"
                style={bodyStyle}
              >
                Free Consultation
              </span>
              <div className="w-8 h-px bg-[#E9C46A]" />
            </div>
            <h2
              className="text-[clamp(2rem,5vw,4rem)] font-bold text-white leading-tight mb-4"
              style={displayStyle}
            >
              Let&apos;s Get Your Car
              <br />
              <em className="text-[#E9C46A]" style={displayStyle}>
                Looking New Again.
              </em>
            </h2>
            <p
              className="text-white/70 text-base max-w-md mx-auto"
              style={bodyStyle}
            >
              Response within 2 hours. No commitment required. We&apos;re your
              neighbors — we&apos;ll take care of you.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 lg:p-12 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  className="block text-[11px] tracking-[0.15em] uppercase text-[#4a6b5a] font-semibold mb-2"
                  style={bodyStyle}
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
                  className="w-full text-[#1B2F23] px-4 py-3 text-sm focus:outline-none transition-colors rounded-xl placeholder-[#c0c0be]"
                  style={{
                    border: '1px solid rgba(27,47,35,0.15)',
                    fontFamily:
                      'var(--font-dm, "DM Sans", system-ui, sans-serif)',
                  }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  className="block text-[11px] tracking-[0.15em] uppercase text-[#4a6b5a] font-semibold mb-2"
                  style={bodyStyle}
                >
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formState.phone}
                  onChange={(e) =>
                    setFormState({ ...formState, phone: e.target.value })
                  }
                  className="w-full text-[#1B2F23] px-4 py-3 text-sm focus:outline-none transition-colors rounded-xl placeholder-[#c0c0be]"
                  style={{
                    border: '1px solid rgba(27,47,35,0.15)',
                    fontFamily:
                      'var(--font-dm, "DM Sans", system-ui, sans-serif)',
                  }}
                  placeholder="+506 8888-0000"
                />
              </div>
            </div>

            <div className="mb-6">
              <label
                className="block text-[11px] tracking-[0.15em] uppercase text-[#4a6b5a] font-semibold mb-2"
                style={bodyStyle}
              >
                Service Needed
              </label>
              <select
                value={formState.service}
                onChange={(e) =>
                  setFormState({ ...formState, service: e.target.value })
                }
                className="w-full text-[#1B2F23] px-4 py-3 text-sm focus:outline-none transition-colors appearance-none rounded-xl bg-white"
                style={{
                  border: '1px solid rgba(27,47,35,0.15)',
                  fontFamily:
                    'var(--font-dm, "DM Sans", system-ui, sans-serif)',
                }}
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
                className="block text-[11px] tracking-[0.15em] uppercase text-[#4a6b5a] font-semibold mb-2"
                style={bodyStyle}
              >
                Tell Us What Happened
              </label>
              <textarea
                rows={4}
                value={formState.message}
                onChange={(e) =>
                  setFormState({ ...formState, message: e.target.value })
                }
                className="w-full text-[#1B2F23] px-4 py-3 text-sm focus:outline-none transition-colors resize-none rounded-xl placeholder-[#c0c0be]"
                style={{
                  border: '1px solid rgba(27,47,35,0.15)',
                  fontFamily:
                    'var(--font-dm, "DM Sans", system-ui, sans-serif)',
                }}
                placeholder="Describe the damage or service needed..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#2D6A4F] text-white font-semibold text-sm tracking-[0.1em] uppercase rounded-full hover:bg-[#40916C] active:bg-[#1B4332] transition-colors duration-200"
              style={bodyStyle}
            >
              Send My Free Estimate Request →
            </button>

            <p
              className="text-center text-[#9a9a98] text-xs mt-4"
              style={bodyStyle}
            >
              We never share your information. Privacy guaranteed.
            </p>
          </form>
        </div>
      </section>

      {/* ─── FOOTER ───────────────────────────────────────────── */}
      <footer className="py-12 bg-[#1B2F23] border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div
              className="font-bold text-white text-base tracking-wide"
              style={displayStyle}
            >
              Uvita <span className="text-[#E9C46A]">Body Shop</span>
            </div>
            <div
              className="text-white/30 text-xs mt-1"
              style={bodyStyle}
            >
              Your Local Auto Body Shop — Uvita, Costa Rica
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
