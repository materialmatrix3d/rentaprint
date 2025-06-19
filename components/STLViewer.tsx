'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'

function Model({ url }: { url: string }) {
  const geom = useLoader(STLLoader, url)
  return (
    <mesh geometry={geom} scale={0.01}>
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}

export default function STLViewer({ url }: { url: string }) {
  return (
    <Canvas style={{ height: 300 }}>
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <Model url={url} />
        <OrbitControls />
      </Suspense>
    </Canvas>
  )
}
