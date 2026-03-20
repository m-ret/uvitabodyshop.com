'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useMemo } from 'react'
import * as THREE from 'three'

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 80

  const { positions, speeds, phases } = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const speeds: number[] = []
    const phases: number[] = []
    for (let i = 0; i < count; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 3
        )
      )
      speeds.push(0.15 + Math.random() * 0.25)
      phases.push(Math.random() * Math.PI * 2)
    }
    return { positions, speeds, phases }
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const pos = positions[i]
      dummy.position.set(
        pos.x + Math.sin(t * speeds[i] + phases[i]) * 0.3,
        pos.y + Math.cos(t * speeds[i] * 0.7 + phases[i]) * 0.4,
        pos.z + Math.sin(t * speeds[i] * 0.5 + phases[i]) * 0.2
      )
      const scale = 0.04 + Math.sin(t * speeds[i] + phases[i]) * 0.01
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // Split particles: 60% Pacific blue, 40% amber
  const blueColor = new THREE.Color('#1A5276')
  const amberColor = new THREE.Color('#E8A020')

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={blueColor}
        metalness={0.4}
        roughness={0.3}
        transparent
        opacity={0.55}
      />
    </instancedMesh>
  )
}

function ParticlesAmber() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const count = 35

  const { positions, speeds, phases } = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const speeds: number[] = []
    const phases: number[] = []
    for (let i = 0; i < count; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 7,
          (Math.random() - 0.5) * 5,
          (Math.random() - 0.5) * 2.5
        )
      )
      speeds.push(0.1 + Math.random() * 0.2)
      phases.push(Math.random() * Math.PI * 2)
    }
    return { positions, speeds, phases }
  }, [])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const pos = positions[i]
      dummy.position.set(
        pos.x + Math.cos(t * speeds[i] + phases[i]) * 0.35,
        pos.y + Math.sin(t * speeds[i] * 0.8 + phases[i]) * 0.3,
        pos.z
      )
      const scale = 0.025 + Math.cos(t * speeds[i] + phases[i]) * 0.008
      dummy.scale.setScalar(scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={new THREE.Color('#E8A020')}
        metalness={0.5}
        roughness={0.2}
        transparent
        opacity={0.45}
      />
    </instancedMesh>
  )
}

export function PaintParticleScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={2} color="#1A5276" />
      <pointLight position={[-4, -2, 2]} intensity={1.5} color="#E8A020" />

      <Suspense fallback={null}>
        <Particles />
        <ParticlesAmber />
      </Suspense>
    </Canvas>
  )
}
