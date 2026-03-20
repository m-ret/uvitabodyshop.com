'use client'

import { useState, useEffect, useRef } from 'react'

type Direction = 'bold-industrial' | 'clean-professional' | 'tropical-local'

const DIRECTIONS = [
  {
    id: 'bold-industrial' as Direction,
    label: 'Direction A',
    name: 'Bold Industrial',
    tagline: 'Power. Precision. Dominance.',
    mood: 'Dark • Metallic • Modern',
    palette: ['#0a0a0a', '#1a1a1a', '#d4af37', '#ffffff'],
    paletteName: ['Void Black', 'Carbon', 'Gold', 'White'],
    typography: 'Barlow Condensed + DM Sans',
    vibe: 'High-impact and authoritative — like a premium garage meets a race team.',
    highlights: [
      'WebGL metallic 3D hero',
      'Dark industrial palette',
      'Bold condensed type',
      'Hex grid animations',
    ],
    href: '/directions/bold-industrial',
    accent: '#d4af37',
    accentText: 'text-yellow-400',
    accentBorder: 'border-yellow-400',
    accentBg: 'bg-yellow-400',
  },
  {
    id: 'clean-professional' as Direction,
    label: 'Direction B',
    name: 'Clean Professional',
    tagline: 'Trusted. Expert. Premium.',
    mood: 'Light • Clinical • Corporate',
    palette: ['#f8f9fa', '#1e3a5f', '#2563eb', '#0ea5e9'],
    paletteName: ['Off-White', 'Navy', 'Blue', 'Sky'],
    typography: 'Plus Jakarta Sans + Inter',
    vibe: 'Builds immediate trust — the design language of certified excellence.',
    highlights: [
      'Particle paint 3D scene',
      'Navy & sky blue palette',
      'Trust signals & certifications',
      'Professional grid layout',
    ],
    href: '/directions/clean-professional',
    accent: '#2563eb',
    accentText: 'text-blue-500',
    accentBorder: 'border-blue-500',
    accentBg: 'bg-blue-500',
  },
  {
    id: 'tropical-local' as Direction,
    label: 'Direction C',
    name: 'Tropical Local',
    tagline: 'Community. Warmth. Roots.',
    mood: 'Warm • Organic • Inviting',
    palette: ['#fefce8', '#166534', '#15803d', '#d97706'],
    paletteName: ['Cream', 'Forest', 'Green', 'Amber'],
    typography: 'Playfair Display + DM Sans',
    vibe: "Uvita's heartbeat — the neighborhood shop that's also world-class.",
    highlights: [
      'Organic particle 3D hero',
      'Forest green & amber palette',
      'Testimonials & community feel',
      'Serif editorial typography',
    ],
    href: '/directions/tropical-local',
    accent: '#15803d',
    accentText: 'text-green-600',
    accentBorder: 'border-green-600',
    accentBg: 'bg-green-600',
  },
]

export function ExplorationPage() {
  const [active, setActive] = useState<Direction>('bold-industrial')
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const activeDir = DIRECTIONS.find((d) => d.id === active)!

  useEffect(() => {
    setLoading(true)
  }, [active])

  const handleIframeLoad = () => {
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
              Uvita Body Shop
            </p>
            <h1 className="text-xl font-semibold tracking-tight">
              Design Exploration
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40 uppercase tracking-widest">
              3 Directions
            </p>
            <p className="text-xs text-white/25 mt-0.5">Client Preview</p>
          </div>
        </div>
      </header>

      {/* Direction selector */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-px bg-white/5">
            {DIRECTIONS.map((dir) => {
              const isActive = active === dir.id
              return (
                <button
                  key={dir.id}
                  onClick={() => setActive(dir.id)}
                  className={`relative p-6 text-left transition-all duration-200 group ${
                    isActive ? 'bg-white/[0.06]' : 'bg-[#0d0d0d] hover:bg-white/[0.03]'
                  }`}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5"
                      style={{ backgroundColor: dir.accent }}
                    />
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs uppercase tracking-[0.15em] text-white/30 block mb-1">
                        {dir.label}
                      </span>
                      <h2
                        className={`text-lg font-semibold transition-colors ${
                          isActive ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                        }`}
                      >
                        {dir.name}
                      </h2>
                    </div>
                    {/* Color palette dots */}
                    <div className="flex gap-1 mt-1">
                      {dir.palette.map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full ring-1 ring-white/10"
                          style={{ backgroundColor: color }}
                          title={dir.paletteName[i]}
                        />
                      ))}
                    </div>
                  </div>

                  <p
                    className={`text-sm font-medium mb-1 transition-colors ${
                      isActive ? 'text-white/90' : 'text-white/40'
                    }`}
                    style={isActive ? { color: dir.accent } : {}}
                  >
                    {dir.tagline}
                  </p>
                  <p className="text-xs text-white/30">{dir.mood}</p>

                  {/* Highlights (only shown when active) */}
                  {isActive && (
                    <ul className="mt-4 space-y-1.5">
                      {dir.highlights.map((h, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-white/50">
                          <span
                            className="w-1 h-1 rounded-full flex-shrink-0"
                            style={{ backgroundColor: dir.accent }}
                          />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Vibe text */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <p className="text-sm text-white/40 italic">
          &ldquo;{activeDir.vibe}&rdquo;
        </p>
        <a
          href={activeDir.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-white/30 hover:text-white/60 transition-colors underline underline-offset-2 flex-shrink-0 ml-4"
        >
          Open full page ↗
        </a>
      </div>

      {/* Iframe preview */}
      <div className="max-w-7xl mx-auto px-6 pb-6">
        <div className="relative rounded-lg overflow-hidden border border-white/10" style={{ height: '75vh' }}>
          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-[#111] z-10">
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: activeDir.accent, borderTopColor: 'transparent' }}
                />
                <p className="text-xs text-white/30 uppercase tracking-widest">Loading preview</p>
              </div>
            </div>
          )}

          {/* Browser chrome bar */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-[#0d0d0d] rounded px-3 py-1 text-xs text-white/30 font-mono">
                uvitabodyshop.com{activeDir.href}
              </div>
            </div>
            <span className="text-xs text-white/20 uppercase tracking-widest">
              {activeDir.label}
            </span>
          </div>

          <iframe
            key={active}
            ref={iframeRef}
            src={activeDir.href}
            onLoad={handleIframeLoad}
            className="w-full bg-white"
            style={{ height: 'calc(75vh - 42px)' }}
            title={`Design ${activeDir.label}: ${activeDir.name}`}
          />
        </div>
      </div>

      {/* CTA footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-white/40 text-sm mb-1 uppercase tracking-widest text-xs">
                Ready to move forward?
              </p>
              <p className="text-lg font-medium">
                You&rsquo;re viewing{' '}
                <span style={{ color: activeDir.accent }}>{activeDir.name}</span>
              </p>
              <p className="text-sm text-white/40 mt-1">
                Select a direction and we&rsquo;ll begin full development.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {DIRECTIONS.map((dir) => (
                <button
                  key={dir.id}
                  onClick={() => setActive(dir.id)}
                  className={`px-4 py-2.5 rounded text-sm font-medium transition-all duration-200 border ${
                    active === dir.id
                      ? 'text-[#0d0d0d]'
                      : 'bg-transparent text-white/50 border-white/20 hover:border-white/40 hover:text-white/70'
                  }`}
                  style={
                    active === dir.id
                      ? { backgroundColor: dir.accent, borderColor: dir.accent }
                      : {}
                  }
                >
                  {dir.label}
                </button>
              ))}
              <a
                href={`mailto:hello@uvitabodyshop.com?subject=Design Direction Selection: ${activeDir.name}&body=Hi, I'd like to proceed with ${activeDir.name} (${activeDir.label}) for the website.`}
                className="px-5 py-2.5 rounded text-sm font-semibold text-[#0d0d0d] transition-all duration-200 hover:opacity-90"
                style={{ backgroundColor: activeDir.accent }}
              >
                Select {activeDir.label} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
