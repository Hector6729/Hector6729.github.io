import { create } from 'zustand'
import type { SampleModelKind } from '../components/three/ModelViewport'

export type StudioTool = 'text' | 'image' | 'models' | 'explore'
export type StylePreset = 'Studio' | 'Stylized' | 'Clay' | 'Low poly'
export type LightingPreset = 'Studio' | 'Softbox' | 'Dramatic' | 'Cool'
export type GenerationStatus = 'idle' | 'generating' | 'complete'
export type ImportStatus = 'idle' | 'loading' | 'ready' | 'error'

export type ModelTransform = {
  x: number
  y: number
  z: number
  rotation: number
  scale: number
}

export type MaterialSettings = {
  color: string
  roughness: number
  metallic: number
}

const initialTransform: ModelTransform = {
  x: 0,
  y: 0,
  z: 0,
  rotation: 0,
  scale: 1,
}

const initialMaterial: MaterialSettings = {
  color: '#a78bfa',
  roughness: 0.34,
  metallic: 0.16,
}

const styleMaterials: Record<StylePreset, MaterialSettings> = {
  Studio: { color: '#a78bfa', roughness: 0.34, metallic: 0.16 },
  Stylized: { color: '#60a5fa', roughness: 0.28, metallic: 0.32 },
  Clay: { color: '#d8a982', roughness: 0.82, metallic: 0 },
  'Low poly': { color: '#6ee7b7', roughness: 0.58, metallic: 0.04 },
}

type AppState = {
  activeTool: StudioTool
  activeModelKind: SampleModelKind
  prompt: string
  negativePrompt: string
  showNegativePrompt: boolean
  stylePreset: StylePreset
  generationStatus: GenerationStatus
  generationMessage: string
  transform: ModelTransform
  material: MaterialSettings
  lightingPreset: LightingPreset
  backgroundColor: string
  gridVisible: boolean
  wireframe: boolean
  axesVisible: boolean
  importStatus: ImportStatus
  importProgress: number
  importError: string
  importTargetName: string
  importedFileName: string
  setActiveTool: (tool: StudioTool) => void
  setActiveModelKind: (kind: SampleModelKind) => void
  setPrompt: (prompt: string) => void
  setNegativePrompt: (prompt: string) => void
  setShowNegativePrompt: (show: boolean) => void
  setStylePreset: (preset: StylePreset) => void
  setGeneration: (status: GenerationStatus, message?: string) => void
  setTransform: (key: keyof ModelTransform, value: number) => void
  setMaterial: (key: keyof MaterialSettings, value: string | number) => void
  setLightingPreset: (preset: LightingPreset) => void
  setBackgroundColor: (color: string) => void
  setGridVisible: (visible: boolean) => void
  setWireframe: (visible: boolean) => void
  setAxesVisible: (visible: boolean) => void
  startImport: (fileName: string) => void
  setImportProgress: (progress: number) => void
  completeImport: (fileName: string) => void
  failImport: (message: string) => void
  clearImport: () => void
  resetProperties: () => void
}

export const useAppStore = create<AppState>((set) => ({
  activeTool: 'text',
  activeModelKind: 'chair',
  prompt: '',
  negativePrompt: '',
  showNegativePrompt: false,
  stylePreset: 'Studio',
  generationStatus: 'idle',
  generationMessage: '',
  transform: { ...initialTransform },
  material: { ...initialMaterial },
  lightingPreset: 'Studio',
  backgroundColor: '#0b0b10',
  gridVisible: true,
  wireframe: false,
  axesVisible: false,
  importStatus: 'idle',
  importProgress: 0,
  importError: '',
  importTargetName: '',
  importedFileName: '',
  setActiveTool: (activeTool) => set({ activeTool }),
  setActiveModelKind: (activeModelKind) => set({ activeModelKind }),
  setPrompt: (prompt) => set({ prompt }),
  setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
  setShowNegativePrompt: (showNegativePrompt) => set({ showNegativePrompt }),
  setStylePreset: (stylePreset) => set({ stylePreset, material: { ...styleMaterials[stylePreset] } }),
  setGeneration: (generationStatus, generationMessage = '') => set({ generationStatus, generationMessage }),
  setTransform: (key, value) =>
    set((state) => ({ transform: { ...state.transform, [key]: value } })),
  setMaterial: (key, value) =>
    set((state) => ({ material: { ...state.material, [key]: value } })),
  setLightingPreset: (lightingPreset) => set({ lightingPreset }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setGridVisible: (gridVisible) => set({ gridVisible }),
  setWireframe: (wireframe) => set({ wireframe }),
  setAxesVisible: (axesVisible) => set({ axesVisible }),
  startImport: (fileName) =>
    set({ importStatus: 'loading', importProgress: 0, importError: '', importTargetName: fileName }),
  setImportProgress: (importProgress) => set({ importProgress }),
  completeImport: (fileName) =>
    set({ importStatus: 'ready', importProgress: 100, importError: '', importTargetName: '', importedFileName: fileName }),
  failImport: (importError) => set({ importStatus: 'error', importError, importTargetName: '' }),
  clearImport: () =>
    set({ importStatus: 'idle', importProgress: 0, importError: '', importTargetName: '', importedFileName: '' }),
  resetProperties: () =>
    set({
      transform: { ...initialTransform },
      material: { ...styleMaterials.Studio },
      stylePreset: 'Studio',
      lightingPreset: 'Studio',
      backgroundColor: '#0b0b10',
      gridVisible: true,
      wireframe: false,
      axesVisible: false,
    }),
}))
