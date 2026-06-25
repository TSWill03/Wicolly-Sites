import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const checkExternal = process.argv.includes('--external')
const failures = []
const warnings = []
const externalUrls = new Set()

const ignoredProtocols = /^(?:mailto:|tel:|sms:|data:|blob:)/i
const externalProtocol = /^https?:\/\//i

function relative(filePath) {
  return path.relative(root, filePath).replaceAll(path.sep, '/')
}

function walk(directory, files = []) {
  if (!fs.existsSync(directory)) return files

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) walk(fullPath, files)
    else if (entry.isFile()) files.push(fullPath)
  }

  return files
}

function routeForHtml(filePath) {
  const localPath = path.relative(distDir, filePath).replaceAll(path.sep, '/')
  if (localPath === 'index.html') return '/'
  if (localPath.endsWith('/index.html')) return `/${localPath.slice(0, -'index.html'.length)}`
  return `/${localPath}`
}

function resolveInternalFile(urlPath) {
  const decodedPath = decodeURIComponent(urlPath)
  const normalized = decodedPath.replace(/^\/+/, '')
  const direct = path.join(distDir, normalized)

  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct
  if (fs.existsSync(direct) && fs.statSync(direct).isDirectory()) {
    const indexFile = path.join(direct, 'index.html')
    if (fs.existsSync(indexFile)) return indexFile
  }

  const indexFile = path.join(distDir, normalized, 'index.html')
  if (fs.existsSync(indexFile)) return indexFile

  return null
}

function extractAttributes(html) {
  const attributes = []
  const tagPattern = /<([a-z][\w:-]*)([^>]*?)>/gi
  let tagMatch

  while ((tagMatch = tagPattern.exec(html))) {
    const tag = tagMatch[1].toLowerCase()
    const rawAttributes = tagMatch[2]
    const parsed = {}
    const attributePattern = /([\w:-]+)\s*=\s*(["'])(.*?)\2/g
    let attributeMatch

    while ((attributeMatch = attributePattern.exec(rawAttributes))) {
      parsed[attributeMatch[1].toLowerCase()] = attributeMatch[3]
    }

    for (const name of ['href', 'src']) {
      if (parsed[name]) attributes.push({ tag, name, value: parsed[name], parsed })
    }
  }

  return attributes
}

function idsFromHtml(html) {
  const ids = new Set()
  const pattern = /\sid\s*=\s*(["'])(.*?)\1/gi
  let match
  while ((match = pattern.exec(html))) ids.add(match[2])
  return ids
}

function validateHtmlFile(filePath, routeMap) {
  const html = fs.readFileSync(filePath, 'utf8')
  const sourceRoute = routeForHtml(filePath)

  for (const { tag, name, value, parsed } of extractAttributes(html)) {
    if (!value || value.startsWith('#') === false && ignoredProtocols.test(value)) continue

    if (/^javascript:/i.test(value)) {
      failures.push(`${relative(filePath)} contains unsafe ${name}="${value}"`)
      continue
    }

    if (parsed.target === '_blank') {
      const relValues = new Set((parsed.rel ?? '').toLowerCase().split(/\s+/).filter(Boolean))
      if (!relValues.has('noopener') && !relValues.has('noreferrer')) {
        failures.push(`${relative(filePath)} has target="_blank" without noopener or noreferrer: ${value}`)
      }
    }

    if (externalProtocol.test(value)) {
      externalUrls.add(value)
      continue
    }

    let resolved
    try {
      resolved = new URL(value, `https://local.test${sourceRoute}`)
    } catch {
      failures.push(`${relative(filePath)} contains invalid ${name}: ${value}`)
      continue
    }

    const targetFile = resolveInternalFile(resolved.pathname)
    if (!targetFile) {
      failures.push(`${relative(filePath)} points to missing internal resource: ${value}`)
      continue
    }

    if (resolved.hash && targetFile.endsWith('.html')) {
      const targetHtml = fs.readFileSync(targetFile, 'utf8')
      const fragment = decodeURIComponent(resolved.hash.slice(1))
      if (fragment && !idsFromHtml(targetHtml).has(fragment)) {
        failures.push(`${relative(filePath)} points to missing fragment ${resolved.hash} in ${relative(targetFile)}`)
      }
    }

    if (tag === 'a' && name === 'href' && targetFile.endsWith('.html')) {
      routeMap.add(routeForHtml(targetFile))
    }
  }
}

function validateCssFile(filePath) {
  const css = fs.readFileSync(filePath, 'utf8')
  const pattern = /url\(\s*(["']?)(.*?)\1\s*\)/gi
  let match

  while ((match = pattern.exec(css))) {
    const value = match[2]
    if (!value || value.startsWith('#') || ignoredProtocols.test(value) || externalProtocol.test(value)) continue

    const target = path.resolve(path.dirname(filePath), decodeURIComponent(value.split(/[?#]/)[0]))
    if (!fs.existsSync(target)) failures.push(`${relative(filePath)} points to missing CSS resource: ${value}`)
  }
}

async function validateExternalUrl(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12_000)

  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'Wicolly-Sites-Link-Checker/1.0' },
    })

    if (response.status === 404 || response.status === 410) {
      failures.push(`External URL returned ${response.status}: ${url}`)
    } else if (response.status >= 400) {
      warnings.push(`External URL returned ${response.status}: ${url}`)
    }
  } catch (error) {
    warnings.push(`Could not verify external URL ${url}: ${error instanceof Error ? error.message : error}`)
  } finally {
    clearTimeout(timeout)
  }
}

if (!fs.existsSync(distDir)) {
  console.error('Missing dist/. Run npm run build before checking links.')
  process.exit(1)
}

const files = walk(distDir)
const htmlFiles = files.filter((file) => file.endsWith('.html'))
const cssFiles = files.filter((file) => file.endsWith('.css'))
const knownRoutes = new Set(htmlFiles.map(routeForHtml))
const linkedRoutes = new Set(['/'])

for (const file of htmlFiles) validateHtmlFile(file, linkedRoutes)
for (const file of cssFiles) validateCssFile(file)

for (const route of knownRoutes) {
  if (!linkedRoutes.has(route) && route !== '/portfolio/curriculo.html') {
    warnings.push(`Known route is not linked from another generated page: ${route}`)
  }
}

if (checkExternal) {
  for (const url of [...externalUrls].sort()) await validateExternalUrl(url)
}

for (const warning of warnings) console.warn(`WARN: ${warning}`)
for (const failure of failures) console.error(`ERROR: ${failure}`)

console.log(`Checked ${htmlFiles.length} HTML file(s), ${cssFiles.length} CSS file(s), ${knownRoutes.size} route(s) and ${externalUrls.size} external URL(s).`)

if (failures.length > 0) process.exit(1)
console.log('Route and link validation passed.')
