'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'

const CarPaintScene = dynamic(() => import('@/components/3d/CarPaintScene'), {
  ssr: false,
  loading: () => null,
})

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const services = [
  {
    number: '01',
    title: 'Collision Repair',
    description:
      'From minor fender benders to major structural damage. We restore your vehicle to factory specifications.',
    image: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=800&q=80',
    alt: 'Mechanic inspecting vehicle damage in body shop',
  },
  {
    number: '02',
    title: 'Paint Restoration',
    description:
      'Perfect color matching and flawless multi-stage application — primer, base coat, color coat, clear coat.',
    image: 'https://images.unsplash.com/photo-1632605166776-7128669886e7?auto=format&fit=crop&w=800&q=80',
    alt: 'Technician applying paint correction to vehicle surface',
  },
  {
    number: '03',
    title: 'Paintless Dent Removal',
    description:
      'Advanced PDR techniques eliminate dents and dings without disturbing your original paint finish.',
    image: 'https://images.unsplash.com/photo-1712129009070-97da6756d55b?auto=format&fit=crop&w=800&q=80',
    alt: 'Close-up of car body panel being restored',
  },
  {
    number: '04',
    title: 'Custom Paint',
    description:
      'Custom colors, metallic finishes, pearl coats, and specialty effects. Your vision, our execution.',
    image: 'https://images.unsplash.com/photo-1567969668188-1ef908411682?auto=format&fit=crop&w=800&q=80',
    alt: 'Gleaming custom metallic paint finish on vehicle',
  },
  {
    number: '05',
    title: 'Frame Straightening',
    description:
      'Computer-assisted measurement and hydraulic correction for full structural integrity.',
    image: 'https://images.unsplash.com/photo-1596986952526-3be237187071?auto=format&fit=crop&w=800&q=80',
    alt: 'Vehicle undergoing structural repair in workshop',
  },
  {
    number: '06',
    title: 'Detail & Protection',
    description:
      'Ceramic coating, paint protection film, and professional detailing to preserve your finish.',
    image: 'https://images.unsplash.com/photo-1632823469850-2f77dd9c7f93?auto=format&fit=crop&w=800&q=80',
    alt: 'Professional detailing and waxing a vehicle hood',
  },
]

const vehicleBrands = [
  {
    name: 'Toyota Hilux',
    image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80',
    alt: 'White Toyota Hilux pickup truck',
  },
  {
    name: '4Runner',
    image: 'https://images.unsplash.com/photo-1519335897396-bd5f8307d996?auto=format&fit=crop&w=600&q=80',
    alt: 'Toyota 4Runner SUV off-road',
  },
  {
    name: 'Toyota Prado',
    image: 'https://images.unsplash.com/photo-1547245324-d777c6f05e80?auto=format&fit=crop&w=600&q=80',
    alt: 'White Toyota Land Cruiser Prado',
  },
  {
    name: 'Chevrolet',
    image: 'https://images.unsplash.com/photo-1611195757700-168f73dcfc9d?auto=format&fit=crop&w=600&q=80',
    alt: 'Chevrolet vehicle',
  },
  {
    name: 'Isuzu',
    image: 'https://images.unsplash.com/photo-1641333326784-24a9c21d3c4e?auto=format&fit=crop&w=600&q=80',
    alt: 'Black pickup truck on dirt road',
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Inspect',
    description:
      'Thorough damage assessment. We document everything and provide a transparent estimate.',
  },
  {
    number: '02',
    title: 'Repair',
    description:
      'Structural and body work with factory-grade materials, welding, and precision tooling.',
  },
  {
    number: '03',
    title: 'Paint',
    description:
      'Multi-layer application in our controlled spray booth. Dust-free, perfect color match.',
  },
  {
    number: '04',
    title: 'Perfect',
    description:
      "Wet sanding, buffing, and final quality check. We don't release until it's flawless.",
  },
]

const marqueeItems = [
  'Collision Repair',
  'Paint Restoration',
  'Dent Removal',
  'Custom Finishes',
  'Frame Work',
  'Detailing',
]

/* ------------------------------------------------------------------ */
/*  CountUp — animated number on scroll into view                      */
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

  return (
    <span ref={ref}>
      0{suffix}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  HomePage                                                           */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      // Hero entrance
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-label', { opacity: 0, y: 20, duration: 0.6, delay: 0.3 })
        .from('.hero-line', { opacity: 0, y: 60, duration: 0.8, stagger: 0.12 }, '-=0.3')
        .from('.hero-sub', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from('.hero-cta', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.3')
        .from('.hero-scroll', { opacity: 0, duration: 1 }, '-=0.2')

      // Service cards — staggered reveal with scale (CSS sets initial state)
      gsap.to('.svc-card', {
        scrollTrigger: { trigger: '.svc-grid', start: 'top 85%' },
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      })

      // Service card image parallax on scroll
      gsap.utils.toArray<HTMLElement>('.svc-card-img').forEach((img) => {
        gsap.fromTo(
          img,
          { y: -20 },
          {
            y: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.svc-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })

      // Vehicle brand cards (CSS sets initial state)
      gsap.to('.brand-card', {
        scrollTrigger: { trigger: '.brand-grid', start: 'top 85%' },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out',
      })

      // Section reveals (CSS sets initial state)
      gsap.utils.toArray<HTMLElement>('.s-reveal').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        })
      })

      // Process steps (CSS sets initial state)
      gsap.to('.proc-step', {
        scrollTrigger: { trigger: '.proc-grid', start: 'top 80%' },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })

      // CTA section (CSS sets initial state)
      gsap.to('.cta-reveal', {
        scrollTrigger: { trigger: '.cta-section', start: 'top 80%' },
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
    <div ref={containerRef}>
      {/* ===== HERO ===== */}
      <section className="relative h-screen overflow-hidden bg-background">
        {/* WebGL car paint panel — the hero visual */}
        <div className="absolute inset-0" aria-hidden="true">
          <CarPaintScene />
        </div>

        {/* Gradient scrims for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-2xl">
            <p className="hero-label font-mono text-xs tracking-[0.25em] uppercase text-zinc-500 mb-8">
              Uvita Body Shop &mdash; Puntarenas, Costa Rica
            </p>

            <h1 className="font-display text-[clamp(3.5rem,10vw,8rem)] leading-[0.9] tracking-tight uppercase">
              <span className="hero-line block">Precision</span>
              <span className="hero-line block">Paint.</span>
              <span className="hero-line block text-accent">Flawless</span>
              <span className="hero-line block">Finish.</span>
            </h1>

            <p className="hero-sub text-base sm:text-lg text-zinc-400 mt-8 max-w-md leading-relaxed">
              Expert collision repair, paint restoration, and custom finishes.
              Every vehicle leaves our booth looking factory-new&nbsp;&mdash; or
              better.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <a
                href="#contact"
                className="hero-cta inline-flex px-8 py-4 bg-accent text-white text-sm font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors duration-300"
              >
                Get Your Estimate
              </a>
              <a
                href="#services"
                className="hero-cta inline-flex px-8 py-4 border border-zinc-700 text-zinc-300 text-sm font-medium tracking-wide uppercase hover:border-zinc-400 hover:text-white transition-all duration-300"
              >
                View Services
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600">
            Scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ===== SCROLLING MARQUEE ===== */}
      <div className="border-y border-zinc-800/50 py-5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {marqueeItems.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-4 px-4 font-mono text-sm tracking-[0.15em] uppercase text-zinc-500"
                >
                  <span>{item}</span>
                  <span className="text-accent" aria-hidden="true">
                    &#x2022;
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ===== SERVICES ===== */}
      <section id="services" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="s-reveal gsap-reveal mb-16">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              What We Do
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] uppercase">
              Services Built on
              <br />
              Precision &amp; Experience
            </h2>
          </div>

          <div className="svc-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s) => (
              <div
                key={s.number}
                className="svc-card gsap-reveal-scale group relative overflow-hidden border border-zinc-800/50 bg-zinc-950 hover:border-accent/30 transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="svc-card-img object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  {/* Number badge */}
                  <span className="absolute top-4 left-4 font-mono text-xs text-accent/80 tracking-wider bg-zinc-950/60 backdrop-blur-sm px-2 py-1">
                    {s.number}
                  </span>
                </div>
                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl sm:text-2xl uppercase mb-2 group-hover:text-accent transition-colors duration-300">
                    {s.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VEHICLES WE SERVICE ===== */}
      <section className="py-20 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="s-reveal gsap-reveal mb-12">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              Trusted by Drivers Across Costa Rica
            </p>
            <h2 className="font-display text-[clamp(1.5rem,4vw,3rem)] leading-[0.95] uppercase">
              Vehicles We Know Inside&nbsp;&amp;&nbsp;Out
            </h2>
          </div>

          <div className="brand-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {vehicleBrands.map((brand) => (
              <div
                key={brand.name}
                className="brand-card gsap-reveal group relative overflow-hidden aspect-[4/3] border border-zinc-800/50 bg-zinc-950"
              >
                <Image
                  src={brand.image}
                  alt={brand.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <span className="font-display text-sm sm:text-base uppercase tracking-wider">
                    {brand.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-20 border-y border-zinc-800/50">
        <div className="max-w-6xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8 text-center">
            <div className="s-reveal gsap-reveal">
              <div className="font-display text-6xl sm:text-7xl text-accent">
                <CountUp target={15} suffix="+" />
              </div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 mt-3">
                Years Experience
              </p>
            </div>
            <div className="s-reveal gsap-reveal">
              <div className="font-display text-6xl sm:text-7xl">
                <CountUp target={3000} suffix="+" />
              </div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 mt-3">
                Cars Restored
              </p>
            </div>
            <div className="s-reveal gsap-reveal">
              <div className="font-display text-6xl sm:text-7xl">
                <CountUp target={100} suffix="%" />
              </div>
              <p className="font-mono text-xs tracking-[0.2em] uppercase text-zinc-500 mt-3">
                Satisfaction Rate
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="s-reveal gsap-reveal mb-16">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              How We Work
            </p>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.95] uppercase">
              From Damage
              <br />
              to Perfection
            </h2>
          </div>

          <div className="proc-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((step) => (
              <div key={step.number} className="proc-step gsap-reveal p-6 border border-zinc-800/50 bg-zinc-950">
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-mono text-xs text-accent tracking-wider">
                    {step.number}
                  </span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>
                <h3 className="font-display text-3xl uppercase mb-3">{step.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA / CONTACT ===== */}
      <section
        id="contact"
        className="cta-section py-24 sm:py-32 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/50"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: CTA */}
          <div className="cta-reveal gsap-reveal">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              Get Started
            </p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] uppercase mb-6">
              Ready to Restore
              <br />
              Your Vehicle?
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-8 max-w-md">
              Get a free estimate. Call, WhatsApp, or fill out the form. We
              respond within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="https://wa.me/50688888888"
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
                href="tel:+50622222222"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 border border-zinc-700 text-zinc-300 text-sm font-medium tracking-wide hover:border-zinc-400 hover:text-white transition-all"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Us
              </a>
            </div>

            <div className="font-mono text-xs text-zinc-600 space-y-1">
              <p>Uvita, Puntarenas, Costa Rica</p>
              <p>Mon&ndash;Sat 7:00 AM &ndash; 5:00 PM</p>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="cta-reveal gsap-reveal">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label
                  htmlFor="name"
                  className="block font-mono text-xs tracking-[0.15em] uppercase text-zinc-500 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm placeholder:text-zinc-600 focus:border-accent focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block font-mono text-xs tracking-[0.15em] uppercase text-zinc-500 mb-2"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm placeholder:text-zinc-600 focus:border-accent focus:outline-none transition-colors"
                  placeholder="+506 8888 8888"
                />
              </div>
              <div>
                <label
                  htmlFor="service"
                  className="block font-mono text-xs tracking-[0.15em] uppercase text-zinc-500 mb-2"
                >
                  Service Needed
                </label>
                <select
                  id="service"
                  name="service"
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="">Select a service</option>
                  <option value="collision">Collision Repair</option>
                  <option value="paint">Paint Restoration</option>
                  <option value="dent">Paintless Dent Removal</option>
                  <option value="custom">Custom Paint</option>
                  <option value="frame">Frame Straightening</option>
                  <option value="detail">Detail &amp; Protection</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block font-mono text-xs tracking-[0.15em] uppercase text-zinc-500 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-foreground text-sm placeholder:text-zinc-600 focus:border-accent focus:outline-none transition-colors resize-none"
                  placeholder="Describe the work you need..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-accent text-white text-sm font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors duration-300"
              >
                Send Request
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-8 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-display text-xl uppercase tracking-wider">
            Uvita Body Shop
          </span>
          <span className="font-mono text-xs text-zinc-600">
            &copy; 2026 Uvita Body Shop. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}
