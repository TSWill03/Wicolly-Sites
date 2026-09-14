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

function assert(condition, message) {
  if (!condition) failures.push(message)
}

async function request(pathname, options = {}) {
  return fetch(new URL(pathname, base), {
    redirect: options.redirect || 'follow',
    headers: { 'user-agent': 'wicolly-production-smoke/2.0' },
  })
}

async function expectPage(pathname, expectedText) {
  const response = await request(pathname)
  const body = await response.text()
  assert(response.status === 200, `${pathname} returned ${response.status}`)
  if (expectedText) assert(body.toLowerCase().includes(expectedText.toLowerCase()), `${pathname} is missing expected content: ${expectedText}`)
  return { response, body }
}

async function expectResource(pathname) {
  const response = await request(pathname)
  assert(response.status === 200, `${pathname} returned ${response.status}`)
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
  if (!response.ok) return false
  try {
    const version = await response.json()
    if (version.branch !== 'main') return false
    if (expectedCommit && version.commit !== expectedCommit) return false
    return typeof version.builtAt === 'string' && !Number.isNaN(Date.parse(version.builtAt))
  } catch {
    return false
  }
}

async function waitForExpectedVersion() {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    if (await checkVersion()) return true
    if (attempt < retries) {
      console.log(`Published commit is not ${expectedCommit} yet; retrying (${attempt}/${retries}).`)
      await delay(retryDelay)
    }
  }
  failures.push(`version.json did not reach expected commit ${expectedCommit}`)
  return false
}

async function checkProductionContent() {
  const home = await expectPage(`/?build=${encodeURIComponent(expectedCommit || 'smoke')}`, 'Eu construo sistemas')
  assert(/<html[^>]+lang=["']pt-BR["']/i.test(home.body), 'Homepage does not declare pt-BR')
  for (const href of ['/projetos/','/ia/','/infraestrutura/','/sobre/','/diario/','/contato/','/blacklight3d/']) {
    assert(home.body.includes(`href="${href}"`), `Homepage does not link to ${href}`)
  }
  assert(home.body.includes('id="infinite-scene"'), 'Homepage is missing the V6 infinite scene')
  assert(home.body.includes('flag-br') && home.body.includes('flag-us'), 'Homepage is missing graphical language flags')

  const english = await expectPage('/en/', 'I build systems')
  assert(/<html[^>]+lang=["']en["']/i.test(english.body), 'English homepage does not declare en')

  const projects = await expectPage('/projetos/', 'Projetos')
  assert(projects.body.includes('/projetos/campus-flow/'), 'Projects page is missing Campus Flow')
  assert(projects.body.includes('/projetos/veredra/'), 'Projects page is missing Veredra')

  const ai = await expectPage('/ia/', 'A inteligência não fica')
  for (const text of ['Router','Memory','Tools','Fallback']) assert(ai.body.includes(text), `/ia/ is missing ${text}`)

  const infra = await expectPage('/infraestrutura/', 'Infraestrutura como')
  for (const text of ['Tailscale','Cloudflare Tunnel','Docker','Restic + SFTP','Hefesto','Poseidon','Goiatuba']) {
    assert(infra.body.includes(text), `/infraestrutura/ is missing ${text}`)
  }

  const blacklight = await expectPage('/blacklight3d/', 'Da ideia')
  assert(blacklight.body.includes('data-scene-mode="blacklight"'), 'BlackLight scene mode is missing')
  await expectPage('/blacklight3d/orcamento/', 'Não há upload no site')
  await expectPage('/en/blacklight3d/', 'From idea')

  for (const route of ['/sobre','/projetos','/ia','/diario','/infraestrutura','/contato','/blacklight3d','/en']) {
    await checkRedirect(route, `${route}/`)
  }

  for (const asset of [
    '/shared/redesign.css','/shared/redesign.js','/shared/theme.js',
    '/shared/v6/core.css','/shared/v6/components.css','/shared/v6/blacklight.css',
    '/shared/v6/scene-engine.js','/shared/v6/scene-init.js','/shared/v6/responsive.css',
  ]) await expectResource(asset)

  const veredra = await expectPage('/veredra/', 'Veredra')
  assert(veredra.body.includes('<base href="/veredra/">'), 'Veredra base href is incorrect')
  for (const asset of ['/veredra/flutter.js','/veredra/main.dart.js','/veredra/flutter_service_worker.js']) await expectResource(asset)

  const headers = await request('/')
  assert(headers.headers.get('content-security-policy')?.includes("script-src 'self'"), 'Homepage CSP is missing')
  assert(headers.headers.get('x-content-type-options') === 'nosniff', 'Homepage nosniff header is missing')
  assert(headers.headers.get('x-frame-options') === 'DENY', 'Homepage frame protection is missing')
}

async function main() {
  if (!(await waitForExpectedVersion())) {
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    failures.length = 0
    await checkProductionContent()
    if (!failures.length) {
      console.log(`Production V6 smoke passed for ${base.origin}${expectedCommit ? ` at ${expectedCommit}` : ''}.`)
      return
    }
    if (attempt < retries) {
      console.log(`Production V6 routes are not consistent across the edge yet; retrying (${attempt}/${retries}).`)
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
