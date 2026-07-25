import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const failures = []

const requiredSourceFiles = [
  'main/index.html',
  'servicos/index.html',
  'shared/styles.css',
  'shared/site-config.js',
  'shared/navigation.js',
  'privacidade/index.html',
  'hefesto/index.html',
  'poseidon/index.html',
  'blacklight3d/index.html',
  'impressoes-3d/index.html',
  'madrinha/index.html',
  'veredra/index.html',
  'veredra/main.dart.js',
  'veredra/manifest.json',
  'veredra/flutter_service_worker.js',
  'functions/veredra/[[path]].js',
  'portfolio/package.json',
]

const sourceHtmlFiles = [
  'main/index.html',
  'servicos/index.html',
  'privacidade/index.html',
  'hefesto/index.html',
  'poseidon/index.html',
  'blacklight3d/index.html',
  'impressoes-3d/index.html',
  'madrinha/index.html',
  'veredra/index.html',
  'portfolio/index.html',
]

const distFiles = [
  'dist/index.html',
  'dist/servicos/index.html',
  'dist/shared/styles.css',
  'dist/shared/site-config.js',
  'dist/shared/navigation.js',
  'dist/privacidade/index.html',
  'dist/404.html',
  'dist/favicon.svg',
  'dist/robots.txt',
  'dist/sitemap.xml',
  'dist/version.json',
  'dist/hefesto/index.html',
  'dist/poseidon/index.html',
  'dist/blacklight3d/index.html',
  'dist/blacklight3d/styles.css',
  'dist/impressoes-3d/index.html',
  'dist/madrinha/index.html',
  'dist/veredra/index.html',
  'dist/veredra/main.dart.js',
  'dist/veredra/manifest.json',
  'dist/veredra/flutter_service_worker.js',
  'dist/portfolio/index.html',
  'dist/_redirects',
  'dist/_headers',
  'dist/_routes.json',
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

const forbiddenPublishedPhrases = [
  'Canva deck',
  'Notion context',
  'placeholder copy',
  'not fake',
  'GET /api/status',
  'POST /api/chat',
  'deck to real site',
  'Wícolly builds the Blacklight stack',
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

    if (relativePath.startsWith('main/') || relativePath.startsWith('servicos/') || relativePath.startsWith('dist/')) {
      for (const phrase of forbiddenPublishedPhrases) {
        assert(
          !content.toLowerCase().includes(phrase.toLowerCase()),
          `${relativePath} contains forbidden internal copy: ${phrase}`,
        )
      }
    }
  }
}

function validateSourceLinks() {
  const mainHtml = read('main/index.html')
  for (const sitePath of ['/servicos/', '/portfolio/', '/hefesto/', '/poseidon/', '/blacklight3d/', '/madrinha/', '/veredra/']) {
    assert(mainHtml.includes(`href="${sitePath}"`), `main/index.html must link to ${sitePath}`)
  }

  assert(mainHtml.includes('lang="pt-BR"'), 'main/index.html must declare pt-BR')
  assert(
    mainHtml.includes('Software, servidores e automações para transformar ideias em projetos que funcionam.'),
    'main/index.html must contain the approved commercial title',
  )
  assert(mainHtml.includes('data-menu-toggle'), 'main/index.html must include the accessible mobile menu')
  assert(mainHtml.includes('rel="canonical"'), 'main/index.html must include canonical metadata')
  assert(mainHtml.includes('application/ld+json'), 'main/index.html must include JSON-LD')

  const servicesHtml = read('servicos/index.html')
  for (const service of [
    'Sites e presença digital',
    'Sistemas e automações',
    'Servidores e infraestrutura',
    'Inteligência artificial',
    'Servidores de jogos',
    'Manutenção recorrente',
    'Impressão 3D',
  ]) {
    assert(servicesHtml.includes(service), `servicos/index.html must mention ${service}`)
  }
  assert(servicesHtml.includes('data-contact="technology"'), 'Services page must include technology WhatsApp CTAs')
  assert(servicesHtml.includes('data-contact="blacklight"'), 'Services page must separate Blacklight CTAs')
  assert(servicesHtml.includes('mailto:wicolly@gmail.com'), 'Services page must include the confirmed email')
  assert(servicesHtml.includes('ARK: Survival Evolved'), 'Services page must document ARK compatibility limits')

  const siteConfig = read('shared/site-config.js')
  assert(siteConfig.includes('5534997675400'), 'Site config must include the technology WhatsApp')
  assert(siteConfig.includes('5564993252339'), 'Site config must include the Blacklight WhatsApp')
  assert(siteConfig.includes('wicolly@gmail.com'), 'Site config must include the confirmed email')
  assert(!/instagram:\s*["']/.test(siteConfig), 'Unconfirmed personal Instagram must not be published')

  const redirects = read('public/_redirects')
  assert(redirects.includes('/servicos /servicos/ 301'), 'Missing /servicos canonical redirect')
  assert(redirects.includes('/veredra /veredra/ 301'), 'Missing /veredra canonical redirect')

  assert(existsFile('public/_routes.json'), 'public/_routes.json must exist for Pages Functions routing')

  const routes = JSON.parse(read('public/_routes.json'))
  assert(
    Array.isArray(routes.include) && routes.include.includes('/blacklight3d/*'),
    'public/_routes.json must include /blacklight3d/*',
  )

  for (const relativePath of ['hefesto/index.html', 'poseidon/index.html', 'blacklight3d/index.html', 'impressoes-3d/index.html', 'madrinha/index.html']) {
    const html = read(relativePath)
    assert(
      /href=["'](?:\/|https:\/\/wicolly\.com\.br\/?)['"]/.test(html),
      `${relativePath} must link back to / or https://wicolly.com.br/`,
    )
  }
}

function validateVeredraDeployment() {
  const index = read('veredra/index.html')
  const appBundle = read('veredra/main.dart.js')
  const manifest = JSON.parse(read('veredra/manifest.json'))
  const worker = read('veredra/flutter_service_worker.js')
  const redirects = read('public/_redirects')
  const headers = read('public/_headers')

  assert(index.includes('<base href="/veredra/">'), 'veredra/index.html must use /veredra/')
  assert(index.includes('lang="pt-BR"'), 'veredra/index.html must declare pt-BR')
  assert(index.includes('href="/"'), 'Veredra must include a link back to the main site')
  for (const property of ['id', 'start_url', 'scope']) {
    assert(manifest[property] === '/veredra/', `veredra/manifest.json ${property} must be /veredra/`)
  }
  assert(appBundle.includes('https://wicolly.com.br/veredra/'), 'Veredra bundle must use the canonical /veredra/ production URL')
  assert(!appBundle.includes('https://wicolly.com.br/Veredra/'), 'Veredra bundle must not use the deprecated /Veredra/ production URL')
  assert(worker.includes('function resourceKeyFromUrl(url)'), 'Veredra service worker is missing the subpath patch')
  assert(worker.includes('function normalizeNavigationResponse(response)'), 'Veredra service worker is missing redirect-safe offline responses')
  assert(worker.includes('function respondWithCachedIndex(event)'), 'Veredra service worker is missing offline navigation fallback')
  assert(worker.includes('response.redirected'), 'Veredra service worker must normalize redirected cached responses')
  assert(!worker.includes('urlsToCache = ["/"'), 'Veredra service worker must not cache the site root')
  assert(redirects.includes('/veredra /veredra/ 301'), 'Missing canonical /veredra redirect')
  assert(redirects.includes('/Veredra /veredra/ 301'), 'Missing /Veredra compatibility redirect')
  assert(redirects.includes('/Veredra/ /veredra/ 301'), 'Missing /Veredra/ compatibility redirect')
  assert(redirects.includes('/Veredra/* /veredra/:splat 301'), 'Missing /Veredra/* compatibility redirect')
  const routes = JSON.parse(read('public/_routes.json'))
  assert(routes.include.includes('/veredra/*'), 'Pages Functions routes must include /veredra/*')
  const fallbackFunction = read('functions/veredra/[[path]].js')
  assert(fallbackFunction.includes('const VEREDRA_PREFIX = "/veredra"'), 'Veredra Pages Function must use /veredra')
  assert(fallbackFunction.includes('`${VEREDRA_PREFIX}/index.html`'), 'Missing /veredra SPA function fallback')
  assert(fallbackFunction.includes('no-cache, no-store, must-revalidate'), 'Veredra function must override service-worker cache')
  assert(fallbackFunction.includes('`${VEREDRA_PREFIX}/manifest.json`'), 'Veredra function must disable manifest caching')
  assert(!redirects.includes('/veredra/ /Veredra/'), 'Veredra redirects must not loop to uppercase')
  assert(
    /\/veredra\/\r?\n\s+Cache-Control: no-cache, no-store, must-revalidate/.test(headers),
    'Missing no-cache headers for Veredra app shell',
  )
  assert(headers.includes('/veredra/flutter_service_worker.js'), 'Missing no-cache headers for Veredra service worker')
  assert(headers.includes('/veredra/manifest.json'), 'Missing no-cache headers for Veredra manifest')
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

  const version = JSON.parse(read('dist/version.json'))
  assert(typeof version.commit === 'string' && version.commit.length > 0, 'dist/version.json must include commit')
  assert(typeof version.builtAt === 'string' && !Number.isNaN(Date.parse(version.builtAt)), 'dist/version.json must include builtAt')
  assert(typeof version.branch === 'string' && version.branch.length > 0, 'dist/version.json must include branch')
  assert(!read('dist/index.html').includes('__BUILD_COMMIT__'), 'dist/index.html build commit was not injected')
  assert(!read('dist/servicos/index.html').includes('__BUILD_COMMIT__'), 'services build commit was not injected')
}

for (const relativePath of requiredSourceFiles) {
  assert(existsFile(relativePath), `Missing required file: ${relativePath}`)
}

for (const relativePath of sourceHtmlFiles) {
  validateHtml(relativePath)
}

validateSourceLinks()
validateVeredraDeployment()
validateContentScans()
validateDistIfPresent()

if (failures.length > 0) {
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Site validation passed.')
