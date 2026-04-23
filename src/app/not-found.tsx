import type { Metadata } from 'next'
import Link from 'next/link'
import { displayContact } from '@/data/business'

export const metadata: Metadata = {
  title: '404 — Página no encontrada · Uvita Body Shop',
  description:
    'La página que buscás no existe. Volvé al inicio o escribinos por WhatsApp.',
  robots: { index: false, follow: false },
}

export default function NotFound() {
  const { whatsapp } = displayContact()

  return (
    <main className="relative min-h-dvh bg-background text-foreground flex items-center justify-center px-6 sm:px-12 lg:px-24 py-16 sm:py-24">
      <CornerMarks />

      <div className="relative z-10 max-w-3xl mx-auto text-center sm:text-left">
        <p className="font-mono text-xs tracking-[0.3em] uppercase text-accent mb-6">
          <span
            aria-hidden="true"
            className="inline-block size-1.5 bg-accent mr-3 align-middle"
          />
          Error 404
        </p>

        <h1 className="font-display text-[clamp(3.5rem,12vw,9rem)] leading-[0.85] uppercase mb-6">
          Página
          <br />
          no encontrada
        </h1>

        <p className="max-w-xl text-zinc-400 leading-relaxed mb-10">
          La dirección que escribiste no existe o la página fue movida. Volvé
          al inicio o escribinos directo por WhatsApp — te respondemos en
          minutos.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white text-sm font-medium tracking-wide uppercase hover:bg-accent-hover transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Volver al inicio
          </Link>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-zinc-800 text-zinc-300 text-sm font-medium tracking-wide uppercase hover:border-zinc-400 hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Escribir por WhatsApp
          </a>
        </div>
      </div>
    </main>
  )
}

function CornerMarks() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <span className="absolute top-6 left-6 sm:top-12 sm:left-12 block size-6 border-t border-l border-zinc-700/70" />
      <span className="absolute top-6 right-6 sm:top-12 sm:right-12 block size-6 border-t border-r border-zinc-700/70" />
      <span className="absolute bottom-6 left-6 sm:bottom-12 sm:left-12 block size-6 border-b border-l border-zinc-700/70" />
      <span className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 block size-6 border-b border-r border-zinc-700/70" />
    </div>
  )
}
