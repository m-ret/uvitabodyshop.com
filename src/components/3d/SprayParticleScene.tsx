'use client'

import { Suspense, useRef, useMemo, useSyncExternalStore } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { mulberry32 } from '@/lib/random'

const MIST_SEED = 0xbadf00d
const HAZE_SEED = 0xfeed5ee

/**
 * Paint spray mist particles that drift across the viewport.
 * Simulates the fine overspray inside a professional paint booth.
 */
function SprayMist({
  count = 120,
  color = '#cc0000',
  seedOffset = 0,
}: {
  count?: number
  color?: string
  seedOffset?: number
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const tempObject = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => {
    const rng = mulberry32(MIST_SEED + seedOffset)
    const offsets = Array.from({ length: count }, () => ({
      x: (rng() - 0.5) * 16,
      y: (rng() - 0.5) * 10,
      z: (rng() - 0.5) * 6 - 3,
    }))
    const speeds = Array.from({ length: count }, () => rng() * 0.15 + 0.05)
    const sizes = Array.from({ length: count }, () => rng() * 0.06 + 0.025)
    const phases = Array.from({ length: count }, () => rng() * Math.PI * 2)
    return { offsets, speeds, sizes, phases }
  }, [count, seedOffset])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const { x, y, z } = data.offsets[i]
      const speed = data.speeds[i]
      const phase = data.phases[i]

      const driftX =
        x + Math.sin(t * speed * 0.7 + phase) * 0.5 + t * speed * 0.3
      const wrappedX = driftX > 10 ? -10 : driftX
      tempObject.position.set(
        wrappedX,
        y + Math.cos(t * speed + phase) * 0.3,
        z + Math.sin(t * speed * 0.4 + phase * 2) * 0.2
      )

      const s = data.sizes[i] * (1 + Math.sin(t * speed * 2 + phase) * 0.3)
      tempObject.scale.setScalar(s)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.35} />
    </instancedMesh>
  )
}

function HazeParticles({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const tempObject = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => {
    const rng = mulberry32(HAZE_SEED)
    const offsets = Array.from({ length: count }, () => ({
      x: (rng() - 0.5) * 20,
      y: (rng() - 0.5) * 12,
      z: (rng() - 0.5) * 4 - 4,
    }))
    const speeds = Array.from({ length: count }, () => rng() * 0.08 + 0.02)
    const phases = Array.from({ length: count }, () => rng() * Math.PI * 2)
    return { offsets, speeds, phases }
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const { x, y, z } = data.offsets[i]
      const speed = data.speeds[i]
      const phase = data.phases[i]

      tempObject.position.set(
        x + Math.sin(t * speed + phase) * 1.2,
        y + Math.cos(t * speed * 0.6 + phase) * 0.8,
        z
      )

      const s = 0.03 + Math.sin(t * speed * 1.5 + phase) * 0.01
      tempObject.scale.setScalar(s)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
    </instancedMesh>
  )
}

const MOBILE_QUERY = '(max-width: 767px)'

function subscribeMobile(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const mql = window.matchMedia(MOBILE_QUERY)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}

function getMobileSnapshot(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(MOBILE_QUERY).matches
}

function getServerMobileSnapshot(): boolean {
  return false
}

function useIsMobile(): boolean {
  return useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getServerMobileSnapshot
  )
}

export default function SprayParticleScene() {
  const mobile = useIsMobile()
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, mobile ? 1 : 1.5]}
    >
      <Suspense fallback={null}>
        <SprayMist
          count={mobile ? 80 : 200}
          color="#cc0000"
          seedOffset={0}
        />
        <SprayMist
          count={mobile ? 40 : 100}
          color="#ff4444"
          seedOffset={1}
        />
        <HazeParticles count={mobile ? 50 : 120} />
      </Suspense>
    </Canvas>
  )
}
