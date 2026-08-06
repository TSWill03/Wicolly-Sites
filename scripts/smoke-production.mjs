import { setTimeout as delay } from 'node:timers/promises'

const args = process.argv.slice(2)
const value = (name, fallback) => {
  const index = args.indexOf(name)
  return index >= 0 && args[index + 1] ? args[index + 1] : fallback
}

const base = new URL(value('--base', 'https://wicolly.com.br'))
const expectedCommit = value('--commit', '')
const retries = Number(value('--retries', '1'))
const retryDelay = Number(value('--delay-ms', '10000'))
const failures = []
const checkedResources = new Set()

function assert(condition, message) {
  if (!condition) failures.push(message)
}

async function request(pathname, options = {}) {
  const url = new URL(pathname, base)
  const response = await fetch(url, {
    redirect: options.redirect || 'follow',
    headers: { 'user-agent': 'wicolly-production-smoke/1.0' },
  })
  return response
}

async function expectPage(pathname, expectedText) {
  const response = await request(pathname)
  const body = await response.text()
  assert(response.status === 200, `${pathname} returned ${response.status}`)
  if (expectedText) {
    assert(body.toLowerCase().includes(expectedText.toLowerCase()), `${pathname} is missing expected content: ${expectedText}`)
  }
  return { response, body }
}

function internalResources(html, pagePath) {
  const resources = []
  const pattern = /\b(?:href|src)=["']([^"'#]+)["']/gi
  for (const match of html.matchAll(pattern)) {
    const raw = match[1]
    if (/^(?:mailto:|tel:|javascript:|data:)/i.test(raw)) continue
    const url = new URL(raw, new URL(pagePath, base))
    if (url.origin === base.origin) resources.push(url.pathname + url.search)
  }
  return resources
}

async function checkResource(pathname) {
  if (checkedResources.has(pathname)) return
  checkedResources.add(pathname)
  const response = await request(pathname)
  assert(response.status < 400, `Resource ${pathname} returned ${response.status}`)
}

async function checkRedirect(pathname, destination) {
  const response = await request(pathname, { redirect: 'manual' })
  const location = response.headers.get('location') || ''
  assert(response.status === 301, `${pathname} must return 301, received ${response.status}`)
  assert(new URL(location, base).pathname === destination, `${pathname} redirects to ${location || '(missing)'}, expected ${destination}`)
}

async function checkVersion() {
  const suffix = expectedCommit ? `?build=${encodeURIComponent(expectedCommit)}` : ''
  const response = await request(`/version.json${suffix}`)
  assert(response.status === 200, `/version.json returned ${response.status}`)
  if (!response.ok) return false
  let version
  try {
    version = await response.json()
  } catch {
    failures.push('/version.json did not return JSON yet')
    return false
  }
  assert(version.branch === 'main', `version.json branch is ${version.branch}, expected main`)
  if (expectedCommit && version.commit !== expectedCommit) return false
  assert(typeof version.builtAt === 'string' && !Number.isNaN(Date.parse(version.builtAt)), 'version.json builtAt is invalid')
  return true
}

async function waitForExpectedVersion() {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    const failureCount = failures.length
    const matches = await checkVersion()
    if (matches) return true
    failures.splice(failureCount)
    if (attempt < retries) {
      console.log(`Published commit is not ${expectedCommit} yet; retrying (${attempt}/${retries}).`)
      await delay(retryDelay)
    }
  }
  failures.push(`version.json did not reach expected commit ${expectedCommit}`)
  return false
}

async function checkProductionContent() {
  const homepage = await expectPage(`/?build=${encodeURIComponent(expectedCommit || 'smoke')}`, 'Um ecossistema de projetos que precisam funcionar de verdade.')
  assert(/<html[^>]+lang=["']pt-BR["']/i.test(homepage.body), 'Homepage does not declare lang="pt-BR"')
  assert(homepage.body.includes('href="/servicos/"'), 'Homepage does not link to /servicos/')
  assert(homepage.body.includes('href="/veredra/"'), 'Homepage does not link to /veredra/')
  assert(homepage.body.includes('href="/sobre/"'), 'Homepage does not link to /sobre/')
  assert(homepage.body.includes('href="/projetos/"'), 'Homepage does not link to /projetos/')
  assert(homepage.body.includes('href="/infraestrutura/"'), 'Homepage does not link to /infraestrutura/')
  assert(homepage.body.includes('href="/contato/"'), 'Homepage does not link to /contato/')
  assert(homepage.body.includes('href="/novidades/"'), 'Homepage does not link to /novidades/')
  assert(homepage.body.includes('wicolly-alcantara-3454102a7'), 'Homepage does not link to the confirmed LinkedIn')
  for (const phrase of ['Canva deck', 'Notion context', 'placeholder copy', 'not fake', 'GET /api/status', 'POST /api/chat', 'deck to real site']) {
    assert(!homepage.body.toLowerCase().includes(phrase.toLowerCase()), `Homepage exposes forbidden text: ${phrase}`)
  }

  await checkRedirect('/servicos', '/servicos/')
  const services = await expectPage('/servicos/', 'Diagnóstico, implementação e documentação')
  for (const text of ['Sites e páginas', 'APIs e bancos de dados', 'Linux e Docker', 'Servidores de jogos', 'Impressão 3D']) {
    assert(services.body.includes(text), `/servicos/ is missing ${text}`)
  }
  assert(services.body.includes('data-contact="technology"'), '/servicos/ is missing technology WhatsApp CTAs')
  assert(services.body.includes('wicolly@gmail.com'), '/servicos/ has an incorrect or missing email')

  await checkRedirect('/infraestrutura', '/infraestrutura/')
  await checkRedirect('/contato', '/contato/')
  await expectPage('/infraestrutura/', 'Servidores são uma base operacional')
  await expectPage('/contato/', 'Escolha o canal pelo tipo de conversa')

  for (const route of ['/sobre', '/projetos', '/novidades']) await checkRedirect(route, `${route}/`)
  const newPages = [
    ['/sobre/', 'Meu caminho entre a faculdade'], ['/projetos/', 'O que já funciona'], ['/novidades/', 'Mudanças públicas'],
    ['/projetos/campus-flow/', 'Campus Flow'], ['/projetos/veredra/', 'Veredra'], ['/projetos/little-x/', 'Little X'],
    ['/projetos/openclaw-little-x/', 'OpenClaw Little X'], ['/projetos/blacklight-3d/', 'BlackLight 3D'],
    ['/projetos/laboratorio-infraestrutura/', 'Hefesto e Poseidon'], ['/projetos/wicolly-sites/', 'Wicolly Sites'],
  ]
  for (const [pathname, text] of newPages) await expectPage(pathname, text)

  await checkRedirect('/veredra', '/veredra/')
  const veredra = await expectPage('/veredra/', 'Veredra')
  assert(veredra.body.includes('<base href="/veredra/">'), 'Veredra base href is not /veredra/')
  assert(veredra.body.includes('href="/"'), 'Veredra does not link back to the main site')
  for (const asset of [
    '/veredra/flutter.js',
    '/veredra/flutter_bootstrap.js',
    '/veredra/main.dart.js',
    '/veredra/manifest.json',
    '/veredra/flutter_service_worker.js',
    '/veredra/icons/Icon-192.png',
    '/veredra/icons/Icon-512.png',
    '/veredra/canvaskit/canvaskit.js',
    '/veredra/canvaskit/canvaskit.wasm',
  ]) {
    await checkResource(asset)
  }
  await expectPage('/veredra/rota-interna-de-smoke', 'Veredra')

  const pages = [
    ['/', 'Wícolly'],
    ['/portfolio/', 'Wícolly'],
    ['/portfolio/curriculo.html', 'Wícolly Pedro Alcântara'],
    ['/blacklight3d/', 'BlackLight 3D'],
    ['/hefesto/', 'Hefesto'],
    ['/poseidon/', 'Poseidon'],
    ['/madrinha/', 'Madrinha'],
  ]
  for (const [pathname, text] of pages) {
    const page = await expectPage(pathname, text)
    for (const resource of internalResources(page.body, pathname)) {
      await checkResource(resource)
    }
  }
  await checkRedirect('/impressoes-3d/', '/blacklight3d/')

  const homeHeaders = await request('/')
  assert(homeHeaders.headers.get('content-security-policy')?.includes("script-src 'self'"), 'Homepage CSP is missing')
  assert(homeHeaders.headers.get('x-content-type-options') === 'nosniff', 'Homepage nosniff header is missing')
  assert(homeHeaders.headers.get('x-frame-options') === 'DENY', 'Homepage frame protection is missing')

  for (const secretPath of ['/.env', '/.git/config', '/package.json', '/infra/blacklight3d/.env.example']) {
    const response = await request(secretPath, { redirect: 'manual' })
    assert(response.status === 404, `Sensitive/source path ${secretPath} is exposed with status ${response.status}`)
  }

}

async function main() {
  if (!(await waitForExpectedVersion())) {
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    failures.length = 0
    checkedResources.clear()
    await checkProductionContent()
    if (!failures.length) {
      console.log(`Production smoke passed for ${base.origin}${expectedCommit ? ` at ${expectedCommit}` : ''}.`)
      return
    }
    if (attempt < retries) {
      console.log(`Production routes are not consistent across the edge yet; retrying (${attempt}/${retries}).`)
      await delay(retryDelay)
    }
  }

  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
