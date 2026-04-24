'use client'

import { useState, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { displayContact } from '@/data/business'
import { track } from '@/lib/analytics'
import Wordmark from './Wordmark'

function buildNavLinks(
  isHome: boolean,
  t: (key: string) => string,
  withPrefix: (href: string) => string
) {
  return [
    { label: t('services'), href: '/servicios' },
    { label: t('about'), href: '/sobre-nosotros' },
    { label: t('warranty'), href: '/garantia' },
    { label: t('faq'), href: '/preguntas-frecuentes' },
    { label: t('process'), href: withPrefix('#process') },
    { label: t('materials'), href: withPrefix('#materials') },
    { label: t('contact'), href: isHome ? '#contact' : '/contacto' },
  ]
}

export default function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale() as 'es' | 'en'
  const t = useTranslations('Nav')
  const tLoc = useTranslations('Locale')
  const contact = displayContact(locale)

  const isHome = pathname === '/'
  const withPrefix = (href: string) => {
    if (href.startsWith('/')) return href
    if (isHome) return href
    return `/${href}`
  }
  const navLinks = buildNavLinks(isHome, t, withPrefix)

  const [isOpen, setIsOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useGSAP(
    () => {
      if (!overlayRef.current) return

      const tl = gsap.timeline({ paused: true })

      tl.to(overlayRef.current, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.6,
        ease: 'power4.inOut',
      })
        .from(
          '.nav-link',
          {
            y: 120,
            opacity: 0,
            rotateX: 40,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.2'
        )
        .from(
          '.nav-footer-item',
          {
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out',
          },
          '-=0.4'
        )

      tlRef.current = tl
    },
    { scope: overlayRef }
  )

  const open = () => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
    tlRef.current?.play()
  }

  const close = () => {
    tlRef.current?.reverse()
    setTimeout(() => {
      setIsOpen(false)
      document.body.style.overflow = ''
    }, 600)
  }

  const handleLinkClick = (href: string) => {
    close()
    setTimeout(() => {
      if (
        href.startsWith('/sobre-') ||
        href.startsWith('/servicios') ||
        href.startsWith('/contacto') ||
        href.startsWith('/garantia') ||
        href.startsWith('/preguntas-') ||
        href.startsWith('/zonas/') ||
        href.startsWith('/guias/')
      ) {
        router.push(href)
        return
      }
      if (href === '/contacto' || (href === '#contact' && !isHome)) {
        router.push('/contacto')
        return
      }
      if (href.startsWith('/#')) {
        if (isHome) {
          const el = document.querySelector(href.slice(1))
          el?.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.location.assign(href)
        }
        return
      }
      if (href.startsWith('#')) {
        if (isHome) {
          const el = document.querySelector(href)
          el?.scrollIntoView({ behavior: 'smooth' })
        } else {
          window.location.assign(`/${href}`)
        }
      }
    }, 700)
  }

  const otherLocale = locale === 'es' ? 'en' : 'es'

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60] px-6 sm:px-12 lg:px-24 py-4 flex items-center justify-between pointer-events-none [padding-top:calc(env(safe-area-inset-top,0)+1rem)] before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-background/90 before:via-background/50 before:to-transparent before:pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-3 sm:gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 hover:opacity-80 transition-opacity duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            onClick={(e) => {
              if (pathname === '/') {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }
            }}
            aria-label={t('brandAria')}
          >
            <Wordmark
              variant="mark"
              theme="dark"
              size={64}
              priority
              className="h-10 sm:h-12 lg:h-14 w-auto"
            />
            <span className="hidden sm:inline font-display text-base lg:text-lg uppercase tracking-[0.18em] text-white">
              {t('brandName')}
            </span>
          </Link>
          <Link
            href={pathname}
            locale={otherLocale}
            className="font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 border border-zinc-800 px-2 py-1 hover:border-accent/60 hover:text-accent transition-colors"
          >
            {tLoc('switchTo')}
          </Link>
        </div>

        <button
          onClick={isOpen ? close : open}
          className="pointer-events-auto relative z-[60] w-12 h-12 flex flex-col items-center justify-center gap-1.5 group"
          aria-label={isOpen ? t('closeMenu') : t('openMenu')}
        >
          <span
            className={`block w-6 h-px bg-white transition-all duration-300 ${
              isOpen ? 'rotate-45 translate-y-[3.5px]' : 'group-hover:w-8 group-hover:bg-accent'
            }`}
          />
          <span
            className={`block h-px bg-white transition-all duration-300 ${
              isOpen ? '-rotate-45 -translate-y-[3.5px] w-6' : 'w-4 group-hover:w-8 group-hover:bg-accent'
            }`}
          />
        </button>
      </header>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-[55] bg-background overflow-y-auto overscroll-contain"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        aria-hidden={!isOpen}
      >
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div className="absolute top-0 left-12 sm:left-24 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

        <div className="relative min-h-full flex flex-col justify-between gap-12 px-6 sm:px-12 lg:px-24 pt-[calc(env(safe-area-inset-top,0)+5.5rem)] pb-[calc(env(safe-area-inset-bottom,0)+3rem)]">
          <nav className="flex-1 flex flex-col justify-center">
            {navLinks.map((link, i) => (
              <div key={link.label} className="overflow-hidden">
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleLinkClick(link.href)
                  }}
                  className="nav-link group flex items-baseline gap-6 py-3 sm:py-4"
                >
                  <span className="font-mono text-xs text-accent tracking-wider opacity-50 group-hover:opacity-100 transition-opacity">
                    0{i + 1}
                  </span>
                  <span className="font-display text-[clamp(3rem,10vw,8rem)] uppercase leading-[0.95] text-zinc-300 group-hover:text-white transition-colors duration-300">
                    {link.label}
                  </span>
                  <span className="hidden sm:block flex-1 h-px bg-zinc-800 group-hover:bg-accent/30 transition-colors duration-500 self-center" />
                  <span className="hidden sm:block font-mono text-xs text-zinc-700 group-hover:text-accent transition-colors duration-300">
                    &#x2192;
                  </span>
                </a>
              </div>
            ))}
          </nav>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-8 border-t border-zinc-800/50">
            <div className="nav-footer-item">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                {t('location')}
              </p>
              <p className="text-sm text-zinc-400">
                {contact.locationDisplay}
              </p>
            </div>
            <div className="nav-footer-item">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                {t('hours')}
              </p>
              <p className="text-sm text-zinc-400">{contact.hoursDisplay}</p>
            </div>
            <div className="nav-footer-item">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                {t('contactLabel')}
              </p>
              <a
                href={`tel:${contact.phone}`}
                onClick={() => track('contact_phone')}
                className="text-sm text-zinc-400 hover:text-accent transition-colors"
              >
                {contact.phoneDisplay}
              </a>
            </div>
            <a
              href={contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('contact_whatsapp')}
              className="nav-footer-item inline-flex items-center gap-2 px-5 py-3 bg-accent text-white text-sm font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
            >
              {t('whatsappCta')}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
