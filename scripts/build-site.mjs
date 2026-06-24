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

async function main() {
  await assertExists(resolveInsideRoot('main', 'index.html'), 'main/index.html')
  await assertExists(resolveInsideRoot('hefesto', 'index.html'), 'hefesto/index.html')
  await assertExists(resolveInsideRoot('poseidon', 'index.html'), 'poseidon/index.html')
  await assertExists(resolveInsideRoot('portfolio', 'package.json'), 'portfolio/package.json')
  await assertExists(resolveInsideRoot('public', '_redirects'), 'public/_redirects')

  if (path.basename(distDir) !== 'dist' || path.dirname(distDir) !== root) {
    throw new Error(`Refusing to remove unexpected dist path: ${distDir}`)
  }

  await fs.rm(distDir, { recursive: true, force: true })
  await fs.mkdir(distDir, { recursive: true })

  await fs.copyFile(resolveInsideRoot('main', 'index.html'), path.join(distDir, 'index.html'))
  await copyDirectory(resolveInsideRoot('hefesto'), path.join(distDir, 'hefesto'))
  await copyDirectory(resolveInsideRoot('poseidon'), path.join(distDir, 'poseidon'))

  const lockfiles = ['package-lock.json', 'npm-shrinkwrap.json']
  const hasLockfile = lockfiles.some((file) => existsSync(path.join(portfolioDir, file)))
  run(npmCmd, hasLockfile ? ['ci', '--no-audit', '--no-fund'] : ['install', '--no-audit', '--no-fund'], portfolioDir)
  run(npmCmd, ['run', 'build'], portfolioDir)

  await copyDirectory(portfolioDistDir, path.join(distDir, 'portfolio'))
  await fs.copyFile(resolveInsideRoot('public', '_redirects'), path.join(distDir, '_redirects'))
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
