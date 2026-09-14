import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderSite } from './v6/render.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')

function resolveInsideRoot(...segments) {
  const target = path.resolve(root, ...segments)
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) throw new Error(`Refusing to access path outside repository: ${target}`)
  return target
}
async function assertExists(filePath, label = filePath) { try { await fs.access(filePath) } catch { throw new Error(`Missing required ${label}: ${filePath}`) } }
async function copyDirectory(source, target) { await assertExists(source); await fs.cp(source, target, { recursive: true }) }
function gitValue(args, fallback) { const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' }); return result.status === 0 && result.stdout.trim() ? result.stdout.trim() : fallback }

async function replaceBuildCommit(dir, commit) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) await replaceBuildCommit(target, commit)
    if (entry.isFile() && entry.name.endsWith('.html')) {
      const content = await fs.readFile(target, 'utf8')
      await fs.writeFile(target, content.replaceAll('__BUILD_COMMIT__', commit).replaceAll('__BUILD_VERSION__', commit.slice(0, 12)))
    }
  }
}

async function applyGeneratedCsp() {
  const groups = {
    HOME: [path.join(distDir, 'index.html')], SOBRE: [path.join(distDir, 'sobre')], PROJETOS: [path.join(distDir, 'projetos')],
    NOVIDADES: [path.join(distDir, 'novidades')], DIARIO: [path.join(distDir, 'diario')], IA: [path.join(distDir, 'ia')],
    BLACKLIGHT: [path.join(distDir, 'blacklight3d')], PORTFOLIO: [path.join(distDir, 'portfolio')], SERVICOS: [path.join(distDir, 'servicos')],
    INFRAESTRUTURA: [path.join(distDir, 'infraestrutura')], CONTATO: [path.join(distDir, 'contato')],
    NODES: [path.join(distDir, 'borda'), path.join(distDir, 'hefesto'), path.join(distDir, 'poseidon'), path.join(distDir, 'goiatuba')],
    EN: [path.join(distDir, 'en')],
  }
  async function collect(target, hashes) {
    const stat = await fs.stat(target)
    if (stat.isFile()) {
      const html = await fs.readFile(target, 'utf8')
      for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`)
      return
    }
    for (const entry of await fs.readdir(target, { withFileTypes: true })) {
      const child = path.join(target, entry.name)
      if (entry.isDirectory()) await collect(child, hashes)
      if (entry.isFile() && entry.name.endsWith('.html')) await collect(child, hashes)
    }
  }
  const headersPath = path.join(distDir, '_headers')
  let headers = await fs.readFile(headersPath, 'utf8')
  for (const [name, targets] of Object.entries(groups)) {
    const hashes = new Set()
    for (const target of targets) if (existsSync(target)) await collect(target, hashes)
    headers = headers.replaceAll(`__CSP_${name}_HASHES__`, [...hashes].join(' '))
  }
  await fs.writeFile(headersPath, headers)
}

async function main() {
  for (const [relative,label] of [
    ['data/profile.json','data/profile.json'], ['data/projects.json','data/projects.json'], ['data/ecosystem.json','data/ecosystem.json'], ['data/infrastructure.json','data/infrastructure.json'], ['data/generated/github-activity.json','GitHub activity cache'],
    ['scripts/v6/render.mjs','V6 renderer'], ['shared/v6/scene-engine.js','V6 scene engine'], ['shared/v6/core.css','V6 core styles'],
    ['servicos/index.html','servicos/index.html'], ['shared/styles.css','shared/styles.css'], ['shared/site-config.js','shared/site-config.js'], ['shared/navigation.js','shared/navigation.js'],
    ['privacidade/index.html','privacidade/index.html'], ['hefesto/index.html','hefesto/index.html'], ['poseidon/index.html','poseidon/index.html'], ['blacklight3d/index.html','blacklight3d/index.html'],
    ['impressoes-3d/index.html','impressoes-3d/index.html'], ['madrinha/index.html','madrinha/index.html'], ['veredra/index.html','veredra/index.html'], ['portfolio/public/curriculo.pdf','portfolio/public/curriculo.pdf'],
    ['public/_redirects','public/_redirects'], ['public/_headers','public/_headers'],
  ]) await assertExists(resolveInsideRoot(...relative.split('/')), label)

  if (path.basename(distDir) !== 'dist' || path.dirname(distDir) !== root) throw new Error(`Refusing to remove unexpected dist path: ${distDir}`)
  await fs.rm(distDir, { recursive: true, force: true }); await fs.mkdir(distDir, { recursive: true })
  for (const dir of ['servicos','shared','privacidade','hefesto','poseidon','blacklight3d','impressoes-3d','madrinha','veredra']) await copyDirectory(resolveInsideRoot(dir), path.join(distDir, dir))

  await fs.mkdir(path.join(distDir, 'assets', 'projects'), { recursive: true })
  const projectAssets = { 'project-campusflow-real.webp':'campus-flow.webp','project-veredra-real.webp':'veredra.webp','project-little-x.svg':'little-x.svg','project-openclaw-little-x.svg':'openclaw-little-x.svg','project-blacklight-real.png':'blacklight-3d.png','project-infrastructure.svg':'infrastructure.svg','project-wicolly-sites-real.png':'wicolly-sites.png' }
  for (const [source,destination] of Object.entries(projectAssets)) await fs.copyFile(resolveInsideRoot('portfolio','public','media',source), path.join(distDir,'assets','projects',destination))
  await fs.mkdir(path.join(distDir,'portfolio'), { recursive:true })
  await fs.copyFile(resolveInsideRoot('portfolio','public','curriculo.pdf'), path.join(distDir,'portfolio','curriculo.pdf'))
  for (const file of ['_redirects','_headers']) await fs.copyFile(resolveInsideRoot('public',file), path.join(distDir,file))
  for (const file of ['_routes.json','404.html','favicon.svg','robots.txt','sitemap.xml']) { const source=resolveInsideRoot('public',file); if (existsSync(source)) await fs.copyFile(source,path.join(distDir,file)) }

  const commit = process.env.BUILD_COMMIT || process.env.GITHUB_SHA || gitValue(['rev-parse','HEAD'],'unknown')
  const branch = process.env.BUILD_BRANCH || process.env.GITHUB_REF_NAME || gitValue(['branch','--show-current'],'unknown')
  await renderSite({ root, distDir })
  await replaceBuildCommit(distDir, commit)
  await applyGeneratedCsp()
  await fs.writeFile(path.join(distDir,'version.json'), `${JSON.stringify({ commit, builtAt:new Date().toISOString(), branch }, null, 2)}\n`)
}

main().catch((error)=>{ console.error(error instanceof Error ? error.message : error); process.exit(1) })
