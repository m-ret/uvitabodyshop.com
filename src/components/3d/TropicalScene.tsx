'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, PerspectiveCamera } from '@react-three/drei'
import { useRef, Suspense, useMemo } from 'react'
import * as THREE from 'three'

function OrganicCore() {
  const coreRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.08
      coreRef.current.rotation.x = Math.sin(t * 0.1) * 0.08
    }
    if (wireRef.current) {
      wireRef.current.rotation.y = t * 0.11
      wireRef.current.rotation.z = Math.cos(t * 0.09) * 0.06
    }
  })

  return (
    <>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshStandardMaterial
          color="#2D6A4F"
          metalness={0.08}
          roughness={0.55}
          envMapIntensity={0.7}
        />
      </mesh>
      <mesh ref={wireRef}>
        <icosahedronGeometry args={[1.36, 2]} />
        <meshBasicMaterial color="#52B788" wireframe transparent opacity={0.13} />
      </mesh>
    </>
  )
}

function FloatingRings() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1
      groupRef.current.position.y = Math.sin(t * 0.22) * 0.1
    }
  })

  const rings: Array<{
    radius: number
    tube: number
    color: string
    rotation: [number, number, number]
  }> = [
    { radius: 2.2, tube: 0.06, color: '#E9C46A', rotation: [Math.PI / 6, 0, 0] },
    { radius: 2.6, tube: 0.045, color: '#40916C', rotation: [Math.PI / 3, Math.PI / 4, 0] },
    { radius: 2.9, tube: 0.035, color: '#F4A261', rotation: [Math.PI / 2.4, Math.PI / 2, 0] },
    { radius: 1.9, tube: 0.05, color: '#52B788', rotation: [Math.PI / 4, Math.PI / 3, Math.PI / 6] },
  ]

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={ring.rotation}>
          <torusGeometry args={[ring.radius, ring.tube, 12, 80]} />
          <meshStandardMaterial
            color={ring.color}
            metalness={0.15}
            roughness={0.5}
            envMapIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function TropicalParticles({
  count,
  color,
  spread,
}: {
  count: number
  color: string
  spread: number
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  const { positions, speeds, phases } = useMemo(() => {
    const positions: THREE.Vector3[] = []
    const speeds: number[] = []
    const phases: number[] = []
    for (let i = 0; i < count; i++) {
      positions.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread,
          (Math.random() - 0.5) * spread * 0.5
        )
      )
      speeds.push(0.08 + Math.random() * 0.18)
      phases.push(Math.random() * Math.PI * 2)
    }
    return { positions, speeds, phases }
  }, [count, spread])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime
    for (let i = 0; i < count; i++) {
      const pos = positions[i]
      dummy.position.set(
        pos.x + Math.sin(t * speeds[i] + phases[i]) * 0.28,
        pos.y + Math.cos(t * speeds[i] * 0.7 + phases[i]) * 0.32,
        pos.z + Math.sin(t * speeds[i] * 0.5) * 0.15
      )
      const scale = 0.03 + Math.sin(t * speeds[i] + phases[i]) * 0.01
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
        color={new THREE.Color(color)}
        transparent
        opacity={0.5}
        roughness={0.4}
      />
    </instancedMesh>
  )
}

export function TropicalScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.3, 6.5]} fov={42} />

      <ambientLight intensity={0.25} color="#c8e6c9" />
      <pointLight position={[5, 5, 5]} intensity={3.5} color="#F4A261" />
      <pointLight position={[-4, 2, 3]} intensity={2} color="#E9C46A" />
      <pointLight position={[0, -4, 2]} intensity={1.5} color="#52B788" />
      <spotLight
        position={[2, 8, 2]}
        angle={0.5}
        penumbra={0.9}
        intensity={3}
        color="#fff8e0"
      />

      <Suspense fallback={null}>
        <Float speed={0.7} rotationIntensity={0.2} floatIntensity={0.35}>
          <OrganicCore />
        </Float>
        <FloatingRings />
        <TropicalParticles count={60} color="#40916C" spread={8} />
        <TropicalParticles count={35} color="#E9C46A" spread={7} />
        <Environment preset="forest" environmentIntensity={0.4} />
      </Suspense>
    </Canvas>
  )
}
