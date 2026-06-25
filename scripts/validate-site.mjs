import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []

const requiredSourceFiles = [
  'main/index.html',
  'hefesto/index.html',
  'poseidon/index.html',
  'impressoes-3d/index.html',
  'portfolio/package.json',
]

const sourceHtmlFiles = [
  'main/index.html',
  'hefesto/index.html',
  'poseidon/index.html',
  'impressoes-3d/index.html',
  'portfolio/index.html',
]

const distFiles = [
  'dist/index.html',
  'dist/hefesto/index.html',
  'dist/poseidon/index.html',
  'dist/impressoes-3d/index.html',
  'dist/portfolio/index.html',
  'dist/_redirects',
]

const excludedDirs = new Set([
  '.git',
  '.wrangler',
  '.cloudflare',
  '.cache',
  'coverage',
  'node_modules',
])

const ignoredFiles = new Set([
  'DNS_BACKUP.json',
  'DEPLOY_RESULT.md',
])

const textExtensions = new Set([
  '',
  '.css',
  '.html',
  '.htm',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.svg',
  '.ts',
  '.tsx',
  '.txt',
  '.yaml',
  '.yml',
])

const oldPublicHosts = [
  ['portfolio', 'wicolly.com.br'].join('.'),
  ['hefesto', 'wicolly.com.br'].join('.'),
  ['poseidon', 'wicolly.com.br'].join('.'),
  ['tswill03.github.io', 'Portifolio'].join('/'),
]

const secretPatterns = [
  /-----BEGIN (?:OPENSSH|RSA|EC|DSA|PRIVATE) PRIVATE KEY-----/,
  /\b[A-Z0-9_]*(?:TOKEN|SECRET|PASSWORD|PRIVATE_KEY|API_KEY)\s*=\s*["']?[A-Za-z0-9_./~+=:-]{16,}/i,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{20,}/i,
  /\bgh[opsu]_[A-Za-z0-9_]{20,}/,
  /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}/,
]

function rel(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/')
}

function filePath(relativePath) {
  return path.join(root, relativePath)
}

function assert(condition, message) {
  if (!condition) {
    failures.push(message)
  }
}

function read(relativePath) {
  return fs.readFileSync(filePath(relativePath), 'utf8')
}

function existsFile(relativePath) {
  try {
    return fs.statSync(filePath(relativePath)).isFile()
  } catch {
    return false
  }
}

function existsDir(relativePath) {
  try {
    return fs.statSync(filePath(relativePath)).isDirectory()
  } catch {
    return false
  }
}

function validateHtml(relativePath) {
  if (!existsFile(relativePath)) {
    failures.push(`Missing HTML file: ${relativePath}`)
    return
  }

  const html = read(relativePath)
  const checks = [
    ['doctype', /<!doctype\s+html/i],
    ['html', /<html[\s>]/i],
    ['head', /<head[\s>]/i],
    ['title', /<title[\s>]/i],
    ['body', /<body[\s>]/i],
  ]

  for (const [label, pattern] of checks) {
    assert(pattern.test(html), `${relativePath} is missing ${label}`)
  }
}

function shouldSkipDir(name) {
  return excludedDirs.has(name)
}

function shouldScanFile(filePathValue) {
  if (ignoredFiles.has(path.basename(filePathValue))) {
    return false
  }

  const parts = rel(filePathValue).split('/')
  if (parts.some((part) => excludedDirs.has(part))) {
    return false
  }

  const extension = path.extname(filePathValue).toLowerCase()
  return textExtensions.has(extension) || path.basename(filePathValue) === '.gitignore'
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!shouldSkipDir(entry.name)) {
        walk(path.join(dir, entry.name), files)
      }
      continue
    }

    const fullPath = path.join(dir, entry.name)
    if (entry.isFile() && shouldScanFile(fullPath)) {
      files.push(fullPath)
    }
  }

  return files
}

function validateContentScans() {
  for (const scannedFile of walk(root)) {
    const content = fs.readFileSync(scannedFile, 'utf8')
    const relativePath = rel(scannedFile)

    for (const host of oldPublicHosts) {
      assert(!content.includes(host), `${relativePath} contains old public host: ${host}`)
    }

    for (const pattern of secretPatterns) {
      assert(!pattern.test(content), `${relativePath} contains a possible secret or private key`)
    }
  }
}

function validateSourceLinks() {
  const mainHtml = read('main/index.html')
  for (const sitePath of ['/portfolio/', '/hefesto/', '/poseidon/', '/impressoes-3d/']) {
    assert(mainHtml.includes(`href="${sitePath}"`), `main/index.html must link to ${sitePath}`)
  }

  for (const relativePath of ['hefesto/index.html', 'poseidon/index.html', 'impressoes-3d/index.html']) {
    const html = read(relativePath)
    assert(
      /href=["'](?:\/|https:\/\/wicolly\.com\.br\/?)['"]/.test(html),
      `${relativePath} must link back to / or https://wicolly.com.br/`,
    )
  }
}

function validateDistIfPresent() {
  if (!existsDir('dist')) {
    return
  }

  for (const relativePath of distFiles) {
    assert(existsFile(relativePath), `Missing build output: ${relativePath}`)
  }

  assert(existsDir('dist/portfolio/assets'), 'Missing build output: dist/portfolio/assets/')

  if (existsDir('dist/portfolio/assets')) {
    const assets = fs.readdirSync(filePath('dist/portfolio/assets'))
    assert(assets.length > 0, 'dist/portfolio/assets/ is empty')
  }

  for (const relativePath of distFiles.filter((file) => file.endsWith('.html'))) {
    validateHtml(relativePath)
  }
}

for (const relativePath of requiredSourceFiles) {
  assert(existsFile(relativePath), `Missing required file: ${relativePath}`)
}

for (const relativePath of sourceHtmlFiles) {
  validateHtml(relativePath)
}

validateSourceLinks()
validateContentScans()
validateDistIfPresent()

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Site validation passed.')
