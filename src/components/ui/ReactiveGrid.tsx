'use client'

import { useRef, useEffect } from 'react'

/**
 * A subtle background grid drawn on a 2D canvas.
 * Grid lines brighten and glow near the cursor position,
 * creating a "reactive surface" effect.
 */
export default function ReactiveGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const CELL = 50
    const INFLUENCE = 180 // how far the glow reaches in px

    const resize = () => {
      const rect = parent.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0)
    }

    /* Listen on the parent (not the canvas) so children stay interactive
       while the grid still tracks the cursor across the whole section. */
    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }

    const onLeave = () => {
      mouse.current.x = -1000
      mouse.current.y = -1000
    }

    const draw = () => {
      const w = canvas.width / window.devicePixelRatio
      const h = canvas.height / window.devicePixelRatio

      ctx.clearRect(0, 0, w, h)

      const mx = mouse.current.x
      const my = mouse.current.y

      // Draw vertical lines
      for (let x = 0; x <= w; x += CELL) {
        // Check distance of this line to cursor
        const dx = Math.abs(x - mx)
        const proximity = Math.max(0, 1 - dx / INFLUENCE)

        // Base opacity + cursor-reactive boost
        const alpha = 0.03 + proximity * 0.12

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)

        if (proximity > 0) {
          ctx.strokeStyle = `rgba(204, 0, 0, ${alpha})`
          ctx.lineWidth = 1 + proximity * 0.5
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, 0.03)`
          ctx.lineWidth = 0.5
        }
        ctx.stroke()
      }

      // Draw horizontal lines
      for (let y = 0; y <= h; y += CELL) {
        const dy = Math.abs(y - my)
        const proximity = Math.max(0, 1 - dy / INFLUENCE)
        const alpha = 0.03 + proximity * 0.12

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)

        if (proximity > 0) {
          ctx.strokeStyle = `rgba(204, 0, 0, ${alpha})`
          ctx.lineWidth = 1 + proximity * 0.5
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, 0.03)`
          ctx.lineWidth = 0.5
        }
        ctx.stroke()
      }

      // Glow at intersection points near cursor
      for (let x = 0; x <= w; x += CELL) {
        for (let y = 0; y <= h; y += CELL) {
          const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2)
          if (dist < INFLUENCE) {
            const intensity = 1 - dist / INFLUENCE
            ctx.beginPath()
            ctx.arc(x, y, 1.5 + intensity * 2, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(204, 0, 0, ${intensity * 0.4})`
            ctx.fill()
          }
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    parent.addEventListener('mousemove', onMove)
    parent.addEventListener('mouseleave', onLeave)
    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      parent.removeEventListener('mousemove', onMove)
      parent.removeEventListener('mouseleave', onLeave)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 1 }}
    />
  )
}
