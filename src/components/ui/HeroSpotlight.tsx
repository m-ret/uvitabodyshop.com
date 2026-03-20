'use client'

import { useRef, useEffect } from 'react'

/**
 * Canvas overlay that creates a cursor-following spotlight effect.
 * As the user moves their mouse, a soft light "reveals" the image
 * underneath — like an inspection lamp sweeping across a painted surface.
 *
 * Also renders subtle animated light streaks that sweep across
 * the image independently, simulating studio lighting.
 */
export default function HeroSpotlight() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -500, y: -500 })
  const smoothMouse = useRef({ x: -500, y: -500 })
  const animRef = useRef<number>(0)
  const streaks = useRef<Array<{ x: number; speed: number; width: number; opacity: number }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Initialize light streaks
    streaks.current = [
      { x: -0.5, speed: 0.08, width: 0.15, opacity: 0.06 },
      { x: 0.2, speed: 0.05, width: 0.08, opacity: 0.04 },
      { x: 0.8, speed: 0.12, width: 0.1, opacity: 0.05 },
    ]

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
      )
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }

    const onLeave = () => {
      mouse.current.x = -500
      mouse.current.y = -500
    }

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio

      ctx.clearRect(0, 0, w, h)

      // Smooth mouse following
      smoothMouse.current.x +=
        (mouse.current.x - smoothMouse.current.x) * 0.06
      smoothMouse.current.y +=
        (mouse.current.y - smoothMouse.current.y) * 0.06

      const mx = smoothMouse.current.x
      const my = smoothMouse.current.y

      // ── Animated light streaks (diagonal) ──
      const now = Date.now() * 0.001
      for (const streak of streaks.current) {
        const progress = ((now * streak.speed + streak.x) % 2) - 0.5
        const screenX = progress * w * 1.5

        const grad = ctx.createLinearGradient(
          screenX - streak.width * w * 0.5,
          0,
          screenX + streak.width * w * 0.5,
          0
        )
        grad.addColorStop(0, 'rgba(255, 200, 160, 0)')
        grad.addColorStop(0.3, `rgba(255, 200, 160, ${streak.opacity})`)
        grad.addColorStop(0.5, `rgba(255, 220, 190, ${streak.opacity * 1.5})`)
        grad.addColorStop(0.7, `rgba(255, 200, 160, ${streak.opacity})`)
        grad.addColorStop(1, 'rgba(255, 200, 160, 0)')

        ctx.save()
        ctx.translate(w / 2, h / 2)
        ctx.rotate(-0.15)
        ctx.translate(-w / 2, -h / 2)
        ctx.fillStyle = grad
        ctx.fillRect(screenX - streak.width * w, 0, streak.width * w * 2, h)
        ctx.restore()
      }

      // ── Cursor spotlight ──
      if (mx > -100 && my > -100) {
        const radius = Math.min(w, h) * 0.35

        // Outer glow — warm, soft
        const outerGlow = ctx.createRadialGradient(mx, my, 0, mx, my, radius)
        outerGlow.addColorStop(0, 'rgba(255, 240, 220, 0.12)')
        outerGlow.addColorStop(0.3, 'rgba(255, 200, 160, 0.06)')
        outerGlow.addColorStop(0.6, 'rgba(204, 80, 20, 0.03)')
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = outerGlow
        ctx.fillRect(0, 0, w, h)

        // Inner highlight — bright, tight
        const innerGlow = ctx.createRadialGradient(
          mx,
          my,
          0,
          mx,
          my,
          radius * 0.3
        )
        innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.1)')
        innerGlow.addColorStop(0.5, 'rgba(255, 230, 200, 0.04)')
        innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = innerGlow
        ctx.fillRect(0, 0, w, h)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto z-[1]"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
