'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { useRef, Suspense } from 'react'
import * as THREE from 'three'

function MetallicComposition() {
  const sphereRef = useRef<THREE.Mesh>(null)
  const ring1Ref = useRef<THREE.Mesh>(null)
  const ring2Ref = useRef<THREE.Mesh>(null)
  const ring3Ref = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (sphereRef.current) {
      sphereRef.current.rotation.y = t * 0.12
      sphereRef.current.rotation.x = Math.sin(t * 0.15) * 0.05
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = t * 0.35
      ring1Ref.current.rotation.x = Math.PI / 6 + Math.sin(t * 0.1) * 0.05
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.22
      ring2Ref.current.rotation.z = Math.PI / 4
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x = t * 0.18
      ring3Ref.current.rotation.y = Math.PI / 3
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05
      groupRef.current.position.y = Math.sin(t * 0.4) * 0.08
    }
  })

  const goldMaterial = (
    <meshStandardMaterial
      metalness={0.95}
      roughness={0.08}
      color="#c9a84c"
      envMapIntensity={1.8}
    />
  )

  const chromeMaterial = (
    <meshStandardMaterial
      metalness={1.0}
      roughness={0.02}
      color="#1c1c1e"
      envMapIntensity={3}
    />
  )

  const steelMaterial = (
    <meshStandardMaterial
      metalness={0.85}
      roughness={0.15}
      color="#4a5568"
      envMapIntensity={1.2}
    />
  )

  return (
    <group ref={groupRef}>
      {/* Central chrome sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.4, 128, 128]} />
        {chromeMaterial}
      </mesh>

      {/* Gold equatorial ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.1, 0.07, 16, 120]} />
        {goldMaterial}
      </mesh>

      {/* Steel diagonal ring */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.6, 0.045, 16, 120]} />
        {steelMaterial}
      </mesh>

      {/* Thin outer gold ring */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.1, 0.03, 16, 120]} />
        {goldMaterial}
      </mesh>

      {/* Orbiting gold spheres on equatorial ring */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 2.1, 0, Math.sin(angle) * 2.1]}
        >
          <sphereGeometry args={[0.1, 24, 24]} />
          {goldMaterial}
        </mesh>
      ))}

      {/* Industrial hex bolts around the sphere */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        return (
          <mesh
            key={`bolt-${i}`}
            position={[Math.cos(rad) * 1.6, Math.sin(rad) * 1.6, 0]}
            rotation={[0, 0, rad]}
          >
            <cylinderGeometry args={[0.04, 0.04, 0.18, 6]} />
            <meshStandardMaterial metalness={0.9} roughness={0.1} color="#c9a84c" />
          </mesh>
        )
      })}
    </group>
  )
}

export function MetallicScene() {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: 'transparent' }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.5, 6]} fov={45} />

      <ambientLight intensity={0.08} />
      <pointLight position={[4, 6, 4]} intensity={3} color="#c9a84c" />
      <pointLight position={[-6, -2, -4]} intensity={1.5} color="#4488ff" />
      <pointLight position={[0, -4, 2]} intensity={0.8} color="#ffffff" />
      <spotLight
        position={[0, 8, 0]}
        angle={0.4}
        penumbra={0.8}
        intensity={4}
        color="#fff8e7"
      />

      <Suspense fallback={null}>
        <MetallicComposition />
        <Environment preset="city" environmentIntensity={0.6} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </Canvas>
  )
}
