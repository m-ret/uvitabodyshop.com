'use client'

import { useRef, useEffect, type ReactNode } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import Navigation from '@/components/ui/Navigation'
import ReactiveGrid from '@/components/ui/ReactiveGrid'
import SiteFooter from '@/components/ui/SiteFooter'
import OpenNowBadge from '@/components/ui/OpenNowBadge'
import QuoteForm from '@/components/home/QuoteForm'
import TrustBar from '@/components/home/TrustBar'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import TeamGrid from '@/components/sections/TeamGrid'
import { materialBrands } from '@/data/content'
import { business, displayContact } from '@/data/business'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { track } from '@/lib/analytics'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type HomeServiceItem = {
  slug: string
  number: string
  title: string
  subtitle: string
  description: string
  image: string
  alt: string
}

type HomeProcessStep = {
  number: string
  title: string
  description: string
}

type MatTrustItem = { label: string; desc: string }

function HeroCarPoster() {
  return (
    <Image
      src="/car-hero.avif"
      alt=""
      aria-hidden="true"
      fill
      priority
      sizes="100vw"
      className="object-cover object-[72%_center] sm:object-[68%_center] opacity-95"
    />
  )
}

const CarPaintScene = dynamic(() => import('@/components/3d/CarPaintScene'), {
  ssr: false,
  /** Avoid empty black hero while GLB / WebGL boot — matches layout: car on the right. */
  loading: HeroCarPoster,
})

const SprayParticleScene = dynamic(
  () => import('@/components/3d/SprayParticleScene'),
  { ssr: false, loading: () => null }
)

/* ------------------------------------------------------------------ */
/*  HomePage                                                           */
/* ------------------------------------------------------------------ */

export default function HomePage({
  extraJsonLd,
}: { extraJsonLd?: ReactNode } = {}) {
  const locale = useLocale() as 'es' | 'en'
  const contactInfo = displayContact(locale)
  const tHome = useTranslations('Home')
  const tNav = useTranslations('Nav')
  const tStickyWa = useTranslations('StickyWhatsapp')
  const marqueeItems = tHome.raw('marqueeItems') as string[]
  const services = tHome.raw('services') as HomeServiceItem[]
  const processSteps = tHome.raw('processSteps') as HomeProcessStep[]
  const materialTrust = tHome.raw('Materials.trust') as MatTrustItem[]

  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const sceneFallbackFired = useRef(false)

  useEffect(() => {
    if (reducedMotion && !sceneFallbackFired.current) {
      sceneFallbackFired.current = true
      track('scene_fallback', { reason: 'reduced_motion' })
    }
  }, [reducedMotion])

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      /* --- Hero entrance --- */
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.hero-label', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.3,
      })
        .from(
          '.hero-line',
          { opacity: 0, y: 60, duration: 0.8, stagger: 0.12 },
          '-=0.3'
        )
        .from('.hero-sub', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
        .from(
          '.hero-cta',
          { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 },
          '-=0.25'
        )
        .from('.hero-scroll', { opacity: 0, duration: 1 }, '-=0.2')

      /* --- Service sticky cards — parallax on images as they scroll --- */
      gsap.utils.toArray<HTMLElement>('.svc-card-img').forEach((img) => {
        gsap.fromTo(
          img,
          { y: -15 },
          {
            y: 15,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('.svc-sticky-card'),
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        )
      })

      /* --- Massive typography parallax (Craft section) --- */
      gsap.fromTo(
        '.craft-heading',
        { y: 80 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: '.craft-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      )

      gsap.to('.craft-line', {
        scrollTrigger: { trigger: '.craft-section', start: 'top 75%' },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
      })

      /* --- Horizontal slide for craft image --- */
      gsap.fromTo(
        '.craft-image',
        { xPercent: 10, opacity: 0.3 },
        {
          xPercent: 0,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.craft-section',
            start: 'top 80%',
            end: 'center center',
            scrub: 1,
          },
        }
      )

      /* --- Team section reveal (eyebrow/title/lede + staggered cards) --- */
      gsap.to('.team-line', {
        scrollTrigger: { trigger: '.team-section', start: 'top 80%' },
        y: 0,
        opacity: 1,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
      })

      gsap.to('.team-card', {
        scrollTrigger: { trigger: '.team-section', start: 'top 70%' },
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      })

      /* --- Materials brand reveal --- */
      gsap.to('.mat-item', {
        scrollTrigger: { trigger: '.mat-section', start: 'top 80%' },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      })

      /* --- Booth section parallax --- */
      gsap.fromTo(
        '.booth-bg',
        { scale: 1.15 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.booth-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )

      gsap.to('.booth-text', {
        scrollTrigger: { trigger: '.booth-section', start: 'top 70%' },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      })

      /* --- General section reveals --- */
      gsap.utils.toArray<HTMLElement>('.s-reveal').forEach((el) => {
        gsap.to(el, {
          scrollTrigger: { trigger: el, start: 'top 85%' },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
        })
      })

      /* --- Process steps --- */
      gsap.to('.proc-step', {
        scrollTrigger: { trigger: '.proc-grid', start: 'top 80%' },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out',
      })

      /* --- Stats — massive number slide up --- */
      gsap.to('.stat-block', {
        scrollTrigger: { trigger: '.stats-section', start: 'top 80%' },
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
      })

      /* --- Guarantee section --- */
      gsap.to('.guarantee-text', {
        scrollTrigger: { trigger: '.guarantee-section', start: 'top 75%' },
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
      })

      /* --- CTA section --- */
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
      {extraJsonLd}
      <Navigation />

      {/* ===== HERO (fixed — content scrolls over it) ===== */}
      <section className="fixed inset-0 h-screen overflow-hidden bg-background z-0">
        <div className="absolute inset-0" aria-hidden="true">
          {reducedMotion ? (
            <HeroCarPoster />
          ) : (
            <div className="absolute inset-0 h-full w-full [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full">
              <CarPaintScene />
            </div>
          )}
        </div>

        {/* Softer sweep on the left so the red vehicle stays readable on the right (reference layout). */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background from-0% via-background/55 via-40% to-transparent to-78%" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/*
          Do not use justify-center here: it vertically centers the hero stack and
          pulls the H1 under the fixed header. Start below header + safe-area +
          buffer (header ≈ safe + 1rem + logo + py-4; PageLayout uses +5.5rem).
        */}
        <div className="relative z-10 flex h-full min-h-0 flex-col justify-start px-6 pt-[calc(env(safe-area-inset-top,0)+6.75rem)] pb-20 pointer-events-none sm:px-12 sm:pt-[calc(env(safe-area-inset-top,0)+7rem)] lg:px-24 lg:pt-[calc(env(safe-area-inset-top,0)+7.25rem)]">
          {/*
            Headline + sub on the left gradient; primary conversion is WhatsApp + voice call
            only (clustered pair — quote form and services live below the fold).
          */}
          <div className="pointer-events-auto w-full max-w-[1600px] mx-auto">
            <div className="max-w-2xl xl:max-w-3xl">
              <p className="hero-label font-mono text-xs tracking-[0.25em] uppercase text-zinc-500 mb-4 sm:mb-6">
                {tHome('Hero.label')}
              </p>

              <h1 className="font-display text-[clamp(2.25rem,7.25vw,8.75rem)] leading-[0.85] tracking-tight uppercase drop-shadow-[0_2px_20px_rgba(0,0,0,0.8)]">
                <span className="hero-line block">{tHome('Hero.line1')}</span>
                <span className="hero-line block">{tHome('Hero.line2')}</span>
                <span className="hero-line block text-accent drop-shadow-[0_0_30px_rgba(204,0,0,0.4)]">
                  {tHome('Hero.line3')}
                </span>
                <span className="hero-line block">{tHome('Hero.line4')}</span>
              </h1>

              <p className="hero-sub text-base sm:text-lg text-zinc-400 mt-5 sm:mt-6 max-w-md leading-relaxed">
                {tHome('Hero.sub')}
              </p>

              <div
                className="hero-cta-cluster mt-7 sm:mt-9 inline-flex max-w-full flex-nowrap items-stretch gap-0 border border-zinc-800/90 bg-zinc-950/50 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.85)] backdrop-blur-sm"
                role="group"
                aria-label={tHome('Hero.ctaGroupAria')}
              >
                <a
                  href={contactInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={tStickyWa('aria')}
                  onClick={() => track('contact_whatsapp')}
                  className="hero-cta inline-flex min-h-[3.25rem] shrink-0 items-center justify-center gap-2.5 px-5 py-3.5 sm:min-h-[3.5rem] sm:px-7 sm:py-4 bg-[#25D366] text-white text-sm font-semibold tracking-wide hover:bg-[#20BD5A] transition-colors focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {tNav('whatsappCta')}
                </a>
                <div
                  className="w-px shrink-0 self-stretch bg-zinc-800/90"
                  aria-hidden
                />
                <a
                  href={`tel:${contactInfo.phone}`}
                  onClick={() => track('contact_phone')}
                  aria-label={tHome('Hero.phoneLinkAria', {
                    phone: contactInfo.phoneDisplay,
                  })}
                  className="hero-cta inline-flex min-h-[3.25rem] shrink-0 items-center justify-center gap-2.5 px-5 py-3.5 sm:min-h-[3.5rem] sm:px-7 sm:py-4 bg-zinc-950/80 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-zinc-900/95 focus-visible:relative focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-accent"
                    aria-hidden
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span className="whitespace-nowrap tabular-nums tracking-wide">
                    {contactInfo.phoneDisplay}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-scroll hidden sm:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600">
            {tHome('scrollLabel')}
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-zinc-600 to-transparent animate-pulse" />
        </div>
      </section>

      {/* Spacer — pushes content below the fixed hero */}
      <div className="h-screen" aria-hidden="true" />

      {/* Everything below scrolls over the hero */}
      <div className="relative z-10 bg-background">

      {/* ===== SCROLLING MARQUEE ===== */}
      <div className="border-y border-zinc-800/50 py-5 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center shrink-0">
              {marqueeItems.map((item, j) => (
                <div
                  key={`${i}-${j}-${item}`}
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

      {/* ===== TRUST — below marquee (was crowding fixed hero; keeps CTAs above fold) ===== */}
      <section
        id="trust"
        data-section="trust"
        className="border-b border-zinc-800/50 bg-background px-6 py-16 sm:py-20 md:py-24 lg:px-24"
        aria-label={tHome('Trust.eyebrow')}
      >
        <div className="max-w-6xl mx-auto pointer-events-auto flex flex-col items-center">
          <TrustBar />
        </div>
      </section>

      {/* ===== THE CRAFT — massive typographic section ===== */}
      <section className="craft-section relative py-32 sm:py-44 px-6 sm:px-12 lg:px-24 overflow-hidden">
        {/* Background accent line */}
        <div className="absolute top-0 left-12 sm:left-24 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="craft-heading">
            <p className="craft-line gsap-reveal font-mono text-xs tracking-[0.25em] uppercase text-accent mb-6">
              {tHome('Craft.eyebrow')}
            </p>
            <h2 className="craft-line gsap-reveal font-display text-[clamp(3rem,8vw,7rem)] leading-[0.85] uppercase">
              {tHome('Craft.head1a')}
              <br />
              {tHome('Craft.head1b')}
            </h2>
            <h2 className="craft-line gsap-reveal font-display text-[clamp(3rem,8vw,7rem)] leading-[0.85] uppercase text-accent mt-2">
              {tHome('Craft.head2a')}
              <br />
              {tHome('Craft.head2b')}
            </h2>
            <p className="craft-line gsap-reveal text-zinc-400 mt-8 max-w-lg leading-relaxed text-lg">
              {tHome('Craft.body')}
            </p>
          </div>

          <div className="craft-image relative aspect-[4/5] overflow-hidden">
            <Image
              src="/images/fabricio.avif"
              alt={tHome('Craft.imageAlt')}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-400">
                  {tHome('Craft.ownerCaption')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEAM — crew grid (shared with /sobre-nosotros) ===== */}
      <section className="team-section relative py-24 sm:py-32 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/50 overflow-hidden">
        <ReactiveGrid />
        <TeamGrid
          revealClassName="team-line gsap-reveal"
          cardRevealClassName="team-card gsap-reveal"
        />
      </section>

      {/* ===== SERVICES — stacked sticky cards ===== */}
      <section
        id="services"
        className="svc-section pt-24 sm:pt-32 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="s-reveal gsap-reveal mb-20">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              {tHome('Services.eyebrow')}
            </p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] uppercase">
              {tHome('Services.title1')}
              <br />
              {tHome('Services.title2')}
              <br />
              <span className="text-accent">{tHome('Services.titleAccent')}</span>
            </h2>
          </div>

          <div className="svc-stack space-y-6">
            {services.map((s, i) => (
              <div
                key={s.slug}
                className="svc-sticky-card sticky"
                style={{ top: `${60 + i * 20}px`, zIndex: i + 1 }}
              >
                <Link
                  href={`/servicios/${s.slug}`}
                  aria-label={s.title}
                  className="group relative block overflow-hidden border border-zinc-800/50 bg-zinc-950 hover:border-accent/30 transition-all duration-500 shadow-2xl shadow-black/50"
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const x = e.clientX - rect.left
                    const y = e.clientY - rect.top
                    const glow = e.currentTarget.querySelector('.card-glow') as HTMLElement
                    if (glow) {
                      glow.style.opacity = '1'
                      glow.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(204,0,0,0.07), transparent 40%)`
                    }
                  }}
                  onMouseLeave={(e) => {
                    const glow = e.currentTarget.querySelector('.card-glow') as HTMLElement
                    if (glow) glow.style.opacity = '0'
                  }}
                >
                  {/* Pointer-following light reflection */}
                  <div className="card-glow absolute inset-0 z-20 pointer-events-none opacity-0 transition-opacity duration-300" />

                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative overflow-hidden h-72 md:h-[420px]">
                      <Image
                        src={s.image}
                        alt={s.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="svc-card-img object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                      <span className="absolute top-4 left-4 font-mono text-xs text-accent/80 tracking-wider bg-zinc-950/60 backdrop-blur-sm px-2 py-1">
                        {s.number}
                      </span>
                    </div>
                    {/* Content */}
                    <div className="p-8 sm:p-12 flex flex-col justify-center">
                      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-zinc-600 mb-2">
                        {s.subtitle}
                      </p>
                      <h3 className="font-display text-4xl sm:text-5xl uppercase mb-4 group-hover:text-accent transition-colors duration-300">
                        {s.title}
                      </h3>
                      <p className="text-sm text-zinc-500 leading-relaxed max-w-md">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {/* Spacer so last card has room to fully appear */}
          <div className="h-[30vh]" />
        </div>
      </section>

      <TestimonialsSection />

      {/* ===== SPRAY BOOTH — cinematic full bleed ===== */}
      <section className="booth-section relative h-[60vh] sm:h-[80vh] min-h-[400px] sm:min-h-[600px] overflow-hidden">
        {/* Top/bottom fade into dark background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-30 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-30 pointer-events-none" />

        {/* Background image with parallax (mid-scroll; loads lazily).
            Source is a WebP (q=92, visually lossless); Next serves AVIF/WebP
            variants at the widths declared in next.config.ts -> deviceSizes. */}
        <div className="booth-bg absolute inset-0">
          <Image
            src="/images/quality-materials.webp"
            alt={tHome('Booth.imageAlt')}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover"
            loading="lazy"
          />
        </div>

        {/* Dark overlays */}
        <div className="absolute inset-0 bg-background/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-transparent" />

        {/* WebGL particle overlay — skipped under reduced-motion */}
        {!reducedMotion && (
          <div
            className="absolute inset-0 pointer-events-none opacity-70"
            aria-hidden="true"
          >
            <SprayParticleScene />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-24">
          <div className="max-w-2xl">
            <p className="booth-text gsap-reveal font-mono text-xs tracking-[0.25em] uppercase text-accent mb-6">
              {tHome('Booth.eyebrow')}
            </p>
            <h2 className="booth-text gsap-reveal font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.85] uppercase">
              {tHome('Booth.title1')}
              <br />
              {tHome('Booth.title2')}
              <br />
              <span className="text-accent">{tHome('Booth.titleAccent')}</span>
            </h2>
            <p className="booth-text gsap-reveal text-zinc-400 mt-8 max-w-md leading-relaxed">
              {tHome('Booth.body')}
            </p>
          </div>
        </div>
      </section>

      {/* ===== MATERIALS ===== */}
      <section
        id="materials"
        className="mat-section py-24 sm:py-32 px-6 sm:px-12 lg:px-24"
      >
        <div className="max-w-6xl mx-auto">
          {/* Heading — centered */}
          <div className="mat-item gsap-reveal text-center mb-20">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              {tHome('Materials.eyebrow')}
            </p>
            <h2 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-[0.85] uppercase mb-6">
              {tHome('Materials.titleBefore')}
              <span className="text-accent">{tHome('Materials.titleAccent')}</span>
            </h2>
            <p className="text-zinc-400 leading-relaxed max-w-xl mx-auto">
              {tHome('Materials.body')}
            </p>
          </div>

          {/* Brand strip — large, bold, centered */}
          <div className="mat-item gsap-reveal flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-4 mb-20">
            {materialBrands.map((brand, i) => (
              <span key={brand.name} className="flex items-center gap-6">
                <span className="font-display text-[clamp(2.5rem,5vw,4.5rem)] uppercase tracking-[0.05em] text-zinc-600 hover:text-accent transition-colors duration-500">
                  {brand.name}
                </span>
                {i < materialBrands.length - 1 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent/60" aria-hidden="true" />
                )}
              </span>
            ))}
          </div>

          {/* Trust items — 3 columns with top accent line */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-zinc-800/50">
            {materialTrust.map((item) => (
              <div
                key={item.label}
                className="mat-item gsap-reveal group bg-background p-8 sm:p-10"
              >
                <div className="w-8 h-px bg-accent mb-6 group-hover:w-16 transition-all duration-500" />
                <p className="font-display text-2xl uppercase mb-3">
                  {item.label}
                </p>
                <p className="text-sm text-zinc-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section id="process" className="py-32 sm:py-44 px-6 sm:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="s-reveal gsap-reveal mb-20 text-center">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              {tHome('Process.eyebrow')}
            </p>
            <h2 className="font-display text-[clamp(3.5rem,10vw,9rem)] leading-[0.85] uppercase">
              {tHome('Process.title1')}
              <br />
              {tHome('Process.title2')}{' '}
              <span className="text-accent">{tHome('Process.titleAccent')}</span>
            </h2>
          </div>

          <div className="proc-grid grid grid-cols-1 md:grid-cols-2 gap-5">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className="proc-step gsap-reveal group relative overflow-hidden border border-zinc-800/50 bg-zinc-950 hover:border-accent/30 transition-all duration-500"
                style={{ minHeight: '320px' }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  const y = e.clientY - rect.top
                  const glow = e.currentTarget.querySelector('.proc-glow') as HTMLElement
                  if (glow) {
                    glow.style.opacity = '1'
                    glow.style.background = `radial-gradient(500px circle at ${x}px ${y}px, rgba(204,0,0,0.08), transparent 40%)`
                  }
                }}
                onMouseLeave={(e) => {
                  const glow = e.currentTarget.querySelector('.proc-glow') as HTMLElement
                  if (glow) glow.style.opacity = '0'
                }}
              >
                {/* Pointer-following red shine */}
                <div className="proc-glow absolute inset-0 z-0 pointer-events-none opacity-0 transition-opacity duration-300" />

                {/* Giant ghost number — bleeds out of card */}
                <div
                  className="absolute -bottom-8 -right-4 font-display leading-none select-none pointer-events-none text-zinc-800/[0.07]"
                  style={{ fontSize: 'clamp(12rem, 20vw, 18rem)' }}
                >
                  {step.number}
                </div>

                {/* Content */}
                <div className="relative z-10 p-10 sm:p-12 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <span className="font-display text-7xl sm:text-8xl text-accent leading-none">
                        {step.number}
                      </span>
                      <div className="flex-1 h-px bg-zinc-800 group-hover:bg-accent/40 transition-colors duration-500" />
                    </div>
                    <h3 className="font-display text-5xl sm:text-6xl uppercase mb-4 group-hover:text-accent transition-colors duration-300">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-base text-zinc-500 leading-relaxed max-w-md">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GUARANTEE — massive text ===== */}
      <section className="guarantee-section relative py-32 sm:py-44 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/50 overflow-hidden">
        {/* Cursor-reactive grid */}
        <ReactiveGrid />
        <div className="relative max-w-5xl mx-auto text-center">
          <p className="guarantee-text gsap-reveal font-mono text-xs tracking-[0.25em] uppercase text-accent mb-8">
            {tHome('Guarantee.eyebrow')}
          </p>
          <h2 className="guarantee-text gsap-reveal font-display text-[clamp(3rem,9vw,8rem)] leading-[0.85] uppercase">
            {tHome('Guarantee.line1')}
            <br />
            <span className="text-accent">{tHome('Guarantee.lineAccent')}</span>
            <br />
            {tHome('Guarantee.line2')}
          </h2>
          <p className="guarantee-text gsap-reveal text-zinc-400 mt-10 max-w-xl mx-auto text-lg leading-relaxed">
            {tHome('Guarantee.body')}
          </p>
        </div>
      </section>

      {/* ===== MAP ===== */}
      {business.map.embedUrl && (
        <section
          aria-labelledby="map-heading"
          className="relative border-t border-zinc-800/50 bg-background"
        >
          <h2 id="map-heading" className="sr-only">
            {tHome('Map.srHeading')}
          </h2>
          <div className="relative h-[320px] sm:h-[420px] overflow-hidden">
            {/* Native Google Maps coloring — the red pin reads as the
                site's accent against the dark background framing. */}
            <iframe
              src={business.map.embedUrl}
              title={tHome('Map.iframeTitle')}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
              style={{ border: 0 }}
            />
            {/* Single, short bottom fade to blend into the location strip
                below. No top fade — the section's border-t already does that
                job, and a second overlay just eats map content. */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent" />
          </div>
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-12 lg:px-24">
            <div>
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500">
                {tHome('Map.stripEyebrow')}
              </p>
              <p className="mt-1 text-sm text-zinc-300">
                {contactInfo.locationDisplay}
              </p>
            </div>
            <a
              href={business.map.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-zinc-700 px-5 py-3 font-mono text-[11px] tracking-[0.25em] uppercase text-zinc-300 hover:border-zinc-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {tHome('Map.openGoogleMaps')}
            </a>
          </div>
        </section>
      )}

      {/* ===== CTA / CONTACT ===== */}
      <section
        id="contact"
        className="cta-section py-24 sm:py-32 px-6 sm:px-12 lg:px-24 border-t border-zinc-800/50"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
          <div className="cta-reveal gsap-reveal">
            <p className="font-mono text-xs tracking-[0.25em] uppercase text-accent mb-4">
              {tHome('Cta.eyebrow')}
            </p>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] uppercase mb-6">
              {tHome('Cta.title1')}
              <br />
              {tHome('Cta.title2')}
            </h2>
            <p className="text-zinc-400 leading-relaxed mb-8 max-w-md">
              {tHome('Cta.body')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('contact_whatsapp')}
                className="inline-flex items-center justify-center gap-3 px-6 py-4 bg-[#25D366] text-white text-sm font-medium tracking-wide hover:bg-[#20BD5A] transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                {tNav('whatsappCta')}
              </a>
              <a
                href={`tel:${contactInfo.phone}`}
                onClick={() => track('contact_phone')}
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
                {contactInfo.phoneDisplay}
              </a>
            </div>

            <div className="font-mono text-xs text-zinc-600 space-y-2">
              <OpenNowBadge />
              <p>{contactInfo.locationDisplay}</p>
              <p>{contactInfo.hoursDisplay}</p>
            </div>
          </div>

          <div className="cta-reveal gsap-reveal">
            <QuoteForm
              onEvent={(event, props) => {
                if (event === 'quote_submit') {
                  track('quote_submit', props as Record<string, string>)
                } else if (event === 'quote_error') {
                  track(
                    'quote_error',
                    props as Record<string, string | number>
                  )
                }
              }}
            />
          </div>
        </div>
      </section>

      <SiteFooter />

      </div>{/* end scrolling content wrapper */}
    </div>
  )
}
