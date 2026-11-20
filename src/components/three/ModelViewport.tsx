import {
  Bounds,
  Environment,
  Grid,
  Lightformer,
  OrbitControls,
  RoundedBox,
  useGLTF,
} from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Component, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, Box, Maximize2, RotateCcw } from 'lucide-react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { Mesh, MeshStandardMaterial, Texture } from 'three'
import type { Group } from 'three'
import type { LightingPreset, MaterialSettings, ModelTransform } from '../../store/useAppStore'
import './ModelViewport.css'

export type SampleModelKind = 'chair' | 'robot' | 'tower'

type ModelViewportProps = {
  className?: string
  modelKind?: SampleModelKind
  modelUrl?: string
  modelScene?: Group
  showTitle?: boolean
  onSceneReady?: (scene: Group | null) => void
  transform?: ModelTransform
  materialSettings?: MaterialSettings
  lightingPreset?: LightingPreset
  backgroundColor?: string
  wireframe?: boolean
  onWireframeChange?: (wireframe: boolean) => void
  gridVisible?: boolean
  onGridVisibleChange?: (visible: boolean) => void
  axesVisible?: boolean
  onAxesVisibleChange?: (visible: boolean) => void
}

const defaultTransform: ModelTransform = { x: 0, y: 0, z: 0, rotation: 0, scale: 1 }
const defaultMaterial: MaterialSettings = { color: '#a78bfa', roughness: 0.34, metallic: 0.16 }

const lightingSettings: Record<LightingPreset, {
  ambient: number
  key: number
  fill: number
  keyColor: string
  fillColor: string
}> = {
  Studio: { ambient: 0.55, key: 3.2, fill: 1.4, keyColor: '#fff4e6', fillColor: '#8da7ff' },
  Softbox: { ambient: 0.8, key: 2.2, fill: 1.1, keyColor: '#f4f0ff', fillColor: '#b7c8ff' },
  Dramatic: { ambient: 0.28, key: 4.2, fill: 0.55, keyColor: '#ffe2c2', fillColor: '#6150b5' },
  Cool: { ambient: 0.55, key: 2.8, fill: 1.8, keyColor: '#dcecff', fillColor: '#60a5fa' },
}

function disposeObject(object: Group) {
  object.traverse((child) => {
    if (!(child instanceof Mesh)) return
    child.geometry?.dispose()
    const materials = Array.isArray(child.material) ? child.material : [child.material]
    materials.forEach((material) => {
      if (!material) return
      Object.values(material).forEach((value) => {
        if (value instanceof Texture) value.dispose()
      })
      material.dispose()
    })
  })
}

function LoadedModel({
  url,
  wireframe,
  onLoaded,
}: {
  url: string
  wireframe: boolean
  onLoaded: () => void
}) {
  const gltf = useGLTF(url)
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene])

  useEffect(() => {
    scene.traverse((child) => {
      if (!(child instanceof Mesh)) return
      child.castShadow = true
      child.receiveShadow = true
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => {
        if (material instanceof MeshStandardMaterial) material.wireframe = wireframe
      })
    })
    onLoaded()
  }, [scene, wireframe, onLoaded])

  useEffect(() => () => {
    disposeObject(scene)
    useGLTF.clear(url)
  }, [scene, url])

  return <primitive object={scene} />
}

function ChairModel({ wireframe }: { wireframe: boolean }) {
  return (
    <group rotation={[0, -0.35, 0]}>
      <RoundedBox args={[2.2, 0.42, 2]} radius={0.18} position={[0, -0.25, 0]} castShadow>
        <meshStandardMaterial wireframe={wireframe} color="#9d8ce0" roughness={0.28} metalness={0.12} />
      </RoundedBox>
      <RoundedBox args={[2.15, 1.65, 0.32]} radius={0.16} position={[0, 0.78, -0.85]} rotation={[-0.12, 0, 0]} castShadow>
        <meshStandardMaterial wireframe={wireframe} color="#b7a8ef" roughness={0.32} />
      </RoundedBox>
      {[-0.82, 0.82].map((x) => (
        <mesh key={x} position={[x, -1.05, 0.65]} rotation={[0.12, 0, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.13, 1.45, 16]} />
          <meshStandardMaterial wireframe={wireframe} color="#5c526f" roughness={0.25} metalness={0.65} />
        </mesh>
      ))}
    </group>
  )
}

function RobotModel({ wireframe }: { wireframe: boolean }) {
  return (
    <group rotation={[0, -0.25, 0]}>
      <RoundedBox args={[1.5, 1.25, 1.2]} radius={0.32} position={[0, -0.35, 0]} castShadow>
        <meshStandardMaterial wireframe={wireframe} color="#79a7d8" roughness={0.22} metalness={0.35} />
      </RoundedBox>
      <mesh position={[0, 0.95, 0]} castShadow>
        <sphereGeometry args={[0.72, 32, 24]} />
        <meshStandardMaterial wireframe={wireframe} color="#c4d7ef" roughness={0.18} metalness={0.45} />
      </mesh>
      {[-0.24, 0.24].map((x) => (
        <mesh key={x} position={[x, 1.02, 0.62]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#111827" emissive="#82b7ff" emissiveIntensity={2} />
        </mesh>
      ))}
      {[-1.05, 1.05].map((x) => (
        <mesh key={x} position={[x, -0.35, 0]} rotation={[0, 0, x > 0 ? -0.18 : 0.18]} castShadow>
          <capsuleGeometry args={[0.22, 1.25, 8, 16]} />
          <meshStandardMaterial wireframe={wireframe} color="#9cb6d3" roughness={0.28} metalness={0.3} />
        </mesh>
      ))}
      {[-0.48, 0.48].map((x) => (
        <mesh key={x} position={[x, -1.55, 0]} castShadow>
          <cylinderGeometry args={[0.28, 0.34, 0.65, 20]} />
          <meshStandardMaterial wireframe={wireframe} color="#668ab4" roughness={0.25} metalness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

function TowerModel({ wireframe }: { wireframe: boolean }) {
  return (
    <group rotation={[0, 0.2, 0]}>
      <RoundedBox args={[2.15, 2.8, 1.45]} radius={0.12} position={[0, -0.1, 0]} castShadow>
        <meshStandardMaterial wireframe={wireframe} color="#77b7a7" roughness={0.32} metalness={0.08} />
      </RoundedBox>
      <RoundedBox args={[1.5, 1.75, 0.08]} radius={0.04} position={[0, -0.28, 0.76]} castShadow>
        <meshStandardMaterial wireframe={wireframe} color="#1a3837" roughness={0.22} metalness={0.2} />
      </RoundedBox>
      {[-0.72, 0, 0.72].map((x) => (
        <mesh key={x} position={[x, 0.55, 0.82]}>
          <boxGeometry args={[0.42, 0.52, 0.08]} />
          <meshStandardMaterial wireframe={wireframe} color="#b9ded5" emissive="#7fd1bc" emissiveIntensity={0.15} />
        </mesh>
      ))}
      <mesh position={[0, 1.75, 0]} castShadow>
        <coneGeometry args={[0.9, 0.75, 4]} />
        <meshStandardMaterial wireframe={wireframe} color="#95ccc0" roughness={0.3} />
      </mesh>
    </group>
  )
}

function ProceduralScene({
  kind,
  url,
  modelScene,
  wireframe,
  onLoaded,
  onSceneReady,
  transform,
  materialSettings,
}: {
  kind: SampleModelKind
  url?: string
  modelScene?: Group
  wireframe: boolean
  onLoaded: () => void
  onSceneReady?: (scene: Group | null) => void
  transform: ModelTransform
  materialSettings: MaterialSettings
}) {
  const sceneRef = useRef<Group>(null)
  const disposeTimer = useRef<number | null>(null)
  const clonedModel = useMemo(() => modelScene?.clone(true), [modelScene])
  const previousMaterialModel = useRef<Group | undefined>(undefined)
  const previousMaterialSettings = useRef<MaterialSettings | undefined>(undefined)

  useEffect(() => {
    const isNewImportedModel = Boolean(clonedModel && previousMaterialModel.current !== clonedModel)
    const shouldApplyMaterialSettings = !clonedModel || (
      !isNewImportedModel &&
      previousMaterialSettings.current !== undefined &&
      (
        previousMaterialSettings.current.color !== materialSettings.color ||
        previousMaterialSettings.current.roughness !== materialSettings.roughness ||
        previousMaterialSettings.current.metallic !== materialSettings.metallic
      )
    )
    previousMaterialModel.current = clonedModel
    previousMaterialSettings.current = { ...materialSettings }

    sceneRef.current?.traverse((child) => {
      if (!(child instanceof Mesh)) return
      const materials = Array.isArray(child.material) ? child.material : [child.material]
      materials.forEach((material) => {
        if (!(material instanceof MeshStandardMaterial)) return
        if (shouldApplyMaterialSettings) {
          material.color.set(materialSettings.color)
          material.roughness = materialSettings.roughness
          material.metalness = materialSettings.metallic
        }
        material.wireframe = wireframe
        if (shouldApplyMaterialSettings) material.needsUpdate = true
      })
    })
  }, [clonedModel, kind, url, wireframe, materialSettings])

  useEffect(() => {
    if (disposeTimer.current !== null) {
      window.clearTimeout(disposeTimer.current)
      disposeTimer.current = null
    }
    const scene = sceneRef.current
    if (!scene) return
    onSceneReady?.(scene)
    return () => {
      onSceneReady?.(null)
      if (clonedModel) {
        disposeTimer.current = window.setTimeout(() => {
          disposeObject(clonedModel)
          disposeTimer.current = null
        }, 0)
      }
    }
  }, [clonedModel, onSceneReady])

  return (
    <group
      ref={sceneRef}
      position={[transform.x, transform.y, transform.z]}
      rotation={[0, (transform.rotation * Math.PI) / 180, 0]}
      scale={transform.scale}
    >
      {clonedModel ? (
        <Bounds fit clip observe margin={1.35}>
          <primitive object={clonedModel} />
        </Bounds>
      ) : url ? (
        <Bounds fit clip observe margin={1.35}>
          <LoadedModel url={url} wireframe={wireframe} onLoaded={onLoaded} />
        </Bounds>
      ) : (
        <Bounds fit clip observe margin={1.35}>
          {kind === 'chair' && <ChairModel wireframe={wireframe} />}
          {kind === 'robot' && <RobotModel wireframe={wireframe} />}
          {kind === 'tower' && <TowerModel wireframe={wireframe} />}
        </Bounds>
      )}
    </group>
  )
}

function LoadingFallback() {
  return (
    <div className="mv-overlay mv-loading">
      <div className="mv-message">
        <span className="mv-spinner" />
        Loading 3D model...
      </div>
    </div>
  )
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; onRetry: () => void },
  { error: Error | null }
> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Model viewport failed to render', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="mv-overlay mv-error">
        <div className="mv-error-content">
          <AlertTriangle className="mv-error-icon" />
          <h3>This model could not be loaded</h3>
          <p>{this.state.error.message}</p>
          <button type="button" onClick={this.props.onRetry}>Retry</button>
        </div>
      </div>
    )
  }
}

export function ModelViewport({
  className = '',
  modelKind = 'chair',
  modelUrl,
  modelScene,
  showTitle = true,
  onSceneReady,
  transform = defaultTransform,
  materialSettings = defaultMaterial,
  lightingPreset = 'Studio',
  backgroundColor = '#0b0b10',
  wireframe: controlledWireframe,
  onWireframeChange,
  gridVisible: controlledGridVisible,
  onGridVisibleChange,
  axesVisible: controlledAxesVisible,
  onAxesVisibleChange,
}: ModelViewportProps) {
  const [localWireframe, setLocalWireframe] = useState(false)
  const [localGridVisible, setLocalGridVisible] = useState(true)
  const [localAxesVisible, setLocalAxesVisible] = useState(false)
  const [resetKey, setResetKey] = useState(0)
  const [loadedModelUrl, setLoadedModelUrl] = useState<string>()
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)

  const wireframe = controlledWireframe ?? localWireframe
  const gridVisible = controlledGridVisible ?? localGridVisible
  const axesVisible = controlledAxesVisible ?? localAxesVisible
  const loading = Boolean(modelUrl && loadedModelUrl !== modelUrl)
  const handleLoaded = useCallback(() => setLoadedModelUrl(modelUrl), [modelUrl])
  const lights = lightingSettings[lightingPreset]

  const resetCamera = () => {
    controlsRef.current?.reset()
    setResetKey((value) => value + 1)
  }

  const toggleFullscreen = async () => {
    if (!containerRef.current) return
    if (document.fullscreenElement) await document.exitFullscreen()
    else await containerRef.current.requestFullscreen()
  }

  const toggleWireframe = () => {
    const next = !wireframe
    onWireframeChange?.(next)
    if (controlledWireframe === undefined) setLocalWireframe(next)
  }

  const toggleGrid = () => {
    const next = !gridVisible
    onGridVisibleChange?.(next)
    if (controlledGridVisible === undefined) setLocalGridVisible(next)
  }

  const toggleAxes = () => {
    const next = !axesVisible
    onAxesVisibleChange?.(next)
    if (controlledAxesVisible === undefined) setLocalAxesVisible(next)
  }

  return (
    <div ref={containerRef} className={`mv-viewport ${className}`}>
      {showTitle && (
        <div className="mv-title">
          <Box />
          <span>Live 3D preview</span>
        </div>
      )}
      <div className="mv-toolbar">
        <button type="button" onClick={resetCamera} title="Reset camera" aria-label="Reset camera"><RotateCcw /></button>
        <button type="button" onClick={toggleWireframe} title="Toggle wireframe" aria-label="Toggle wireframe" className={wireframe ? 'is-active' : ''}><span className="mv-wireframe-icon" /></button>
        <button type="button" onClick={toggleGrid} title="Toggle grid" aria-label="Toggle grid" className={gridVisible ? 'is-active' : ''}>G</button>
        <button type="button" onClick={toggleAxes} title="Toggle axes" aria-label="Toggle axes" className={axesVisible ? 'is-active' : ''}>XYZ</button>
        <button type="button" onClick={toggleFullscreen} title="Fullscreen" aria-label="Fullscreen"><Maximize2 /></button>
      </div>
      {loading && modelUrl && <LoadingFallback />}
      <ModelErrorBoundary key={`${modelUrl ?? modelScene?.uuid ?? modelKind}-${resetKey}`} onRetry={() => setResetKey((value) => value + 1)}>
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          camera={{ position: [4.5, 3.2, 5.5], fov: 38, near: 0.1, far: 100 }}
        >
          <color attach="background" args={[backgroundColor]} />
          <fog attach="fog" args={[backgroundColor, 12, 24]} />
          <ambientLight intensity={lights.ambient} />
          <hemisphereLight args={['#c4b5fd', '#172033', 1.2]} />
          <directionalLight position={[5, 8, 5]} intensity={lights.key} color={lights.keyColor} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
          <directionalLight position={[-5, 2, -3]} intensity={lights.fill} color={lights.fillColor} />
          <Environment resolution={256}>
            <Lightformer form="rect" intensity={2} position={[0, 5, -6]} scale={[10, 10, 1]} color="#a78bfa" />
            <Lightformer form="ring" intensity={1.2} position={[5, 2, 4]} scale={4} color="#60a5fa" />
          </Environment>
          {gridVisible && (
            <Grid position={[0, -1.85, 0]} args={[20, 20]} cellSize={0.5} sectionSize={2.5} cellThickness={0.45} sectionThickness={0.9} sectionColor="#4b4565" cellColor="#29283a" fadeDistance={18} infiniteGrid />
          )}
          {axesVisible && <axesHelper args={[3]} />}
          <Suspense fallback={null}>
            <ProceduralScene
              kind={modelKind}
              url={modelUrl}
              modelScene={modelScene}
              wireframe={wireframe}
              onLoaded={handleLoaded}
              onSceneReady={onSceneReady}
              transform={transform}
              materialSettings={materialSettings}
            />
          </Suspense>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.87, 0]} receiveShadow>
            <planeGeometry args={[30, 30]} />
            <shadowMaterial transparent opacity={0.28} />
          </mesh>
          <OrbitControls ref={controlsRef} key={resetKey} makeDefault enablePan enableZoom enableRotate minDistance={2.5} maxDistance={12} target={[0, 0, 0]} />
        </Canvas>
      </ModelErrorBoundary>
    </div>
  )
}
