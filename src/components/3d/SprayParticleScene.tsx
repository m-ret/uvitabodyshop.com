'use client'

import { Suspense, useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Paint spray mist particles that drift across the viewport.
 * Simulates the fine overspray inside a professional paint booth.
 * Two particle systems: fine white mist + colored paint particles.
 */
function SprayMist({
  count = 120,
  color = '#cc0000',
}: {
  count?: number
  color?: string
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const tempObject = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => {
    const offsets = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 16,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 6 - 3,
    }))
    const speeds = Array.from(
      { length: count },
      () => Math.random() * 0.15 + 0.05
    )
    const sizes = Array.from(
      { length: count },
      () => Math.random() * 0.06 + 0.025
    )
    const phases = Array.from(
      { length: count },
      () => Math.random() * Math.PI * 2
    )
    return { offsets, speeds, sizes, phases }
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime

    for (let i = 0; i < count; i++) {
      const { x, y, z } = data.offsets[i]
      const speed = data.speeds[i]
      const phase = data.phases[i]

      // Gentle drift with slight directional wind
      tempObject.position.set(
        x + Math.sin(t * speed * 0.7 + phase) * 0.5 + t * speed * 0.3,
        y + Math.cos(t * speed + phase) * 0.3,
        z + Math.sin(t * speed * 0.4 + phase * 2) * 0.2
      )

      // Wrap particles that drift too far right
      if (tempObject.position.x > 10) {
        tempObject.position.x = -10
      }

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

/**
 * Fine white haze particles — the ambient mist in a spray booth
 */
function HazeParticles({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const tempObject = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => {
    const offsets = Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 4 - 4,
    }))
    const speeds = Array.from(
      { length: count },
      () => Math.random() * 0.08 + 0.02
    )
    const phases = Array.from(
      { length: count },
      () => Math.random() * Math.PI * 2
    )
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

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    setMobile(window.innerWidth < 768)
  }, [])
  return mobile
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
        <SprayMist count={mobile ? 80 : 200} color="#cc0000" />
        <SprayMist count={mobile ? 40 : 100} color="#ff4444" />
        <HazeParticles count={mobile ? 50 : 120} />
      </Suspense>
    </Canvas>
  )
}
