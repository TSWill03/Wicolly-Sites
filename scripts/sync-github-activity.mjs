import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outputPath = path.join(root, 'data', 'generated', 'github-activity.json')
const MAX_ITEMS = 5
const API = process.env.GITHUB_API_URL || 'https://api.github.com'

const kindLabels = {
  feat: 'Funcionalidade', fix: 'Correção', docs: 'Documentação', refactor: 'Refatoração',
  test: 'Teste', perf: 'Desempenho', build: 'Build', ci: 'Entrega contínua', release: 'Release', update: 'Atualização',
}

function cleanText(value) {
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\b(?:gh[opsu]_[A-Za-z0-9_]{20,}|Bearer\s+[A-Za-z0-9._~+/=-]{20,})\b/gi, '[conteúdo removido]')
    .replace(/\b(?:10|127|169\.254|172\.(?:1[6-9]|2\d|3[01])|192\.168)(?:\.\d{1,3}){2}\b/g, '[endereço removido]')
    .replace(/(?:[A-Za-z]:\\|\/(?:home|Users|srv|opt|etc)\/)[^\s]+/gi, '[caminho removido]')
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 300)
}

function classify(message) {
  const match = cleanText(message).match(/^(feat|fix|docs|refactor|test|perf|build|ci)(?:\([^)]{1,40}\))?!?:\s*(.+)$/i)
  return match ? { type: match[1].toLowerCase(), text: match[2] } : { type: 'update', text: cleanText(message) }
}

function readable(text, type) {
  let value = cleanText(text)
  const knownTranslations = new Map([
    ['production metadata and site return link', 'Adicionados metadados de produção e um link de retorno ao site.'],
    ['add production metadata and site return link', 'Adicionados metadados de produção e um link de retorno ao site.'],
    ['normalize redirected pwa cache responses', 'Normalizadas as respostas redirecionadas do cache da PWA.'],
    ['repair web epub import and expand browser tests', 'Corrigida a importação de EPUB no navegador e ampliada a cobertura de testes no navegador.'],
    ['isolate google auth and configure production web', 'Isolada a autenticação do Google e configurada a versão web de produção.'],
    ['keep ios ci compatible with stable xcode', 'Mantida a integração contínua do iOS compatível com a versão estável do Xcode.'],
    ['retry production smoke during pages propagation', 'Repetido o smoke de produção durante a propagação do Cloudflare Pages.'],
    ['restrict production deploy and add smoke validation', 'Restrito o deploy de produção e adicionada validação por smoke test.'],
    ['integrate latest veredra web release', 'Integrada a versão web mais recente do Veredra.'],
    ['rebuild commercial site in brazilian portuguese', 'Reconstruído o site comercial em português brasileiro.'],
    ['serve veredra offline after canonical redirect', 'Mantido o Veredra disponível offline após o redirecionamento canônico.'],
  ])
  const translated = knownTranslations.get(value.toLowerCase())
  if (translated) return translated
  const replacements = [
    [/^repair\s+/i, 'Corrigido: '], [/^fix\s+/i, 'Corrigido: '], [/^add\s+/i, 'Adicionado: '],
    [/^update\s+/i, 'Atualizado: '], [/^improve\s+/i, 'Melhorado: '], [/^remove\s+/i, 'Removido: '],
    [/^expand\s+/i, 'Ampliado: '], [/^implement\s+/i, 'Implementado: '], [/^publish\s+/i, 'Publicado: '],
    [/^integrate\s+/i, 'Integrado: '], [/^split\s+/i, 'Separado: '], [/^document\s+/i, 'Documentado: '],
  ]
  for (const [pattern, replacement] of replacements) {
    if (pattern.test(value)) { value = value.replace(pattern, replacement); break }
  }
  if (!/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(value)) value = value.charAt(0).toUpperCase() + value.slice(1)
  if (!/[.!?]$/.test(value)) value += '.'
  if (type === 'feat' && !value.includes(':')) value = `Nova funcionalidade: ${value}`
  if (type === 'fix' && !value.includes(':')) value = `Correção: ${value}`
  return value
}

function shouldPublish(message) {
  const clean = cleanText(message)
  if (!clean || /^merge\b/i.test(clean) || /dependabot|renovate\[bot\]|github-actions\[bot\]|(?:^|-)pr-?\d+$/i.test(clean)) return false
  const { type, text } = classify(clean)
  if ((type === 'ci' || type === 'build') && !/deploy|production|public|site|security|release|artifact/i.test(text)) return false
  return true
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date)).replace('.', '')
}

async function github(pathName) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 12000)
  const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'Wicolly-Sites-Activity-Sync', 'X-GitHub-Api-Version': '2022-11-28' }
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  try {
    const response = await fetch(`${API}${pathName}`, { headers, signal: controller.signal })
    if (!response.ok) throw new Error(`GitHub API returned HTTP ${response.status}`)
    return response.json()
  } finally {
    clearTimeout(timeout)
  }
}

function repoName(project) {
  if (!project.repository) return null
  const url = new URL(project.repository)
  return url.pathname.replace(/^\//, '').replace(/\.git$/, '')
}

function releaseItems(releases) {
  return releases.filter((release) => !release.draft).slice(0, MAX_ITEMS).map((release) => ({
    type: 'release', kindLabel: kindLabels.release, summary: readable(release.name || release.tag_name, 'release'),
    date: release.published_at || release.created_at, displayDate: formatDate(release.published_at || release.created_at),
    url: release.html_url,
  }))
}

function commitItems(commits) {
  return commits.filter((item) => shouldPublish(item.commit?.message?.split('\n')[0])).slice(0, MAX_ITEMS).map((item) => {
    const { type, text } = classify(item.commit.message.split('\n')[0])
    const date = item.commit.author?.date || item.commit.committer?.date
    return { type, kindLabel: kindLabels[type], summary: readable(text, type), date, displayDate: formatDate(date), url: null }
  })
}

async function syncPublic(project) {
  const repository = repoName(project)
  if (!repository) throw new Error('Public activity requires a repository URL')
  const metadata = await github(`/repos/${repository}`)
  if (metadata.private || String(metadata.visibility).toLowerCase() !== 'public') throw new Error('Repository is not public; automatic activity is blocked')
  const releases = await github(`/repos/${repository}/releases?per_page=${MAX_ITEMS}`)
  const items = releaseItems(releases)
  if (items.length) return { name: project.name, repository, visibility: 'public', mode: 'public', source: 'releases', items }
  const commits = await github(`/repos/${repository}/commits?per_page=20`)
  return { name: project.name, repository, visibility: 'public', mode: 'public', source: 'commits', items: commitItems(commits) }
}

function manualItems(project, manual) {
  return (manual[project.slug] || []).slice(0, MAX_ITEMS).map((item) => {
    const type = kindLabels[item.type] ? item.type : 'update'
    const date = item.date
    return { type, kindLabel: kindLabels[type], summary: readable(item.summary, type), date, displayDate: formatDate(date), url: item.url || null }
  })
}

async function main() {
  const [projects, manual, cached] = await Promise.all([
    fs.readFile(path.join(root, 'data', 'projects.json'), 'utf8').then(JSON.parse),
    fs.readFile(path.join(root, 'data', 'private-project-public-updates.json'), 'utf8').then(JSON.parse),
    fs.readFile(outputPath, 'utf8').then(JSON.parse).catch(() => ({ projects: {} })),
  ])
  const next = { generatedAt: new Date().toISOString(), source: 'github-and-reviewed-manual', projects: { ...cached.projects } }
  let successes = 0
  const warnings = []
  for (const project of projects.filter((item) => item.showGitHubActivity)) {
    try {
      if (project.githubActivityMode === 'public') next.projects[project.slug] = await syncPublic(project)
      else if (project.githubActivityMode === 'manual' || project.githubActivityMode === 'sanitized') {
        next.projects[project.slug] = { name: project.name, repository: null, visibility: project.visibility, mode: project.githubActivityMode, source: 'reviewed-manual-file', items: manualItems(project, manual) }
      } else {
        next.projects[project.slug] = { name: project.name, repository: null, visibility: project.visibility, mode: 'disabled', source: 'disabled', items: [] }
      }
      successes += 1
    } catch (error) {
      warnings.push(`${project.slug}: ${error instanceof Error ? error.message : 'unknown sync failure'}`)
    }
  }
  if (!successes) {
    console.warn('GitHub activity sync unavailable; keeping the versioned cache unchanged.')
    for (const warning of warnings) console.warn(`- ${warning}`)
    return
  }
  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`)
  console.log(`GitHub activity cache updated for ${successes} project(s).`)
  for (const warning of warnings) console.warn(`- ${warning}; previous cache kept.`)
}

main().catch((error) => {
  console.warn(`GitHub activity sync failed; keeping the versioned cache: ${error instanceof Error ? error.message : error}`)
})
