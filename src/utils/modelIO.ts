import { LoadingManager, Object3D } from 'three'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

export type ImportedModel = {
  scene: GLTF['scene']
  fileName: string
  release: () => void
}

const modelExtension = /\.(glb|gltf)$/i

function normalizeResourcePath(path: string) {
  return decodeURIComponent(path.split(/[?#]/, 1)[0]).replace(/\\/g, '/').replace(/^\/+/, '')
}

function readFile(file: File, onProgress: (progress: number) => void) {
  return new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader()
    reader.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 20))
    }
    reader.onerror = () => reject(new Error(`Could not read "${file.name}".`))
    reader.onload = () => {
      if (!(reader.result instanceof ArrayBuffer)) {
        reject(new Error(`Could not read "${file.name}" as binary data.`))
        return
      }
      onProgress(20)
      resolve(reader.result)
    }
    reader.readAsArrayBuffer(file)
  })
}

function validatePrimaryFile(files: File[]) {
  const modelFiles = files.filter((file) => modelExtension.test(file.name))
  if (modelFiles.length !== 1) {
    throw new Error(modelFiles.length === 0
      ? 'Choose one .glb or .gltf model file.'
      : 'Choose only one .glb or .gltf model at a time.')
  }
  const [modelFile] = modelFiles
  if (modelFile.size === 0) throw new Error(`"${modelFile.name}" is empty.`)
  return modelFile
}

function validateModelData(file: File, data: ArrayBuffer) {
  if (/\.glb$/i.test(file.name)) {
    if (data.byteLength < 12) throw new Error(`"${file.name}" is not a valid GLB file.`)
    const header = new DataView(data)
    if (header.getUint32(0, true) !== 0x46546c67 || header.getUint32(4, true) !== 2) {
      throw new Error(`"${file.name}" has an invalid GLB header or unsupported version.`)
    }
    return
  }

  let document: { asset?: { version?: string } }
  try {
    document = JSON.parse(new TextDecoder().decode(data)) as { asset?: { version?: string } }
  } catch {
    throw new Error(`"${file.name}" is not valid glTF JSON.`)
  }
  if (document.asset?.version !== '2.0') {
    throw new Error(`"${file.name}" must use glTF 2.0.`)
  }
}

export async function importLocalModelFiles(
  files: File[],
  onProgress: (progress: number) => void,
): Promise<ImportedModel> {
  const modelFile = validatePrimaryFile(files)
  const data = await readFile(modelFile, onProgress)
  validateModelData(modelFile, data)

  const resourceUrls = new Set<string>()
  const localResources = files.filter((file) => file !== modelFile)
  const manager = new LoadingManager()
  manager.setURLModifier((uri) => {
    if (/^data:/i.test(uri)) return uri
    if (/^(https?:|file:|\/\/)/i.test(uri)) {
      throw new Error('External model resources are blocked. Select the glTF file and its local dependencies together.')
    }

    const requestedPath = normalizeResourcePath(uri)
    const matchingFiles = localResources.filter((file) => {
      const filePath = normalizeResourcePath(file.webkitRelativePath || file.name)
      return filePath === requestedPath || filePath.endsWith(`/${requestedPath}`)
    })
    const resource = matchingFiles.length === 1
      ? matchingFiles[0]
      : matchingFiles.length > 1
        ? undefined
        : localResources.find((file) => file.name === requestedPath.split('/').pop())

    if (!resource) {
      const detail = matchingFiles.length > 1 ? 'is ambiguous' : 'was not selected'
      throw new Error(`Local resource "${uri}" ${detail}. Select the .gltf file and all referenced files together.`)
    }

    const url = URL.createObjectURL(resource)
    resourceUrls.add(url)
    return url
  })
  manager.onProgress = (_url, loaded, total) => {
    onProgress(20 + (total > 0 ? Math.min(1, loaded / total) * 75 : 0))
  }

  try {
    const gltf = await new GLTFLoader(manager).parseAsync(data, '')
    onProgress(100)
    return {
      scene: gltf.scene,
      fileName: modelFile.name,
      release: () => resourceUrls.forEach((url) => URL.revokeObjectURL(url)),
    }
  } catch (error) {
    resourceUrls.forEach((url) => URL.revokeObjectURL(url))
    throw new Error(
      error instanceof Error ? error.message : `Could not load "${modelFile.name}".`,
      { cause: error },
    )
  }
}

export async function exportModelFile(scene: Object3D, format: 'glb' | 'gltf', baseName: string) {
  const exporter = new GLTFExporter()
  const result = await exporter.parseAsync(scene, { binary: format === 'glb' })
  const blob = format === 'glb'
    ? new Blob([result as ArrayBuffer], { type: 'model/gltf-binary' })
    : new Blob([JSON.stringify(result, null, 2)], { type: 'model/gltf+json' })
  const downloadUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = downloadUrl
  anchor.download = `${baseName.replace(/\.(glb|gltf)$/i, '') || 'model'}.${format}`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000)
}
