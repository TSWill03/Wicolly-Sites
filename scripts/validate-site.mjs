import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const failures = []
const requiredProjectFields = ['slug', 'name', 'shortDescription', 'longDescription', 'status', 'visibility', 'technologies', 'repository', 'productionUrl', 'screenshots', 'highlights', 'problemsSolved', 'lessonsLearned', 'nextSteps', 'featured', 'showGitHubActivity', 'githubActivityMode']

function rel(value) { return path.relative(root, value).replaceAll(path.sep, '/') }
function file(value) { return path.join(root, value) }
function read(value) { return fs.readFileSync(file(value), 'utf8') }
function json(value) { return JSON.parse(read(value)) }
function exists(value) { try { return fs.statSync(file(value)).isFile() } catch { return false } }
function assert(condition, message) { if (!condition) failures.push(message) }

const required = [
  'data/profile.json', 'data/social-links.json', 'data/projects.json', 'data/credentials.json',
  'data/blacklight-products.json', 'data/blacklight-gallery.json', 'data/ecosystem.json', 'data/infrastructure.json', 'data/generated/github-activity.json',
  'scripts/site-renderer.mjs', 'scripts/sync-github-activity.mjs', 'scripts/content-studio.mjs',
  'dist/index.html', 'dist/sobre/index.html', 'dist/projetos/index.html', 'dist/novidades/index.html',
  'dist/servicos/index.html', 'dist/infraestrutura/index.html', 'dist/contato/index.html',
  'dist/hefesto/index.html', 'dist/poseidon/index.html', 'dist/blacklight3d/index.html', 'dist/portfolio/index.html', 'dist/portfolio/curriculo.html',
  'dist/portfolio/curriculo.pdf', 'dist/assets/projects/campus-flow.webp', 'dist/assets/projects/veredra.webp',
  'dist/shared/redesign.css', 'dist/shared/redesign.js', 'dist/shared/theme.js', 'dist/shared/og-card.svg', 'dist/version.json',
  'dist/_headers', 'dist/_redirects', 'dist/robots.txt', 'dist/sitemap.xml', 'dist/404.html',
  'dist/veredra/index.html', 'dist/veredra/main.dart.js', 'dist/veredra/flutter_service_worker.js',
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
assert(profile.education.period === '2023–2027', 'Confirmed academic period is missing')
assert(profile.academicLeadership.includes('Presidente'), 'Confirmed academic leadership is missing')
assert(profile.portrait === null, 'Portrait must remain empty until a real authorized photograph exists')
assert(links.github === 'https://github.com/TSWill03', 'GitHub link is incorrect')
assert(links.linkedin === 'https://br.linkedin.com/in/wicolly-alcantara-3454102a7', 'LinkedIn link is incorrect')
assert(/^55\d{10,11}$/.test(links.technologyWhatsApp), 'Technology WhatsApp format is invalid')
assert(/^55\d{10,11}$/.test(links.blacklightWhatsApp), 'BlackLight WhatsApp format is invalid')

assert(projects.length >= 7, 'Expected at least seven documented projects')
const slugs = new Set()
for (const project of projects) {
  for (const field of requiredProjectFields) assert(Object.hasOwn(project, field), `${project.slug || 'project'} is missing ${field}`)
  assert(!slugs.has(project.slug), `Duplicate project slug: ${project.slug}`)
  slugs.add(project.slug)
  assert(exists(`dist/projetos/${project.slug}/index.html`), `Missing study case for ${project.slug}`)
  if (project.visibility === 'private') {
    assert(project.repository === null, `${project.slug} must not expose its private repository`)
    assert(['manual', 'disabled', 'sanitized'].includes(project.githubActivityMode), `${project.slug} has an unsafe private activity mode`)
  }
}

for (const slug of ['wicolly-sites', 'campus-flow', 'veredra']) {
  const entry = activity.projects[slug]
  assert(entry?.visibility === 'public', `${slug} activity must be verified public`)
  assert(entry?.mode === 'public', `${slug} must use public activity mode`)
}
for (const slug of ['little-x', 'openclaw-little-x']) {
  const entry = activity.projects[slug]
  assert(entry?.repository === null, `${slug} activity must not publish repository metadata`)
  assert(entry?.mode === 'manual', `${slug} activity must remain manual`)
}
for (const [slug, entry] of Object.entries(activity.projects)) {
  assert((entry.items || []).length <= 5, `${slug} exceeds the public activity limit`)
  for (const item of entry.items || []) {
    assert(!/\b[0-9a-f]{40}\b/i.test(JSON.stringify(item)), `${slug} exposes a full commit SHA`)
    assert(!/^merge\b/i.test(item.summary), `${slug} exposes a merge commit`)
  }
}

assert(products.length >= 9, 'BlackLight must provide the initial quote categories')
for (const product of products) {
  if (!product.image) assert(product.realProduct === false, `${product.slug} cannot be a real product without a real image`)
  assert(product.materials.length === 0 || product.realProduct, `${product.slug} must not invent materials`)
}
assert(gallery.items.length === 0, 'BlackLight gallery must remain empty until real photos are provided')

const generatedPages = ['dist/index.html', 'dist/sobre/index.html', 'dist/projetos/index.html', 'dist/novidades/index.html', 'dist/servicos/index.html', 'dist/infraestrutura/index.html', 'dist/contato/index.html', 'dist/privacidade/index.html', 'dist/hefesto/index.html', 'dist/poseidon/index.html', 'dist/blacklight3d/index.html', 'dist/portfolio/index.html', 'dist/portfolio/curriculo.html', ...projects.map((project) => `dist/projetos/${project.slug}/index.html`)]
for (const page of generatedPages) {
  const html = read(page)
  assert(/<!doctype html>/i.test(html), `${page} is missing doctype`)
  assert(/<html lang="pt-BR">/i.test(html), `${page} must declare pt-BR`)
  assert(/<title>[^<]+<\/title>/i.test(html), `${page} is missing title`)
  assert(/<meta name="description" content="[^"]+">/i.test(html), `${page} is missing description`)
  assert(/rel="canonical"/i.test(html), `${page} is missing canonical metadata`)
  if (!page.endsWith('curriculo.html')) {
    assert(/property="og:title"/i.test(html), `${page} is missing Open Graph metadata`)
    assert(/name="twitter:card"/i.test(html), `${page} is missing Twitter Card metadata`)
    assert(/<h1[\s>]/i.test(html), `${page} is missing h1`)
    assert(/data-menu-toggle/i.test(html), `${page} is missing keyboard-accessible navigation`)
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(match[1]) } catch { failures.push(`${page} has invalid JSON-LD`) }
  }
}

const home = read('dist/index.html')
for (const expected of ['Escolha o caminho pela sua necessidade', 'O que estou construindo agora', 'Projetos que existem além desta página', 'Formação e trajetória', 'Trabalhos contratáveis', '/infraestrutura/', '/contato/']) assert(home.includes(expected), `Home is missing: ${expected}`)
assert(home.includes('data-theme-toggle'), 'Home is missing the theme control')

const about = read('dist/sobre/index.html')
assert(about.includes('mais afinidade com back-end'), 'About page must discuss the professional frontend tradeoff')
assert(about.includes('/portfolio/curriculo.pdf'), 'About page must link the PDF resume')

const news = read('dist/novidades/index.html')
assert(news.includes('data-news-filter'), 'News page is missing project filters')
assert(!/\b[0-9a-f]{40}\b/i.test(news), 'News page exposes a full SHA')

const blacklight = read('dist/blacklight3d/index.html')
for (const field of ['nome', 'tipo', 'descricao', 'quantidade', 'medidas', 'cor', 'finalidade', 'prazo', 'arquivo', 'observacoes']) assert(blacklight.includes(`name="${field}"`), `BlackLight quote form is missing ${field}`)
assert(blacklight.includes('não há upload no site'), 'BlackLight must explain that file upload is unavailable')
assert(blacklight.includes('Foto real será adicionada em breve'), 'BlackLight must disclose missing real product photos')
assert(!blacklight.includes('"@type":"Product"'), 'BlackLight must not emit Product schema for unconfirmed products')

const resume = read('dist/portfolio/curriculo.html')
assert(resume.includes(profile.name) && resume.includes(links.linkedin), 'Resume is not using the central profile')
assert(fs.statSync(file('dist/portfolio/curriculo.pdf')).size > 20000, 'Resume PDF appears invalid or empty')

const forbidden = [
  'Amiltomério', 'Doutorado em Ciências Sociais e Empresariais', 'Filosofia Clínica', 'diretor financeiro',
  'Transformando ideias em realidade', 'Soluções inovadoras para o futuro', 'Tecnologia com propósito',
  'Experiências digitais incríveis', 'Ecossistema tecnológico de ponta', 'Paixão por inovação',
  'seusite.com', 'Plataforma de Ensino Exemplo', 'Instituicao Criativa', 'Academia Digital', 'Programa Tech Cloud',
]
const secretPatterns = [
  /-----BEGIN (?:OPENSSH|RSA|EC|DSA|PRIVATE) PRIVATE KEY-----/,
  /\bgh[opsu]_[A-Za-z0-9_]{20,}/,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{20,}/i,
  /\b(?:10|127|169\.254|172\.(?:1[6-9]|2\d|3[01])|192\.168)(?:\.\d{1,3}){2}\b/,
]
const publishedPages = [...generatedPages, 'dist/madrinha/index.html', 'dist/404.html']
const publishedText = publishedPages.map(read).join('\n')
for (const phrase of forbidden) assert(!publishedText.toLowerCase().includes(phrase.toLowerCase()), `Published site contains forbidden content: ${phrase}`)
for (const pattern of secretPatterns) assert(!pattern.test(publishedText), `Published site matches sensitive pattern: ${pattern}`)
assert(!publishedText.includes('TSWill03/LittleX') && !publishedText.includes('TSWill03/OpenClaw_LittleX'), 'Published site exposes private repository names')

function resolveLocal(urlValue, pagePath) {
  if (!urlValue || /^(?:https?:|mailto:|tel:|data:|blob:|#)/i.test(urlValue)) return null
  const clean = urlValue.split(/[?#]/)[0]
  if (!clean) return null
  if (clean.startsWith('/')) return path.join(dist, clean.slice(1))
  return path.resolve(path.dirname(file(pagePath)), clean)
}
for (const page of generatedPages) {
  const html = read(page)
  for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
    const target = resolveLocal(match[1], page)
    if (!target) continue
    const valid = fs.existsSync(target) && (fs.statSync(target).isFile() || fs.existsSync(path.join(target, 'index.html')))
    assert(valid, `${page} links a missing local asset: ${match[1]}`)
  }
}

const redirects = read('dist/_redirects')
for (const route of ['/sobre', '/projetos', '/novidades', '/portfolio', '/servicos', '/infraestrutura', '/contato', '/blacklight3d', '/veredra']) assert(redirects.includes(`${route} `), `Missing trailing-slash redirect for ${route}`)
const sitemap = read('dist/sitemap.xml')
for (const route of ['/sobre/', '/projetos/', '/novidades/', '/servicos/', '/infraestrutura/', '/contato/', '/blacklight3d/']) assert(sitemap.includes(`https://wicolly.com.br${route}`), `Sitemap is missing ${route}`)

const headers = read('dist/_headers')
assert(headers.includes('Content-Security-Policy:'), 'Generated routes are missing CSP')
assert(!headers.includes('__CSP_SCRIPT_HASHES__'), 'CSP hashes were not generated')
assert(!headers.includes("'unsafe-inline'") && !headers.includes("'unsafe-eval'"), 'CSP must not allow unsafe inline/eval scripts')
for (const header of ['X-Content-Type-Options: nosniff', 'Referrer-Policy: strict-origin-when-cross-origin', 'Permissions-Policy:', 'X-Frame-Options: DENY']) assert(headers.includes(header), `Missing security header: ${header}`)

const frontendJs = read('dist/shared/redesign.js')
for (const sink of ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'document.write', 'eval(', 'new Function', 'postMessage(']) assert(!frontendJs.includes(sink), `Frontend JavaScript contains unsafe sink: ${sink}`)
assert(!frontendJs.includes('window.WICOLLY_SITE'), 'Generated frontend must not depend on a clobberable window config')

const workflow = read('.github/workflows/deploy-cloudflare-pages.yml')
assert(workflow.includes('schedule:') && workflow.includes('workflow_dispatch:'), 'Workflow must support daily and manual sync')
assert(workflow.includes('npm run sync:github'), 'Workflow does not sync activity before build')
assert(workflow.includes('secrets.GITHUB_TOKEN'), 'Workflow must scope GitHub token to the sync step')
assert(!/git\s+(?:commit|push)/.test(workflow), 'Workflow must not auto-commit generated activity')

const version = json('dist/version.json')
assert(version.commit && version.branch && version.builtAt, 'version.json is incomplete')

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exit(1)
}
console.log(`Validated ${generatedPages.length} generated pages, ${projects.length} studies, privacy gates, metadata, local assets, activity policy and security headers.`)
