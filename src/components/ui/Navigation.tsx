'use client'

import { useState, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Process', href: '#process' },
  { label: 'Materials', href: '#materials' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
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
      const el = document.querySelector(href)
      el?.scrollIntoView({ behavior: 'smooth' })
    }, 700)
  }

  return (
    <>
      {/* Fixed top bar */}
      <header className="fixed top-0 left-0 right-0 z-[60] px-6 sm:px-12 lg:px-24 py-5 flex items-center justify-between pointer-events-none mix-blend-difference">
        {/* Logo */}
        <a
          href="#"
          className="pointer-events-auto font-display text-xl uppercase tracking-wider hover:text-accent transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          Uvita Body Shop
        </a>

        {/* Hamburger */}
        <button
          onClick={isOpen ? close : open}
          className="pointer-events-auto relative z-[60] w-12 h-12 flex flex-col items-center justify-center gap-1.5 group"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
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

      {/* Fullscreen overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[55] bg-background"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        aria-hidden={!isOpen}
      >
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        {/* Accent vertical line */}
        <div className="absolute top-0 left-12 sm:left-24 w-px h-full bg-gradient-to-b from-transparent via-accent/20 to-transparent" />

        <div className="h-full flex flex-col justify-between px-6 sm:px-12 lg:px-24 py-24">
          {/* Nav links — massive */}
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

          {/* Footer info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 pt-8 border-t border-zinc-800/50">
            <div className="nav-footer-item">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                Location
              </p>
              <p className="text-sm text-zinc-400">
                Uvita, Puntarenas, Costa Rica
              </p>
            </div>
            <div className="nav-footer-item">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                Hours
              </p>
              <p className="text-sm text-zinc-400">Mon&ndash;Sat &bull; 8 AM &ndash; 5 PM</p>
            </div>
            <div className="nav-footer-item">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 mb-2">
                Contact
              </p>
              <a
                href="tel:+5068769927"
                className="text-sm text-zinc-400 hover:text-accent transition-colors"
              >
                (506) 876-9927
              </a>
            </div>
            <a
              href="https://wa.me/5068769927"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-footer-item inline-flex items-center gap-2 px-5 py-3 bg-accent text-white text-sm font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
