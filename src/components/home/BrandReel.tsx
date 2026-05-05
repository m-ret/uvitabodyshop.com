'use client'

import { useCallback, useRef, useState, useSyncExternalStore } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { business } from '@/data/business'
import { PauseIcon, PlayIcon, ReplayIcon } from '@/components/ui/icons/ReelControls'

/**
 * Brand-awareness reel — 26-second silent video.
 * Source picked from a 4-way matrix: locale × aspect.
 *
 *   - 9:16 served on phone-portrait viewports (<768px portrait)
 *   - 16:9 everywhere else (phone landscape, tablets, desktop)
 *
 * Click-to-play with custom play / pause / replay controls — no autoplay.
 * First frame is shown as the poster (forced via `currentTime = 0.1` trick).
 */
const PORTRAIT_PHONE_QUERY = '(max-width: 767px) and (orientation: portrait)'

function subscribePhonePortrait(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia(PORTRAIT_PHONE_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}
function getPhonePortraitSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(PORTRAIT_PHONE_QUERY).matches
}
function getPhonePortraitServerSnapshot(): boolean {
  return false
}
function usePhonePortrait(): boolean {
  return useSyncExternalStore(
    subscribePhonePortrait,
    getPhonePortraitSnapshot,
    getPhonePortraitServerSnapshot,
  )
}

type PlayState = 'idle' | 'playing' | 'paused' | 'ended'

type BrandReelLabels = {
  play: string
  pause: string
  replay: string
  aria: string
}

type BrandReelPlayerProps = {
  src: string
  labels: BrandReelLabels
}

export default function BrandReel() {
  const locale = useLocale()
  const t = useTranslations('Home.BrandReel')
  const isPhonePortrait = usePhonePortrait()
  const ratio = isPhonePortrait ? '9x16' : '16x9'
  const reelLocale = locale === 'en' ? 'en' : 'es'
  const src = `/videos/brand-awareness/uvita-bodyshop-brand-awareness-${ratio}-${reelLocale}.mp4`
  const labels = {
    play: t('play'),
    pause: t('pause'),
    replay: t('replay'),
    aria: t('aria', { years: business.yearsExperience }),
  }

  return <BrandReelPlayer key={src} src={src} labels={labels} />
}

function BrandReelPlayer({ src, labels }: BrandReelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<PlayState>('idle')

  // Force first-frame poster after metadata loads (no autoplay → black box otherwise)
  const handleLoadedMetadata = useCallback(() => {
    const v = videoRef.current
    if (!v || v.currentTime > 0) return
    v.currentTime = 0.1
  }, [])

  const handleClick = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (state === 'playing') {
      v.pause()
      setState('paused')
    } else if (state === 'ended') {
      v.currentTime = 0
      v.play().then(() => setState('playing')).catch(() => {})
    } else {
      v.play().then(() => setState('playing')).catch(() => {})
    }
  }, [state])

  const overlayLabel =
    state === 'playing' ? labels.pause : state === 'ended' ? labels.replay : labels.play
  const overlayVisible = state !== 'playing'

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={overlayLabel}
      className="group relative block w-full h-full bg-background overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0"
    >
      <video
        ref={videoRef}
        key={src}
        src={src}
        muted
        playsInline
        preload="metadata"
        aria-label={labels.aria}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setState('playing')}
        onPause={() => setState((s) => (s === 'ended' ? s : 'paused'))}
        onEnded={() => setState('ended')}
        className="block w-full h-full object-cover bg-background pointer-events-none"
      />

      {/* Play / pause / replay overlay */}
      <span
        aria-hidden="true"
        className={[
          'absolute inset-0 flex items-center justify-center',
          'transition-opacity duration-300 ease-out',
          overlayVisible ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          state === 'playing' ? 'bg-black/0 group-hover:bg-black/30' : 'bg-black/30',
        ].join(' ')}
      >
        <span className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center bg-accent text-white transition-transform duration-200 ease-out group-hover:scale-105">
          {state === 'playing' ? (
            <PauseIcon />
          ) : state === 'ended' ? (
            <ReplayIcon />
          ) : (
            <PlayIcon className="translate-x-[2px]" />
          )}
        </span>
      </span>
    </button>
  )
}
