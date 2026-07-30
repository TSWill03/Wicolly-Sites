import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { publishingAdapters } from './content-publish-adapters.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = new Map(process.argv.slice(2).map((arg, index, all) => arg.startsWith('--') ? [arg.slice(2), all[index + 1]?.startsWith('--') ? true : all[index + 1]] : [Symbol(index), arg]))
const type = String(args.get('tipo') || 'projeto')
const slug = String(args.get('slug') || '')

function escapeMarkdown(value) { return String(value || '').replace(/[<>]/g, '') }

function saoPauloDate() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const get = (name) => parts.find((item) => item.type === name)?.value
  return `${get('year')}-${get('month')}-${get('day')}`
}

function hashtags(subject) {
  const base = ['#Desenvolvimento', '#ProjetosReais', '#AprendizadoEmPúblico']
  const tech = (subject.technologies || []).slice(0, 4).map((item) => `#${item.replace(/[^A-Za-zÀ-ÿ0-9]/g, '')}`).filter((item) => item.length > 1)
  return [...new Set([...base, ...tech])].slice(0, 8).join(' ')
}

function utm(url, campaign) {
  const target = new URL(url || 'https://wicolly.com.br/')
  target.searchParams.set('utm_source', 'content_studio')
  target.searchParams.set('utm_medium', 'organic_social')
  target.searchParams.set('utm_campaign', campaign)
  return target.toString()
}

function projectDraft(item) {
  const link = utm(item.productionUrl || `https://wicolly.com.br/projetos/${item.slug}/`, item.slug)
  const summary = escapeMarkdown(item.shortDescription)
  const problem = escapeMarkdown(item.problemsSolved?.[0])
  const lesson = escapeMarkdown(item.lessonsLearned?.[0])
  return { title: item.name, link, short: `${item.name}: ${summary} Estado atual: ${item.status}.`, detailed: `Estou construindo ${item.name}.\n\nO ponto de partida foi simples: ${problem}. Hoje o projeto está em ${item.status.toLowerCase()} e ainda tem limites claros.\n\nUma coisa que aprendi no processo: ${lesson}.\n\nDetalhes e próximos passos: ${link}`, linkedin: `Projeto em andamento: ${item.name}\n\n${summary}\n\nProblema que estou tentando resolver: ${problem}.\n\nO que este trabalho já me ensinou: ${lesson}. Não apresento esta etapa como produto final; o estado público é “${item.status}”.\n\nEstudo de caso: ${link}`, status: `${item.name} — ${summary}\nVeja o estado atual: ${link}`, description: `${item.name} é ${summary.charAt(0).toLowerCase()}${summary.slice(1)}`, alt: item.screenshots?.[0]?.alt || `Registro real do projeto ${item.name}; imagem ainda precisa ser produzida.`, scenes: ['Tela inicial ou visão geral do projeto', 'Detalhe do problema resolvido', 'Uma interação funcionando', 'Próximo passo escrito na tela'] }
}

function productDraft(item) {
  const link = utm(`https://wicolly.com.br/blacklight3d/#produto-${item.slug}`, `blacklight-${item.slug}`)
  const summary = `${item.name} sob orçamento: ${item.customization}`
  return { title: `BlackLight 3D — ${item.name}`, link, short: `${summary} Foto real e especificações serão confirmadas antes da publicação do item.`, detailed: `${summary}\n\nMaterial, dimensões e prazo dependem do uso e serão definidos no orçamento. Esta categoria ainda não representa um produto pronto.\n\nPrepare seu pedido: ${link}`, linkedin: `A BlackLight 3D está preparando a categoria ${item.name}.\n\n${item.customization}\n\nO cadastro só será tratado como produto quando houver foto real, medidas, material e tempo de produção confirmados. Enquanto isso, o site abre um orçamento estruturado: ${link}`, status: `Precisa de ${item.name.toLowerCase()}? Envie o uso, as medidas e a quantidade: ${link}`, description: summary, alt: `Foto real de ${item.name} ainda não produzida para o catálogo.`, scenes: ['Peça real girando sobre uma superfície neutra', 'Close do acabamento e das camadas', 'Régua ou paquímetro mostrando a escala', 'Peça em uso no contexto real'] }
}

async function main() {
  if (!slug || !['projeto', 'produto'].includes(type)) throw new Error('Uso: npm run campanha -- --tipo projeto|produto --slug nome-do-item')
  const source = type === 'projeto' ? 'data/projects.json' : 'data/blacklight-products.json'
  const items = JSON.parse(await fs.readFile(path.join(root, source), 'utf8'))
  const item = items.find((entry) => entry.slug === slug)
  if (!item) throw new Error(`${type} não encontrado: ${slug}`)
  const draft = type === 'projeto' ? projectDraft(item) : productDraft(item)
  const directory = path.join(root, 'content', 'drafts', `${saoPauloDate()}-${slug}`)
  const tags = hashtags(item)
  const markdown = `# Pacote de divulgação — ${escapeMarkdown(draft.title)}\n\n> Rascunho local. Revise fatos, imagens, links e tom antes de publicar. Nenhum adaptador publica sem aprovação humana.\n\n## Legenda curta para Instagram\n\n${draft.short}\n\n${tags}\n\n## Legenda detalhada para Instagram\n\n${draft.detailed}\n\n${tags}\n\n## Texto para LinkedIn\n\n${draft.linkedin}\n\n## WhatsApp Status\n\n${draft.status}\n\n## Descrição de produto ou projeto\n\n${draft.description}\n\n## Roteiro de vídeo — 15 segundos\n\n1. 0–3s: mostrar o contexto e escrever “${escapeMarkdown(draft.title)}”.\n2. 3–9s: mostrar o problema e uma função real.\n3. 9–13s: mostrar o estado atual sem esconder limitações.\n4. 13–15s: CTA para ${draft.link}.\n\n## Roteiro de vídeo — 30 segundos\n\n1. 0–5s: contexto e problema em uma frase.\n2. 5–13s: duas cenas do processo real.\n3. 13–21s: demonstrar o que já funciona.\n4. 21–26s: dizer o que ainda falta.\n5. 26–30s: mostrar o link e convidar para acompanhar ou pedir orçamento.\n\n## Sugestões de cenas\n\n${draft.scenes.map((scene) => `- ${scene}`).join('\n')}\n\n## Texto alternativo\n\n${draft.alt}\n\n## Hashtags\n\n${tags}\n\n## Link com UTM\n\n${draft.link}\n\n## Checklist de imagens\n\n- [ ] Usar somente foto ou screenshot real.\n- [ ] Remover nomes, caminhos, notificações e dados pessoais da captura.\n- [ ] Capturar uma visão geral em formato vertical.\n- [ ] Capturar um detalhe que comprove a função ou o acabamento.\n- [ ] Confirmar autorização de qualquer pessoa ou marca visível.\n- [ ] Escrever texto alternativo específico.\n- [ ] Revisar datas, estado do projeto e CTA.\n- [ ] Obter aprovação humana antes de publicar.\n\n## Adaptadores futuros\n\n\`\`\`json\n${JSON.stringify(publishingAdapters, null, 2)}\n\`\`\`\n`
  await fs.mkdir(directory, { recursive: true })
  await fs.writeFile(path.join(directory, 'campanha.md'), markdown)
  await fs.writeFile(path.join(directory, 'campanha.json'), `${JSON.stringify({ type, slug, ...draft, hashtags: tags.split(' '), publishingAdapters }, null, 2)}\n`)
  console.log(path.relative(root, directory).replaceAll(path.sep, '/'))
}

main().catch((error) => { console.error(error instanceof Error ? error.message : error); process.exit(1) })
