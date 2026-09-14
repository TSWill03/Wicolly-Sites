import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const at = (p) => path.join(root, p)
const read = (p) => fs.readFileSync(at(p), 'utf8')
const need = [
  'dist/index.html','dist/projetos/index.html','dist/ia/index.html','dist/infraestrutura/index.html',
  'dist/blacklight3d/index.html','dist/blacklight3d/orcamento/index.html','dist/en/index.html',
  'dist/shared/v6/core.css','dist/shared/v6/components.css','dist/shared/v6/blacklight.css',
  'dist/shared/v6/scene-engine.js','dist/shared/v6/scene-init.js','dist/version.json','dist/_headers'
]
for (const p of need) if (!fs.existsSync(at(p))) throw new Error(`Missing V6 artifact: ${p}`)

const home = read('dist/index.html')
for (const text of ['Eu construo sistemas','flag-br','flag-us','id="infinite-scene"','data-menu-toggle']) {
  if (!home.includes(text)) throw new Error(`Home V6 missing: ${text}`)
}
const en = read('dist/en/index.html')
if (!en.includes('I build systems')) throw new Error('English home is incomplete')

const scene = read('dist/shared/v6/scene-engine.js')
for (const name of ['drawBLChamber','drawBLMacro','drawBLTopdown','drawBLFarm','drawBLSpool','drawBLCalibration','drawBLLayers']) {
  if (!scene.includes(name)) throw new Error(`BlackLight scene missing: ${name}`)
}
if (!scene.includes('blacklight-scene-index')) throw new Error('BlackLight rotation state is missing')

const headers = read('dist/_headers')
if (headers.includes('__CSP_')) throw new Error('Generated CSP placeholders remain')
if (!headers.includes('Content-Security-Policy:')) throw new Error('CSP headers are missing')

const version = JSON.parse(read('dist/version.json'))
if (!version.commit || !version.branch || !version.builtAt) throw new Error('version.json is incomplete')

const projects = JSON.parse(read('data/projects.json'))
for (const project of projects) {
  for (const p of [`dist/projetos/${project.slug}/index.html`,`dist/en/projects/${project.slug}/index.html`]) {
    if (!fs.existsSync(at(p))) throw new Error(`Project page missing: ${p}`)
  }
}

console.log(`V6 gate artifact validated: ${projects.length} projects and 7 BlackLight scenes.`)
