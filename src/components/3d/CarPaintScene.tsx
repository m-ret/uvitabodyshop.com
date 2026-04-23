'use client'

import { Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { mulberry32 } from '@/lib/random'

const MIST_SEED = 0xc0ffee

/**
 * Cursor-following inspection light.
 */
function MouseTrackingLight() {
  const lightRef = useRef<THREE.PointLight>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1
      target.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const { viewport } = useThree()

  useFrame(() => {
    if (!lightRef.current) return
    current.current.x += (target.current.x - current.current.x) * 0.05
    current.current.y += (target.current.y - current.current.y) * 0.05
    lightRef.current.position.set(
      current.current.x * viewport.width * 0.6,
      current.current.y * viewport.height * 0.6,
      4
    )
  })

  return (
    <pointLight ref={lightRef} intensity={10} distance={16} color="#ffffff" />
  )
}

/**
 * Nissan GTR loaded from GLB.
 */
function CarBody({ paintColor = '#aa1515' }: { paintColor?: string }) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/car.glb')

  const paintMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: paintColor,
        metalness: 0.8,
        roughness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.01,
        reflectivity: 1.0,
        envMapIntensity: 2.0,
        side: THREE.DoubleSide,
      }),
    [paintColor]
  )

  const mouse = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const carScene = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = paintMat
      }
    })
    return cloned
  }, [scene, paintMat])

  useFrame(() => {
    if (!groupRef.current) return
    smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.03
    smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.03
    groupRef.current.rotation.x = smoothMouse.current.y * 0.08
    groupRef.current.rotation.z = smoothMouse.current.x * 0.05
  })

  return (
    <group ref={groupRef}>
      <primitive object={carScene} />
    </group>
  )
}

useGLTF.preload('/models/car.glb')

/**
 * Paint mist particles. Uses seeded PRNG for layout so particle positions
 * are stable across SSR / Suspense retries and pass the React 19 compiler.
 */
function PaintMist({
  count = 20,
  mistColor = '#cc3333',
}: {
  count?: number
  mistColor?: string
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const tempObject = useMemo(() => new THREE.Object3D(), [])

  const data = useMemo(() => {
    const rng = mulberry32(MIST_SEED)
    const offsets = Array.from({ length: count }, () => ({
      x: (rng() - 0.5) * 14,
      y: (rng() - 0.5) * 10,
      z: (rng() - 0.5) * 6 - 3,
    }))
    const speeds = Array.from({ length: count }, () => rng() * 0.25 + 0.08)
    return { offsets, speeds }
  }, [count])

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    for (let i = 0; i < count; i++) {
      const { x, y, z } = data.offsets[i]
      const t = clock.elapsedTime * data.speeds[i]
      tempObject.position.set(
        x + Math.cos(t * 0.5 + i) * 0.4,
        y + Math.sin(t + i) * 0.3,
        z
      )
      tempObject.scale.setScalar(0.014 + Math.sin(t * 2 + i) * 0.005)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={mistColor} transparent opacity={0.08} />
    </instancedMesh>
  )
}

/**
 * Responsive camera rig. Reads `size` from useThree and updates the
 * camera imperatively inside useFrame — the React 19 compiler treats
 * this as a side-effect boundary rather than a render-time mutation.
 */
function CameraRig() {
  const size = useThree((state) => state.size)

  useFrame(({ camera }) => {
    const cam = camera as THREE.PerspectiveCamera
    const targetFov = size.width < 640 ? 50 : size.width < 1024 ? 42 : 35
    const targetY = size.width < 640 ? 4.2 : 3.5
    if (cam.fov !== targetFov || cam.position.y !== targetY) {
      cam.fov = targetFov
      cam.position.y = targetY
      cam.updateProjectionMatrix()
    }
  })

  return null
}

export default function CarPaintScene({
  paintColor = '#aa1515',
  rimColor = '#cc1100',
  rimColor2 = '#ff4422',
  mistColor = '#cc3333',
}: {
  paintColor?: string
  rimColor?: string
  rimColor2?: string
  mistColor?: string
}) {
  return (
    <Canvas
      camera={{ position: [0, 3.5, 0], fov: 35 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.15} />

        <MouseTrackingLight />

        <directionalLight
          position={[5, 8, 5]}
          intensity={2}
          color="#ffffff"
        />

        <directionalLight
          position={[-4, 3, 3]}
          intensity={0.8}
          color="#ffffff"
        />

        <pointLight position={[-3, 1, -5]} intensity={4} color={rimColor} />
        <pointLight position={[4, 0, -3]} intensity={2} color={rimColor2} />

        <spotLight
          position={[0, 10, 3]}
          angle={0.3}
          penumbra={0.9}
          intensity={3}
          color="#ffffff"
        />

        <CameraRig />
        <CarBody paintColor={paintColor} />
        <PaintMist mistColor={mistColor} />
        <Environment preset="studio" />
      </Suspense>
    </Canvas>
  )
}
