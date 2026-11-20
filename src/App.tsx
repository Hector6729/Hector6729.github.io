import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import {
  Box,
  Compass,
  ImagePlus,
  Layers3,
  LoaderCircle,
  Move3d,
  RotateCcw,
  Sparkles,
  Upload,
  WandSparkles,
} from 'lucide-react'
import { ModelViewport } from './components/three/ModelViewport'
import type { SampleModelKind } from './components/three/ModelViewport'
import { useAppStore } from './store/useAppStore'
import type { LightingPreset, StylePreset, StudioTool } from './store/useAppStore'
import type { Group } from 'three'
import { exportModelFile, importLocalModelFiles } from './utils/modelIO'
import type { ImportedModel } from './utils/modelIO'
import './App.css'

const sampleModels: Array<{ kind: SampleModelKind; name: string; category: string }> = [
  { kind: 'chair', name: 'Luma Lounge', category: 'Furniture' },
  { kind: 'robot', name: 'Nebula Explorer', category: 'Character' },
  { kind: 'tower', name: 'Glass Haven', category: 'Architecture' },
]

const tools: Array<{ id: StudioTool; label: string; icon: typeof Box }> = [
  { id: 'text', label: 'Text-to-3D', icon: WandSparkles },
  { id: 'image', label: 'Image-to-3D', icon: ImagePlus },
  { id: 'models', label: 'My models', icon: Layers3 },
  { id: 'explore', label: 'Explore', icon: Compass },
]

const stylePresets: StylePreset[] = ['Studio', 'Stylized', 'Clay', 'Low poly']
const lightingPresets: LightingPreset[] = ['Studio', 'Softbox', 'Dramatic', 'Cool']
const transformFields = [
  { key: 'x', label: 'X' },
  { key: 'y', label: 'Y' },
  { key: 'z', label: 'Z' },
] as const

function App() {
  const editor = useAppStore()
  const [importedModel, setImportedModel] = useState<ImportedModel | null>(null)
  const [referenceName, setReferenceName] = useState('')
  const [referenceUrl, setReferenceUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [exportingFormat, setExportingFormat] = useState<'glb' | 'gltf' | null>(null)
  const [exportMessage, setExportMessage] = useState('')
  const generationTimer = useRef<number | null>(null)
  const importSequence = useRef(0)
  const importedModelRef = useRef<ImportedModel | null>(null)
  const [exportScene, setExportScene] = useState<Group | null>(null)
  const activeModel = sampleModels.find((sample) => sample.kind === editor.activeModelKind) ?? sampleModels[0]
  const browsingModels = editor.activeTool === 'models' || editor.activeTool === 'explore'
  const canGenerate = Boolean(editor.prompt.trim() || (editor.activeTool === 'image' && referenceName))
  const displayedModelName = importedModel?.fileName ?? activeModel.name

  useEffect(() => () => {
    if (generationTimer.current !== null) window.clearTimeout(generationTimer.current)
  }, [])

  useEffect(() => () => {
    importSequence.current += 1
    importedModelRef.current?.release()
  }, [])

  useEffect(() => () => {
    if (referenceUrl) URL.revokeObjectURL(referenceUrl)
  }, [referenceUrl])

  const replaceImportedModel = (model: ImportedModel | null) => {
    const previousModel = importedModelRef.current
    importedModelRef.current = model
    setImportedModel(model)
    if (previousModel && previousModel !== model) previousModel.release()
  }

  const selectModel = (kind: SampleModelKind) => {
    importSequence.current += 1
    replaceImportedModel(null)
    editor.clearImport()
    setExportMessage('')
    editor.setActiveModelKind(kind)
    editor.setGeneration('idle')
  }

  const handleImport = async (files: File[]) => {
    const currentImport = ++importSequence.current
    const primaryFile = files.find((file) => /\.(glb|gltf)$/i.test(file.name))
    editor.startImport(primaryFile?.name ?? files[0]?.name ?? 'model file')
    setExportMessage('')

    try {
      const imported = await importLocalModelFiles(files, (progress) => {
        if (currentImport === importSequence.current) editor.setImportProgress(progress)
      })
      if (currentImport !== importSequence.current) {
        imported.release()
        return
      }
      replaceImportedModel(imported)
      editor.completeImport(imported.fileName)
      editor.setGeneration('idle')
    } catch (error) {
      if (currentImport !== importSequence.current) return
      editor.failImport(error instanceof Error ? error.message : 'The selected model could not be imported.')
    }
  }

  const onSceneReady = useCallback((scene: Group | null) => {
    setExportScene(scene)
  }, [])

  const handleExport = async (format: 'glb' | 'gltf') => {
    const scene = exportScene
    if (!scene) {
      setExportMessage('The 3D preview is still loading. Try exporting again in a moment.')
      return
    }

    setExportingFormat(format)
    setExportMessage('')
    try {
      await exportModelFile(scene, format, displayedModelName)
      setExportMessage(`${format.toUpperCase()} export downloaded to your device.`)
    } catch (error) {
      setExportMessage(error instanceof Error ? `Export failed: ${error.message}` : 'Export failed. Try again.')
    } finally {
      setExportingFormat(null)
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    if (event.dataTransfer.types.includes('Files')) setIsDragging(true)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (event.dataTransfer.files.length > 0) void handleImport(Array.from(event.dataTransfer.files))
  }

  const handleGenerate = () => {
    if (!canGenerate || editor.generationStatus === 'generating') return
    editor.setGeneration('generating', 'Preparing a sample model preview...')
    generationTimer.current = window.setTimeout(() => {
      const prompt = editor.prompt.toLowerCase()
      const nextModel = prompt.match(/robot|character|mascot/) ? sampleModels[1]
        : prompt.match(/building|tower|architecture|house/) ? sampleModels[2]
          : prompt.match(/chair|furniture|seat/) ? sampleModels[0]
            : sampleModels[(sampleModels.findIndex((sample) => sample.kind === editor.activeModelKind) + 1) % sampleModels.length]
      selectModel(nextModel.kind)
      editor.setGeneration(
        'complete',
        `Demo preview ready: ${nextModel.name}. AI generation is not connected.`,
      )
    }, 1100)
  }

  const resetTransform = () => {
    editor.setTransform('x', 0)
    editor.setTransform('y', 0)
    editor.setTransform('z', 0)
    editor.setTransform('rotation', 0)
    editor.setTransform('scale', 1)
  }

  return (
    <div
      className="studio-shell"
      onDragEnter={(event) => {
        if (event.dataTransfer.types.includes('Files')) setIsDragging(true)
      }}
      onDragOver={handleDragOver}
      onDragLeave={(event) => {
        const relatedTarget = event.relatedTarget
        if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) setIsDragging(false)
      }}
      onDrop={handleDrop}
    >
      <aside className="studio-sidebar">
        <div className="studio-brand">
          <span className="studio-brand-mark"><Box aria-hidden="true" /></span>
          <span>Modelly<span className="brand-muted">.me</span></span>
        </div>

        <div className="sidebar-label">CREATE</div>
        <nav className="studio-nav" aria-label="Studio tools">
          {tools.map(({ id, label, icon: Icon }) => (
            <button
              className={`studio-nav-item ${editor.activeTool === id ? 'active' : ''}`}
              key={id}
              type="button"
              onClick={() => editor.setActiveTool(id)}
              aria-current={editor.activeTool === id ? 'page' : undefined}
              title={label}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="demo-card">
          <div className="demo-card-icon"><Sparkles aria-hidden="true" /></div>
          <strong>Studio demo</strong>
          <p>AI generation is not connected. Explore with sample models.</p>
        </div>
        <div className="studio-profile">
          <div className="profile-avatar">AP</div>
          <div className="profile-copy"><strong>Alex Parker</strong><span>Personal workspace</span></div>
          <span className="profile-menu" aria-hidden="true">···</span>
        </div>
      </aside>

      <header className="studio-header">
        <div className="breadcrumbs"><span>Workspace</span><span className="breadcrumb-separator">/</span><strong>3D Studio</strong></div>
        <div className="header-status">
          <span className="demo-status"><span />Demo mode</span>
          <span className="header-divider" />
          <div className="header-avatar">AP</div>
        </div>
      </header>

      <main className="studio-main">
        <div className="canvas-heading">
          <div>
            <p className="eyebrow">{browsingModels ? (editor.activeTool === 'models' ? 'YOUR LIBRARY' : 'COMMUNITY PICKS') : 'MODEL WORKSPACE'}</p>
            <h1>{displayedModelName}</h1>
          </div>
          <div className="canvas-heading-meta">
            <span className="sample-tag"><span />{importedModel ? 'Imported locally' : 'Sample model'}</span>
            <span className="model-dimensions">3D preview</span>
            <label className="import-button" title="Select a GLB or GLTF and any local dependency files">
              <Upload aria-hidden="true" />
              Import model
              <input
                type="file"
                accept=".glb,.gltf,.bin,.png,.jpg,.jpeg,.webp,.ktx2"
                multiple
                aria-label="Import GLB or GLTF model"
                onChange={(event) => {
                  const files = Array.from(event.currentTarget.files ?? [])
                  event.currentTarget.value = ''
                  if (files.length > 0) void handleImport(files)
                }}
              />
            </label>
          </div>
        </div>

        {editor.importStatus === 'loading' && (
          <div className="file-feedback importing" role="status" aria-live="polite">
            <span>Importing {editor.importTargetName}...</span>
            <progress max="100" value={editor.importProgress} />
            <strong>{Math.round(editor.importProgress)}%</strong>
          </div>
        )}
        {editor.importStatus === 'ready' && (
          <div className="file-feedback success" role="status">{editor.importedFileName} loaded locally.</div>
        )}
        {editor.importStatus === 'error' && (
          <div className="file-feedback error" role="alert">Import failed: {editor.importError}</div>
        )}

        {browsingModels && (
          <div className="sample-browser" aria-label={editor.activeTool === 'models' ? 'Your sample models' : 'Explore sample models'}>
            {sampleModels.map((sample) => (
              <button
                type="button"
                key={sample.kind}
                onClick={() => selectModel(sample.kind)}
                className={`browser-card ${editor.activeModelKind === sample.kind ? 'selected' : ''}`}
              >
                <span className={`browser-art browser-art-${sample.kind}`}><span /></span>
                <span className="browser-card-copy"><strong>{sample.name}</strong><small>{sample.category}</small></span>
              </button>
            ))}
          </div>
        )}

        <div className={`viewport-wrap ${isDragging ? 'dragging' : ''}`}>
          <ModelViewport
            className="studio-viewport"
            modelKind={editor.activeModelKind}
            modelScene={importedModel?.scene}
            showTitle={false}
            onSceneReady={onSceneReady}
            transform={editor.transform}
            materialSettings={editor.material}
            lightingPreset={editor.lightingPreset}
            backgroundColor={editor.backgroundColor}
            wireframe={editor.wireframe}
            onWireframeChange={editor.setWireframe}
            gridVisible={editor.gridVisible}
            onGridVisibleChange={editor.setGridVisible}
            axesVisible={editor.axesVisible}
            onAxesVisibleChange={editor.setAxesVisible}
          />
          <div className="viewport-hint"><Move3d aria-hidden="true" /> Drag to orbit <span>·</span> Scroll to zoom</div>
          {isDragging && <div className="drop-overlay"><Upload aria-hidden="true" /><strong>Drop a GLB or GLTF model</strong><span>Files stay on your device</span></div>}
        </div>

        <section className="prompt-dock" aria-label="Model generation">
          {editor.generationStatus !== 'idle' && (
            <div className={`generation-status ${editor.generationStatus}`} role="status" aria-live="polite">
              {editor.generationStatus === 'generating' ? <LoaderCircle className="status-spinner" /> : <Sparkles />}
              <span>{editor.generationMessage}</span>
            </div>
          )}
          <div className="prompt-dock-header">
            <div className="prompt-mode"><WandSparkles aria-hidden="true" />{editor.activeTool === 'image' ? 'Image-to-3D' : 'Text-to-3D'}<span>DEMO</span></div>
            {editor.activeTool === 'image' && (
              <label className="upload-button">
                <Upload aria-hidden="true" />
                {referenceName ? 'Change image' : 'Add reference image'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    setReferenceName(file.name)
                    setReferenceUrl(URL.createObjectURL(file))
                  }}
                />
              </label>
            )}
            <button
              type="button"
              className="negative-toggle"
              onClick={() => editor.setShowNegativePrompt(!editor.showNegativePrompt)}
              aria-expanded={editor.showNegativePrompt}
            >
              {editor.showNegativePrompt ? '− Remove negative prompt' : '+ Negative prompt'}
            </button>
          </div>

          {referenceUrl && editor.activeTool === 'image' && (
            <div className="reference-preview">
              <img src={referenceUrl} alt="Selected reference" />
              <span>{referenceName}</span>
              <button
                type="button"
                onClick={() => {
                  URL.revokeObjectURL(referenceUrl)
                  setReferenceUrl('')
                  setReferenceName('')
                }}
                aria-label="Remove reference image"
              >×</button>
            </div>
          )}

          <textarea
            value={editor.prompt}
            onChange={(event) => editor.setPrompt(event.target.value)}
            placeholder={editor.activeTool === 'image' ? 'Describe how to transform your reference into a 3D model...' : 'Describe the 3D model you want to create...'}
            aria-label="Model prompt"
            rows={2}
          />
          {editor.showNegativePrompt && (
            <input
              className="negative-input"
              value={editor.negativePrompt}
              onChange={(event) => editor.setNegativePrompt(event.target.value)}
              placeholder="What should the model avoid?"
              aria-label="Negative prompt"
            />
          )}
          <div className="prompt-dock-footer">
            <div className="style-selector" aria-label="Style presets">
              <span className="style-label">STYLE</span>
              {stylePresets.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  className={`style-chip ${editor.stylePreset === preset ? 'selected' : ''}`}
                  onClick={() => editor.setStylePreset(preset)}
                  aria-pressed={editor.stylePreset === preset}
                >{preset}</button>
              ))}
            </div>
            <button type="button" className="generate-button" onClick={handleGenerate} disabled={!canGenerate || editor.generationStatus === 'generating'}>
              {editor.generationStatus === 'generating' ? <LoaderCircle className="status-spinner" /> : <Sparkles />}
              {editor.generationStatus === 'generating' ? 'Generating...' : 'Generate preview'}
              <span className="generate-beta">DEMO</span>
            </button>
          </div>
          <p className="prompt-disclaimer">Demo mode · Generates a preview using bundled sample models. No AI generation is performed.</p>
        </section>
      </main>

      <aside className="inspector">
        <div className="inspector-header">
          <div><p className="eyebrow">EDIT MODEL</p><h2>Properties</h2></div>
          <button type="button" className="reset-button" onClick={editor.resetProperties} title="Reset all properties" aria-label="Reset all properties"><RotateCcw /></button>
        </div>

        <section className="inspector-section model-properties">
          <label htmlFor="model-select">Selected model</label>
          <select id="model-select" value={importedModel ? '__local' : editor.activeModelKind} onChange={(event) => {
            if (event.target.value !== '__local') selectModel(event.target.value as SampleModelKind)
          }}>
            {importedModel && <option value="__local">{importedModel.fileName}</option>}
            {sampleModels.map((sample) => <option key={sample.kind} value={sample.kind}>{sample.name}</option>)}
          </select>
          <div className="property-summary"><span>Type</span><strong>{importedModel ? '3D model' : activeModel.category}</strong></div>
          <div className="property-summary"><span>Source</span><strong>{importedModel ? 'Local file' : 'Sample library'}</strong></div>
          <div className="model-export-actions">
            <span>Export model</span>
            <div>
              <button type="button" onClick={() => void handleExport('glb')} disabled={!exportScene || exportingFormat !== null}>
                {exportingFormat === 'glb' ? 'Exporting…' : 'GLB'}
              </button>
              <button type="button" onClick={() => void handleExport('gltf')} disabled={!exportScene || exportingFormat !== null}>
                {exportingFormat === 'gltf' ? 'Exporting…' : 'GLTF'}
              </button>
            </div>
            {exportMessage && <p className={exportMessage.startsWith('Export failed') ? 'export-message error' : 'export-message'} role="status">{exportMessage}</p>}
          </div>
        </section>

        <section className="inspector-section">
          <div className="section-title"><span><Move3d />Transform</span><button type="button" onClick={resetTransform} title="Reset transform" aria-label="Reset transform"><RotateCcw /></button></div>
          <div className="axis-fields">
            {transformFields.map(({ key, label }) => (
              <label key={key}><span>{label}</span><input type="number" step="0.1" value={editor.transform[key]} onChange={(event) => editor.setTransform(key, Number(event.target.value))} aria-label={`Position ${label}`} /></label>
            ))}
          </div>
          <label className="slider-control">
            <span><span>Rotation</span><output>{editor.transform.rotation}°</output></span>
            <input type="range" min="-180" max="180" step="1" value={editor.transform.rotation} onChange={(event) => editor.setTransform('rotation', Number(event.target.value))} aria-label="Model rotation" />
          </label>
          <label className="slider-control">
            <span><span>Scale</span><output>{editor.transform.scale.toFixed(2)}×</output></span>
            <input type="range" min="0.4" max="2" step="0.01" value={editor.transform.scale} onChange={(event) => editor.setTransform('scale', Number(event.target.value))} aria-label="Model scale" />
          </label>
        </section>

        <section className="inspector-section">
          <div className="section-title"><span><span className="material-dot" />Material</span></div>
          <label className="color-control">
            <span>Base color</span>
            <span className="color-input-wrap"><input type="color" value={editor.material.color} onChange={(event) => editor.setMaterial('color', event.target.value)} aria-label="Material base color" /><code>{editor.material.color.toUpperCase()}</code></span>
          </label>
          <label className="slider-control">
            <span><span>Roughness</span><output>{editor.material.roughness.toFixed(2)}</output></span>
            <input type="range" min="0" max="1" step="0.01" value={editor.material.roughness} onChange={(event) => editor.setMaterial('roughness', Number(event.target.value))} aria-label="Material roughness" />
          </label>
          <label className="slider-control">
            <span><span>Metallic</span><output>{editor.material.metallic.toFixed(2)}</output></span>
            <input type="range" min="0" max="1" step="0.01" value={editor.material.metallic} onChange={(event) => editor.setMaterial('metallic', Number(event.target.value))} aria-label="Material metallic" />
          </label>
        </section>

        <section className="inspector-section">
          <div className="section-title"><span><Sparkles />Lighting</span></div>
          <div className="preset-grid">
            {lightingPresets.map((preset) => (
              <button key={preset} type="button" className={editor.lightingPreset === preset ? 'selected' : ''} onClick={() => editor.setLightingPreset(preset)} aria-pressed={editor.lightingPreset === preset}>{preset}</button>
            ))}
          </div>
        </section>

        <section className="inspector-section background-section">
          <div className="section-title"><span><span className="background-icon" />Background</span></div>
          <label className="color-control">
            <span>Canvas color</span>
            <span className="color-input-wrap"><input type="color" value={editor.backgroundColor} onChange={(event) => editor.setBackgroundColor(event.target.value)} aria-label="Canvas background color" /><code>{editor.backgroundColor.toUpperCase()}</code></span>
          </label>
          <label className="toggle-control"><span>Show grid</span><input type="checkbox" checked={editor.gridVisible} onChange={(event) => editor.setGridVisible(event.target.checked)} /></label>
          <label className="toggle-control"><span>Show axes</span><input type="checkbox" checked={editor.axesVisible} onChange={(event) => editor.setAxesVisible(event.target.checked)} /></label>
        </section>
      </aside>
    </div>
  )
}

export default App
