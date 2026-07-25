import { spawnSync } from 'node:child_process'
import fs from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const portfolioDir = path.join(root, 'portfolio')
const portfolioDistDir = path.join(portfolioDir, 'dist')
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'

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

function run(command, args, cwd = root) {
  const options = {
    cwd,
    stdio: 'inherit',
    env: process.env,
  }

  const result =
    process.platform === 'win32'
      ? spawnSync([command, ...args].join(' '), { ...options, shell: true })
      : spawnSync(command, args, options)

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed with exit code ${result.status}`)
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

async function replaceBuildCommit(relativePath, commit) {
  const target = path.join(distDir, relativePath)
  const content = await fs.readFile(target, 'utf8')
  await fs.writeFile(target, content.replaceAll('__BUILD_COMMIT__', commit))
}

async function main() {
  await assertExists(resolveInsideRoot('main', 'index.html'), 'main/index.html')
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
  await assertExists(resolveInsideRoot('portfolio', 'package.json'), 'portfolio/package.json')
  await assertExists(resolveInsideRoot('public', '_redirects'), 'public/_redirects')
  await assertExists(resolveInsideRoot('public', '_headers'), 'public/_headers')

  if (path.basename(distDir) !== 'dist' || path.dirname(distDir) !== root) {
    throw new Error(`Refusing to remove unexpected dist path: ${distDir}`)
  }

  await fs.rm(distDir, { recursive: true, force: true })
  await fs.mkdir(distDir, { recursive: true })

  await fs.copyFile(resolveInsideRoot('main', 'index.html'), path.join(distDir, 'index.html'))
  await copyDirectory(resolveInsideRoot('servicos'), path.join(distDir, 'servicos'))
  await copyDirectory(resolveInsideRoot('shared'), path.join(distDir, 'shared'))
  await copyDirectory(resolveInsideRoot('privacidade'), path.join(distDir, 'privacidade'))
  await copyDirectory(resolveInsideRoot('hefesto'), path.join(distDir, 'hefesto'))
  await copyDirectory(resolveInsideRoot('poseidon'), path.join(distDir, 'poseidon'))
  await copyDirectory(resolveInsideRoot('blacklight3d'), path.join(distDir, 'blacklight3d'))
  await copyDirectory(resolveInsideRoot('impressoes-3d'), path.join(distDir, 'impressoes-3d'))
  await copyDirectory(resolveInsideRoot('madrinha'), path.join(distDir, 'madrinha'))
  await copyDirectory(resolveInsideRoot('veredra'), path.join(distDir, 'veredra'))

  const lockfiles = ['package-lock.json', 'npm-shrinkwrap.json']
  const hasLockfile = lockfiles.some((file) => existsSync(path.join(portfolioDir, file)))
  run(npmCmd, hasLockfile ? ['ci', '--no-audit', '--no-fund'] : ['install', '--no-audit', '--no-fund'], portfolioDir)
  run(npmCmd, ['run', 'build'], portfolioDir)

  await copyDirectory(portfolioDistDir, path.join(distDir, 'portfolio'))
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

  await replaceBuildCommit('index.html', commit)
  await replaceBuildCommit(path.join('servicos', 'index.html'), commit)
  await replaceBuildCommit(path.join('veredra', 'index.html'), commit)
  await fs.writeFile(
    path.join(distDir, 'version.json'),
    `${JSON.stringify({ commit, builtAt, branch }, null, 2)}\n`,
  )
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
