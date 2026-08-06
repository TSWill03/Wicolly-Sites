import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderSite } from './site-renderer.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')

function resolveInsideRoot(...segments) {
  const target = path.resolve(root, ...segments)
  if (target !== root && !target.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Refusing to access path outside repository: ${target}`)
  }
  return target
}

async function assertExists(filePath, label = filePath) {
  try {
    await fs.access(filePath)
  } catch {
    throw new Error(`Missing required ${label}: ${filePath}`)
  }
}

async function copyDirectory(source, target) {
  await assertExists(source)
  await fs.cp(source, target, { recursive: true })
}

function gitValue(args, fallback) {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' })
  return result.status === 0 && result.stdout.trim() ? result.stdout.trim() : fallback
}

async function replaceBuildCommit(dir, commit) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name)
    if (entry.isDirectory()) await replaceBuildCommit(target, commit)
    if (entry.isFile() && entry.name.endsWith('.html')) {
      const content = await fs.readFile(target, 'utf8')
      await fs.writeFile(target, content.replaceAll('__BUILD_COMMIT__', commit))
    }
  }
}

async function applyGeneratedCsp() {
  const hashes = new Set()
  const generatedRoots = ['', 'sobre', 'projetos', 'novidades', 'servicos', 'infraestrutura', 'contato', 'privacidade', 'hefesto', 'poseidon', 'blacklight3d', 'portfolio']
  async function collect(dir) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const target = path.join(dir, entry.name)
      if (entry.isDirectory()) await collect(target)
      if (entry.isFile() && entry.name.endsWith('.html')) {
        const html = await fs.readFile(target, 'utf8')
        for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
          hashes.add(`'sha256-${createHash('sha256').update(match[1]).digest('base64')}'`)
        }
      }
    }
  }
  for (const relative of generatedRoots) {
    const target = path.join(distDir, relative)
    if (existsSync(target)) await collect(target)
  }
  const headersPath = path.join(distDir, '_headers')
  const headers = await fs.readFile(headersPath, 'utf8')
  await fs.writeFile(headersPath, headers.replaceAll('__CSP_SCRIPT_HASHES__', [...hashes].join(' ')))
}

async function main() {
  await assertExists(resolveInsideRoot('data', 'profile.json'), 'data/profile.json')
  await assertExists(resolveInsideRoot('data', 'projects.json'), 'data/projects.json')
  await assertExists(resolveInsideRoot('data', 'ecosystem.json'), 'data/ecosystem.json')
  await assertExists(resolveInsideRoot('data', 'infrastructure.json'), 'data/infrastructure.json')
  await assertExists(resolveInsideRoot('data', 'generated', 'github-activity.json'), 'GitHub activity cache')
  await assertExists(resolveInsideRoot('servicos', 'index.html'), 'servicos/index.html')
  await assertExists(resolveInsideRoot('shared', 'styles.css'), 'shared/styles.css')
  await assertExists(resolveInsideRoot('shared', 'site-config.js'), 'shared/site-config.js')
  await assertExists(resolveInsideRoot('shared', 'navigation.js'), 'shared/navigation.js')
  await assertExists(resolveInsideRoot('privacidade', 'index.html'), 'privacidade/index.html')
  await assertExists(resolveInsideRoot('hefesto', 'index.html'), 'hefesto/index.html')
  await assertExists(resolveInsideRoot('poseidon', 'index.html'), 'poseidon/index.html')
  await assertExists(resolveInsideRoot('blacklight3d', 'index.html'), 'blacklight3d/index.html')
  await assertExists(resolveInsideRoot('impressoes-3d', 'index.html'), 'impressoes-3d/index.html')
  await assertExists(resolveInsideRoot('madrinha', 'index.html'), 'madrinha/index.html')
  await assertExists(resolveInsideRoot('veredra', 'index.html'), 'veredra/index.html')
  await assertExists(resolveInsideRoot('portfolio', 'public', 'curriculo.pdf'), 'portfolio/public/curriculo.pdf')
  await assertExists(resolveInsideRoot('public', '_redirects'), 'public/_redirects')
  await assertExists(resolveInsideRoot('public', '_headers'), 'public/_headers')

  if (path.basename(distDir) !== 'dist' || path.dirname(distDir) !== root) {
    throw new Error(`Refusing to remove unexpected dist path: ${distDir}`)
  }

  await fs.rm(distDir, { recursive: true, force: true })
  await fs.mkdir(distDir, { recursive: true })

  await copyDirectory(resolveInsideRoot('servicos'), path.join(distDir, 'servicos'))
  await copyDirectory(resolveInsideRoot('shared'), path.join(distDir, 'shared'))
  await copyDirectory(resolveInsideRoot('privacidade'), path.join(distDir, 'privacidade'))
  await copyDirectory(resolveInsideRoot('hefesto'), path.join(distDir, 'hefesto'))
  await copyDirectory(resolveInsideRoot('poseidon'), path.join(distDir, 'poseidon'))
  await copyDirectory(resolveInsideRoot('blacklight3d'), path.join(distDir, 'blacklight3d'))
  await copyDirectory(resolveInsideRoot('impressoes-3d'), path.join(distDir, 'impressoes-3d'))
  await copyDirectory(resolveInsideRoot('madrinha'), path.join(distDir, 'madrinha'))
  await copyDirectory(resolveInsideRoot('veredra'), path.join(distDir, 'veredra'))

  await fs.mkdir(path.join(distDir, 'assets', 'projects'), { recursive: true })
  await fs.copyFile(resolveInsideRoot('portfolio', 'public', 'media', 'project-campusflow-real.webp'), path.join(distDir, 'assets', 'projects', 'campus-flow.webp'))
  await fs.copyFile(resolveInsideRoot('portfolio', 'public', 'media', 'project-veredra-real.webp'), path.join(distDir, 'assets', 'projects', 'veredra.webp'))
  await fs.mkdir(path.join(distDir, 'portfolio'), { recursive: true })
  await fs.copyFile(resolveInsideRoot('portfolio', 'public', 'curriculo.pdf'), path.join(distDir, 'portfolio', 'curriculo.pdf'))
  await fs.copyFile(resolveInsideRoot('public', '_redirects'), path.join(distDir, '_redirects'))
  await fs.copyFile(resolveInsideRoot('public', '_headers'), path.join(distDir, '_headers'))

  for (const publicFile of ['_routes.json', '404.html', 'favicon.svg', 'robots.txt', 'sitemap.xml']) {
    const source = resolveInsideRoot('public', publicFile)
    if (existsSync(source)) {
      await fs.copyFile(source, path.join(distDir, publicFile))
    }
  }

  const commit = process.env.BUILD_COMMIT || process.env.GITHUB_SHA || gitValue(['rev-parse', 'HEAD'], 'unknown')
  const branch = process.env.BUILD_BRANCH || process.env.GITHUB_REF_NAME || gitValue(['branch', '--show-current'], 'unknown')
  const builtAt = new Date().toISOString()

  await renderSite({ root, distDir })
  await replaceBuildCommit(distDir, commit)
  await applyGeneratedCsp()
  await fs.writeFile(
    path.join(distDir, 'version.json'),
    `${JSON.stringify({ commit, builtAt, branch }, null, 2)}\n`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
