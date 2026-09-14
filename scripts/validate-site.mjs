import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const failures = []

const rel = (value) => path.relative(root, value).replaceAll(path.sep, '/')
const file = (value) => path.join(root, value)
const read = (value) => fs.readFileSync(file(value), 'utf8')
const json = (value) => JSON.parse(read(value))
const exists = (value) => { try { return fs.statSync(file(value)).isFile() } catch { return false } }
const assert = (condition, message) => { if (!condition) failures.push(message) }

const required = [
  'data/profile.json','data/social-links.json','data/projects.json','data/blacklight-products.json','data/blacklight-gallery.json','data/ecosystem.json','data/infrastructure.json','data/generated/github-activity.json',
  'scripts/site-renderer.mjs','scripts/build-site.mjs','scripts/sync-github-activity.mjs','scripts/content-studio.mjs',
  'dist/index.html','dist/sobre/index.html','dist/projetos/index.html','dist/ia/index.html','dist/diario/index.html','dist/novidades/index.html','dist/servicos/index.html','dist/infraestrutura/index.html','dist/borda/index.html','dist/hefesto/index.html','dist/poseidon/index.html','dist/goiatuba/index.html','dist/contato/index.html','dist/privacidade/index.html',
  'dist/blacklight3d/index.html','dist/blacklight3d/projetos/index.html','dist/blacklight3d/orcamento/index.html',
  'dist/en/index.html','dist/en/about/index.html','dist/en/projects/index.html','dist/en/ai/index.html','dist/en/infrastructure/index.html','dist/en/journal/index.html','dist/en/contact/index.html','dist/en/blacklight3d/index.html','dist/en/blacklight3d/projects/index.html','dist/en/blacklight3d/quote/index.html',
  'dist/portfolio/index.html','dist/portfolio/curriculo.html','dist/portfolio/curriculo.pdf',
  'dist/assets/projects/campus-flow.webp','dist/assets/projects/veredra.webp','dist/shared/redesign.css','dist/shared/redesign.js','dist/shared/theme.js','dist/shared/og-card.svg','dist/version.json','dist/_headers','dist/_redirects','dist/robots.txt','dist/sitemap.xml','dist/404.html',
  'dist/veredra/index.html','dist/veredra/main.dart.js','dist/veredra/flutter_service_worker.js',
]
for (const item of required) assert(exists(item), `Missing required file: ${item}`)

const profile = json('data/profile.json')
const links = json('data/social-links.json')
const projects = json('data/projects.json')
const products = json('data/blacklight-products.json')
const gallery = json('data/blacklight-gallery.json')
const activity = json('data/generated/github-activity.json')

assert(profile.name === 'Wícolly Pedro Alcântara', 'Profile owner must be Wícolly Pedro Alcântara')
assert(profile.education.institution === 'IF Goiano — Campus Morrinhos', 'Confirmed institution is missing')
assert(profile.academicLeadership.includes('Presidente'), 'Confirmed academic leadership is missing')
assert(profile.portrait === null, 'Portrait must remain empty until a real authorized photograph exists')
assert(links.github === 'https://github.com/TSWill03', 'GitHub link is incorrect')
assert(links.linkedin === 'https://br.linkedin.com/in/wicolly-alcantara-3454102a7', 'LinkedIn link is incorrect')
assert(/^55\d{10,11}$/.test(links.technologyWhatsApp), 'Technology WhatsApp format is invalid')
assert(/^55\d{10,11}$/.test(links.blacklightWhatsApp), 'BlackLight WhatsApp format is invalid')

assert(projects.length >= 7, 'Expected at least seven documented projects')
const slugs = new Set()
for (const project of projects) {
  assert(project.slug && project.name && project.shortDescription && project.longDescription, `${project.slug || 'project'} has incomplete core metadata`)
  assert(!slugs.has(project.slug), `Duplicate project slug: ${project.slug}`); slugs.add(project.slug)
  assert(exists(`dist/projetos/${project.slug}/index.html`), `Missing PT study case for ${project.slug}`)
  assert(exists(`dist/en/projects/${project.slug}/index.html`), `Missing EN study case for ${project.slug}`)
  if (project.visibility === 'private') {
    assert(project.repository === null, `${project.slug} data source must keep private repository metadata out of JSON`)
    assert(['manual','disabled','sanitized'].includes(project.githubActivityMode), `${project.slug} has unsafe activity mode`)
  }
}
for (const slug of ['little-x','openclaw-little-x']) {
  const entry = activity.projects[slug]
  assert(entry?.repository === null, `${slug} activity cache must not publish private repository metadata`)
  assert(entry?.mode === 'manual', `${slug} activity must remain manual`)
}
for (const [slug, entry] of Object.entries(activity.projects || {})) {
  assert((entry.items || []).length <= 5, `${slug} exceeds the public activity limit`)
  for (const item of entry.items || []) {
    assert(!/\b[0-9a-f]{40}\b/i.test(JSON.stringify(item)), `${slug} exposes a full commit SHA`)
    assert(!/^merge\b/i.test(item.summary || ''), `${slug} exposes a merge commit`)
  }
}

assert(products.length >= 9, 'BlackLight must provide initial quote categories')
for (const product of products) {
  if (!product.image) assert(product.realProduct === false, `${product.slug} cannot be a real product without a real image`)
  assert(product.materials.length === 0 || product.realProduct, `${product.slug} must not invent materials`)
}
assert(gallery.items.length === 0, 'BlackLight gallery must remain empty until real photos are provided')

const ptPages = [
  'dist/index.html','dist/sobre/index.html','dist/projetos/index.html','dist/ia/index.html','dist/diario/index.html','dist/novidades/index.html','dist/servicos/index.html','dist/infraestrutura/index.html','dist/borda/index.html','dist/hefesto/index.html','dist/poseidon/index.html','dist/goiatuba/index.html','dist/contato/index.html','dist/privacidade/index.html','dist/blacklight3d/index.html','dist/blacklight3d/projetos/index.html','dist/blacklight3d/orcamento/index.html','dist/portfolio/index.html',
  ...projects.map((project) => `dist/projetos/${project.slug}/index.html`),
]
const enPages = [
  'dist/en/index.html','dist/en/about/index.html','dist/en/projects/index.html','dist/en/ai/index.html','dist/en/infrastructure/index.html','dist/en/journal/index.html','dist/en/contact/index.html','dist/en/blacklight3d/index.html','dist/en/blacklight3d/projects/index.html','dist/en/blacklight3d/quote/index.html',
  ...projects.map((project) => `dist/en/projects/${project.slug}/index.html`),
]
for (const [pages, lang] of [[ptPages,'pt-BR'],[enPages,'en']]) {
  for (const page of pages) {
    const html = read(page)
    assert(/<!doctype html>/i.test(html), `${page} is missing doctype`)
    assert(html.includes(`<html lang="${lang}">`), `${page} must declare ${lang}`)
    assert(/<title>[^<]+<\/title>/i.test(html), `${page} is missing title`)
    assert(/<meta name="description" content="[^"]+">/i.test(html), `${page} is missing description`)
    assert(/rel="canonical"/i.test(html), `${page} is missing canonical metadata`)
    assert(/rel="alternate" hreflang=/i.test(html), `${page} is missing alternate-language metadata`)
    assert(/property="og:title"/i.test(html), `${page} is missing Open Graph metadata`)
    assert(/name="twitter:card"/i.test(html), `${page} is missing Twitter Card metadata`)
    assert(/<h1[\s>]/i.test(html), `${page} is missing h1`)
    assert(/data-menu-toggle/i.test(html), `${page} is missing keyboard-accessible navigation`)
    assert(/id="infinite-scene"/i.test(html), `${page} is missing the infinite-scene canvas`)
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(match[1]) } catch { failures.push(`${page} has invalid JSON-LD`) }
    }
  }
}

const home = read('dist/index.html')
for (const expected of ['Eu construo sistemas', 'Projetos que explicam', 'AI Lab', 'BlackLight 3D', '/infraestrutura/', '/contato/']) assert(home.includes(expected), `Home is missing: ${expected}`)
assert(home.includes('flag-br') && home.includes('flag-us'), 'Home is missing graphical language flags')
assert(home.includes('data-theme-toggle'), 'Home is missing the theme control')

const enHome = read('dist/en/index.html')
assert(enHome.includes('I build systems') && enHome.includes('Selected work'), 'English home copy is incomplete')

const ai = read('dist/ia/index.html')
for (const expected of ['Router','Memory','Tools','Fallback','Fase 1D','Repositório privado']) assert(ai.includes(expected), `AI Lab is missing: ${expected}`)
assert(!ai.includes('Hermes') && !ai.includes('Hurricane') && !ai.includes('Render</'), 'Unapproved Render subdivision leaked into production')

const infrastructure = read('dist/infraestrutura/index.html')
for (const expected of ['Tailscale','Cloudflare Tunnel','Docker','Restic + SFTP','Nginx / Caddy','Uptime Kuma','Pterodactyl','SSH','/borda/','/hefesto/','/poseidon/','/goiatuba/']) assert(infrastructure.includes(expected), `Infrastructure is missing: ${expected}`)

const blacklight = read('dist/blacklight3d/index.html')
assert(blacklight.includes('data-scene-mode="blacklight"'), 'BlackLight must use the BlackLight scene engine')
assert(blacklight.includes('Tipos de projeto') || blacklight.includes('Projeto'), 'BlackLight project-oriented experience is missing')
assert(!blacklight.includes('"@type":"Product"'), 'BlackLight must not emit Product schema for unconfirmed products')
const quote = read('dist/blacklight3d/orcamento/index.html')
for (const field of ['nome','tipo','descricao','quantidade','medidas','cor','finalidade','prazo','arquivo','observacoes']) assert(quote.includes(`name="${field}"`), `BlackLight quote form is missing ${field}`)
assert(quote.includes('Não há upload no site'), 'BlackLight must disclose that file upload is unavailable')

const frontendJs = read('dist/shared/redesign.js')
for (const sink of ['innerHTML','outerHTML','insertAdjacentHTML','document.write','eval(','new Function','postMessage(']) assert(!frontendJs.includes(sink), `Frontend JavaScript contains unsafe sink: ${sink}`)
for (const expected of ['drawBLChamber','drawBLMacro','drawBLTopdown','drawBLFarm','drawBLSpool','drawBLCalibration','drawBLLayers']) assert(frontendJs.includes(expected), `Scene engine is missing ${expected}`)
assert(frontendJs.includes('pointerEvents') || read('dist/shared/redesign.css').includes('pointer-events:none'), 'Scene layer must not block navigation clicks')

const publishedText = [...ptPages,...enPages,'dist/404.html'].filter(exists).map(read).join('\n')
const forbidden = ['Amiltomério','Doutorado em Ciências Sociais e Empresariais','diretor financeiro','Transformando ideias em realidade','Soluções inovadoras para o futuro','seusite.com']
for (const phrase of forbidden) assert(!publishedText.toLowerCase().includes(phrase.toLowerCase()), `Published site contains forbidden content: ${phrase}`)
const secretPatterns = [/-----BEGIN (?:OPENSSH|RSA|EC|DSA|PRIVATE) PRIVATE KEY-----/,/\bgh[opsu]_[A-Za-z0-9_]{20,}/,/\bBearer\s+[A-Za-z0-9._~+/=-]{20,}/i,/\b(?:10|127|169\.254|172\.(?:1[6-9]|2\d|3[01])|192\.168)(?:\.\d{1,3}){2}\b/]
for (const pattern of secretPatterns) assert(!pattern.test(publishedText), `Published site matches sensitive pattern: ${pattern}`)
for (const name of ['TSWill03/LittleX','TSWill03/OpenClaw_LittleX']) assert(publishedText.includes(name), `Private repository acknowledgement is missing: ${name}`)

function resolveLocal(urlValue, pagePath) {
  if (!urlValue || /^(?:https?:|mailto:|tel:|data:|blob:|#)/i.test(urlValue)) return null
  const clean = urlValue.split(/[?#]/)[0]; if (!clean) return null
  if (clean.startsWith('/')) return path.join(dist, clean.slice(1))
  return path.resolve(path.dirname(file(pagePath)), clean)
}
for (const page of [...ptPages,...enPages]) {
  const html = read(page)
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const target = resolveLocal(match[1], page); if (!target) continue
    const valid = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')))
    assert(valid, `${page} links a missing local asset: ${match[1]}`)
  }
}

const redirects = read('dist/_redirects')
for (const route of ['/sobre','/projetos','/ia','/diario','/servicos','/infraestrutura','/borda','/hefesto','/poseidon','/goiatuba','/contato','/blacklight3d','/en']) assert(redirects.includes(`${route} `), `Missing trailing-slash redirect for ${route}`)
const sitemap = read('dist/sitemap.xml')
for (const route of ['/sobre/','/projetos/','/ia/','/diario/','/infraestrutura/','/borda/','/goiatuba/','/contato/','/blacklight3d/','/en/']) assert(sitemap.includes(`https://wicolly.com.br${route}`), `Sitemap is missing ${route}`)
const headers = read('dist/_headers')
assert(headers.includes('Cache-Control: public, max-age=0, must-revalidate, no-transform'), 'HTML transformations must stay disabled at the edge')
assert(headers.includes('Content-Security-Policy:'), 'Generated routes are missing CSP')
assert(!/__CSP_[A-Z_]+_HASHES__/.test(headers), 'CSP hashes were not generated')
assert(!headers.includes("'unsafe-inline'") && !headers.includes("'unsafe-eval'"), 'CSP must not allow unsafe inline/eval scripts')
const cspLines = headers.split(/\r?\n/).filter((line) => line.includes('Content-Security-Policy:'))
assert(Math.max(...cspLines.map((line) => line.length)) < 1500, 'CSP header line exceeds the Pages-safe size budget')
for (const header of ['X-Content-Type-Options: nosniff','Referrer-Policy: strict-origin-when-cross-origin','Permissions-Policy:','X-Frame-Options: DENY']) assert(headers.includes(header), `Missing security header: ${header}`)

const version = json('dist/version.json')
assert(version.commit && version.branch && version.builtAt, 'version.json is incomplete')

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exit(1)
}
console.log(`Validated V6: ${ptPages.length} PT pages, ${enPages.length} EN pages, ${projects.length} project studies, scene engine, BlackLight quote flow, links, metadata and security gates.`)
