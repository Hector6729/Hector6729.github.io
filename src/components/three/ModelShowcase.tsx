import { Float, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'

function SculptedObject() {
  const group = useRef<Group>(null)

  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y = state.clock.elapsedTime * 0.12
  })

  return (
    <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.35}>
      <group ref={group} rotation={[0.2, -0.5, -0.08]} scale={1.15}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <torusKnotGeometry args={[1.15, 0.38, 220, 32, 2, 3]} />
          <meshStandardMaterial
            color="#9b87f5"
            metalness={0.78}
            roughness={0.18}
            emissive="#271a61"
            emissiveIntensity={0.32}
          />
        </mesh>
        <mesh position={[1.95, 1.15, -0.2]} castShadow>
          <icosahedronGeometry args={[0.42, 2]} />
          <meshStandardMaterial color="#62a8ff" metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[-1.65, -1.22, 0.3]} castShadow>
          <octahedronGeometry args={[0.46, 1]} />
          <meshStandardMaterial color="#c4b5fd" metalness={0.55} roughness={0.22} />
        </mesh>
      </group>
    </Float>
  )
}

export function ModelShowcase() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0.2, 6.6], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 5, 5]} intensity={3} color="#c4b5fd" />
        <pointLight position={[-5, -2, 3]} intensity={25} color="#3b82f6" distance={10} />
        <SculptedObject />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 2.7}
          maxPolarAngle={Math.PI / 1.65}
        />
      </Canvas>
    </div>
  )
}
