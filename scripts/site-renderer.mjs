import fs from 'node:fs/promises'
import path from 'node:path'

const SITE = 'https://wicolly.com.br'

function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function jsonLd(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c')
}

function list(items, className = 'tag-list') {
  return `<ul class="${className}">${items.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`
}

function nav() {
  return `<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
  <header class="site-header">
    <div class="shell header-inner">
      <a class="wordmark" href="/" aria-label="Wícolly — início"><span aria-hidden="true">W/</span> Wícolly</a>
      <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-menu" data-menu-toggle>Menu</button>
      <nav id="site-menu" class="site-nav" aria-label="Navegação principal" data-menu>
        <a href="/sobre/">Sobre</a><a href="/projetos/">Projetos</a><a href="/novidades/">Novidades</a><a href="/servicos/">Serviços</a><a href="/blacklight3d/">BlackLight 3D</a>
      </nav>
    </div>
  </header>`
}

function footer(profile, links) {
  return `<footer class="site-footer"><div class="shell footer-grid">
    <div><a class="wordmark" href="/"><span aria-hidden="true">W/</span> Wícolly</a><p>${esc(profile.shortBio)}</p></div>
    <div><h2>Explorar</h2><a href="/sobre/">Sobre</a><a href="/projetos/">Projetos</a><a href="/novidades/">Novidades</a><a href="/portfolio/curriculo.html">Currículo</a></div>
    <div><h2>Contato</h2><a href="${esc(links.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="${esc(links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a><a href="mailto:${esc(links.email)}">${esc(links.email)}</a></div>
  </div><div class="shell footer-bottom"><span>© <span data-current-year>2026</span> ${esc(profile.name)}.</span><a href="/privacidade/">Privacidade</a><span>Build __BUILD_COMMIT__</span></div></footer>`
}

function layout({ profile, links, title, description, pathName, body, schema = [], extraScript = '' }) {
  const canonical = `${SITE}${pathName}`
  const schemas = [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: 'Wícolly', url: SITE, inLanguage: 'pt-BR' },
    ...schema,
  ]
  return `<!doctype html><html lang="pt-BR"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title><meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${canonical}"><meta name="theme-color" content="#0b0d12">
  <meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:site_name" content="Wícolly">
  <meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${SITE}/shared/og-card.svg">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${SITE}/shared/og-card.svg">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/shared/redesign.css">
  ${schemas.map((item) => `<script type="application/ld+json">${jsonLd(item)}</script>`).join('')}
  </head><body>${nav()}<main id="conteudo">${body}</main>${footer(profile, links)}
  <script src="/shared/site-config.js"></script><script src="/shared/redesign.js" defer></script>${extraScript}</body></html>`
}

function updateFor(project, activity) {
  const items = activity.projects?.[project.slug]?.items || []
  return items[0] || null
}

function projectMedia(project, eager = false) {
  const shot = project.screenshots?.[0]
  if (!shot) return `<div class="media-missing" role="img" aria-label="Imagem real ainda não disponível"><span>Imagem real pendente</span><small>Sem ilustração simulada</small></div>`
  return `<img class="project-image" src="${esc(shot.src)}" alt="${esc(shot.alt)}" width="1600" height="900" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`
}

function projectCard(project, activity) {
  const last = updateFor(project, activity)
  return `<article class="project-card">
    ${projectMedia(project)}
    <div class="project-card-body"><p class="kicker">${esc(project.status)}</p><h3><a href="/projetos/${esc(project.slug)}/">${esc(project.name)}</a></h3>
    <p>${esc(project.shortDescription)}</p><p><strong>Problema:</strong> ${esc(project.problemsSolved[0])}</p>
    ${list(project.technologies.slice(0, 5))}
    <p class="last-update">${last ? `Atualização pública: ${esc(last.summary)} · <time datetime="${esc(last.date)}">${esc(last.displayDate)}</time>` : 'Sem atualização pública recente.'}</p>
    <a class="text-link" href="/projetos/${esc(project.slug)}/">Ler estudo de caso <span aria-hidden="true">→</span></a></div>
  </article>`
}

function activityItems(activity, limit = 5) {
  return Object.entries(activity.projects || {})
    .flatMap(([slug, value]) => (value.items || []).map((item) => ({ ...item, slug, projectName: value.name || slug })))
    .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    .slice(0, limit)
}

function home(profile, links, projects, activity) {
  const featured = projects.filter((project) => project.featured)
  const recent = activityItems(activity, 5)
  const personSchema = {
    '@context': 'https://schema.org', '@type': 'Person', '@id': `${SITE}/#wicolly`, name: profile.name,
    url: SITE, homeLocation: { '@type': 'Place', name: profile.location },
    alumniOf: { '@type': 'CollegeOrUniversity', name: profile.education.institution },
    sameAs: [links.github, links.linkedin], jobTitle: profile.headline,
  }
  const serviceSchema = {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', '@id': `${SITE}/#servicos`, name: `${profile.name} — serviços de tecnologia`,
    url: `${SITE}/servicos/`, areaServed: 'Brasil', provider: { '@id': `${SITE}/#wicolly` },
  }
  const body = `<section class="hero"><div class="shell hero-grid"><div>
    <p class="kicker">Goiatuba · IF Goiano — Campus Morrinhos</p><h1>Eu estudo computação construindo coisas que precisam funcionar de verdade.</h1>
    <p class="hero-copy">${esc(profile.shortBio)}</p>
    <div class="actions"><a class="button primary" href="/projetos/">Ver projetos</a><a class="button" href="${esc(links.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a><a class="button" href="${esc(links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a><a class="text-link" href="#contato">Contato</a></div>
    ${list(profile.currentFocus.slice(0, 4))}
  </div><aside class="portrait-placeholder" aria-label="Espaço reservado para retrato real"><span class="portrait-mark" aria-hidden="true">W/</span><p>Retrato real ainda não publicado.</p><small>Este espaço não usa uma pessoa gerada por IA.</small></aside></div></section>
  <section class="section" aria-labelledby="projetos-destaque"><div class="shell"><div class="section-heading"><div><p class="kicker">Trabalho em andamento</p><h2 id="projetos-destaque">Projetos que existem além desta página</h2></div><p>Cada estudo de caso separa o que já funciona do que ainda é experimento.</p></div><div class="project-grid">${featured.map((project) => projectCard(project, activity)).join('')}</div></div></section>
  <section class="section ruled" aria-labelledby="agora"><div class="shell"><div class="section-heading"><div><p class="kicker">Evolução recente</p><h2 id="agora">O que estou construindo agora</h2></div><a class="text-link" href="/novidades/">Abrir todas as novidades</a></div>
  ${recent.length ? `<ol class="update-list">${recent.map((item) => `<li><time datetime="${esc(item.date)}">${esc(item.displayDate)}</time><div><strong>${esc(item.projectName)}</strong><p>${esc(item.summary)}</p></div></li>`).join('')}</ol>` : '<p class="empty-state">A sincronização pública ainda não gerou atualizações. O cache permanece válido e o site continua funcionando.</p>'}</div></section>
  <section class="section" aria-labelledby="trajetoria"><div class="shell split"><div><p class="kicker">Formação e trajetória</p><h2 id="trajetoria">Faculdade como base. Projetos como laboratório.</h2><p>${esc(profile.longBio[0])}</p><a class="text-link" href="/sobre/">Conhecer minha trajetória</a></div><ol class="timeline"><li><span>Formação</span><strong>${esc(profile.education.course)}</strong><small>${esc(profile.education.institution)} · ${esc(profile.education.period)}</small></li><li><span>Participação</span><strong>${esc(profile.academicLeadership)}</strong></li><li><span>Prática</span><strong>Aplicações, servidores e automações próprias</strong></li><li><span>Empreender</span><strong>Fundador da BlackLight 3D</strong></li><li><span>Agora</span><strong>Back-end, IA, infraestrutura e produtos úteis</strong></li></ol></div></section>
  <section class="section dark-section" aria-labelledby="servicos"><div class="shell"><div class="section-heading"><div><p class="kicker">Trabalhos contratáveis</p><h2 id="servicos">Serviços com escopo claro e entrega verificável</h2></div><p>Portfólio mostra aprendizado. Esta seção mostra trabalhos que posso avaliar e executar.</p></div><div class="service-grid">${profile.services.map((service) => `<article><h3>${esc(service.name)}</h3><p>${esc(service.description)}</p></article>`).join('')}</div><p class="experimental-note"><strong>Produtos experimentais:</strong> Campus Flow, Veredra e Little X têm estados próprios e não são vendidos como soluções finalizadas.</p><a class="button light" href="/servicos/">Ver formas de contratação</a></div></section>
  <section id="contato" class="section" aria-labelledby="contato-titulo"><div class="shell contact-panel"><div><p class="kicker">Contato</p><h2 id="contato-titulo">Conte o problema antes de pedir a tecnologia.</h2><p>Uma boa primeira mensagem explica o contexto, quem vai usar e o que precisa acontecer.</p></div><div class="contact-links"><a class="button primary" data-contact="technology" data-message="Olá, Wícolly! Vim pelo site e quero conversar sobre um projeto." href="https://wa.me/${esc(links.technologyWhatsApp)}">WhatsApp</a><a class="button" href="mailto:${esc(links.email)}">E-mail</a><a class="button" href="${esc(links.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a></div></div></section>`
  return layout({ profile, links, title: 'Wícolly Pedro Alcântara | Software, servidores e aprendizagem', description: profile.shortBio, pathName: '/', body, schema: [personSchema, serviceSchema] })
}

function about(profile, links) {
  const body = `<section class="page-hero"><div class="shell narrow"><p class="kicker">Sobre</p><h1>Meu caminho entre a faculdade, o terminal e produtos que ainda estão amadurecendo.</h1><p class="lead">${esc(profile.shortBio)}</p></div></section>
  <section class="section"><div class="shell prose-grid"><article class="prose"><h2>Em primeira pessoa</h2>${profile.longBio.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}<h2>O que estou estudando agora</h2>${list(profile.currentFocus, 'plain-list')}</article>
  <aside class="fact-sheet"><h2>Em resumo</h2><dl><dt>Nome</dt><dd>${esc(profile.name)}</dd><dt>Localização pública</dt><dd>${esc(profile.location)}</dd><dt>Formação</dt><dd>${esc(profile.education.course)}<br>${esc(profile.education.institution)}<br>${esc(profile.education.period)} · ${esc(profile.education.status)}</dd><dt>Participação acadêmica</dt><dd>${esc(profile.academicLeadership)}</dd><dt>Projeto empreendedor</dt><dd>Fundador da BlackLight 3D</dd></dl><a class="button primary" href="/portfolio/curriculo.html">Currículo HTML</a><a class="button" href="/portfolio/curriculo.pdf">Currículo PDF</a></aside></div></section>
  <section class="section ruled"><div class="shell contact-panel"><div><h2>Perfis públicos</h2><p>Experiência técnica e projetos podem ser acompanhados sem depender de scraping do LinkedIn.</p></div><div class="contact-links"><a class="button" href="${esc(links.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a><a class="button" href="${esc(links.github)}" target="_blank" rel="noopener noreferrer">GitHub</a></div></div></section>`
  return layout({ profile, links, title: `Sobre | ${profile.name}`, description: profile.shortBio, pathName: '/sobre/', body, schema: [{ '@context': 'https://schema.org', '@type': 'Person', name: profile.name, url: SITE, sameAs: [links.github, links.linkedin] }] })
}

function projectsIndex(profile, links, projects, activity, pathName = '/projetos/') {
  const body = `<section class="page-hero"><div class="shell"><p class="kicker">Projetos</p><h1>O que já funciona, o que ainda estou testando e o que aprendi no caminho.</h1><p class="lead">Não uso o mesmo rótulo para uma beta pública, um experimento privado e um serviço em operação.</p></div></section><section class="section"><div class="shell project-grid">${projects.map((project) => projectCard(project, activity)).join('')}</div></section>`
  return layout({ profile, links, title: `Projetos | ${profile.name}`, description: 'Estudos de caso de software, infraestrutura, automação e impressão 3D desenvolvidos por Wícolly.', pathName, body })
}

function projectCase(profile, links, project, activity) {
  const last = updateFor(project, activity)
  const sourceCodeSchema = project.visibility === 'public' && project.repository ? {
    '@context': 'https://schema.org', '@type': 'SoftwareSourceCode', name: project.name, description: project.shortDescription,
    codeRepository: project.repository, programmingLanguage: project.technologies, author: { '@type': 'Person', name: profile.name },
  } : { '@context': 'https://schema.org', '@type': 'CreativeWork', name: project.name, description: project.shortDescription, author: { '@type': 'Person', name: profile.name } }
  const buttons = [project.productionUrl ? `<a class="button primary" href="${esc(project.productionUrl)}">Abrir demonstração</a>` : '', project.repository ? `<a class="button" href="${esc(project.repository)}" target="_blank" rel="noopener noreferrer">Repositório público</a>` : ''].join('')
  const body = `<section class="case-hero"><div class="shell case-grid"><div><p class="kicker">${esc(project.status)}</p><h1>${esc(project.name)}</h1><p class="lead">${esc(project.shortDescription)}</p><div class="actions">${buttons}<a class="text-link" href="/projetos/">Todos os projetos</a></div>${list(project.technologies)}</div>${projectMedia(project, true)}</div></section>
  <section class="section"><div class="shell case-content"><article class="prose"><h2>Contexto e objetivo</h2><p>${esc(project.longDescription)}</p><h2>Problema</h2>${list(project.problemsSolved, 'plain-list')}<h2>Arquitetura e decisões</h2><p>A arquitetura pública é descrita apenas no nível necessário para entender o projeto. Detalhes privados, credenciais e topologia operacional não fazem parte deste estudo de caso.</p>${list(project.highlights, 'plain-list')}<h2>Dificuldades e aprendizados</h2>${list(project.lessonsLearned, 'plain-list')}<h2>O que já funciona</h2>${list(project.highlights, 'plain-list')}<h2>Próximos passos</h2>${list(project.nextSteps, 'plain-list')}</article>
  <aside class="case-aside"><h2>Estado atual</h2><p>${esc(project.status)}</p><h2>Visibilidade</h2><p>${project.visibility === 'public' ? 'Projeto público' : 'Detalhes e código não publicados'}</p><h2>Última atualização pública</h2><p>${last ? `${esc(last.summary)}<br><time datetime="${esc(last.date)}">${esc(last.displayDate)}</time>` : 'Nenhuma atualização pública registrada.'}</p></aside></div></section>`
  return layout({ profile, links, title: `${project.name} — estudo de caso | Wícolly`, description: project.shortDescription, pathName: `/projetos/${project.slug}/`, body, schema: [sourceCodeSchema] })
}

function news(profile, links, projects, activity) {
  const items = activityItems(activity, 100)
  const filters = projects.filter((project) => project.showGitHubActivity && (activity.projects?.[project.slug]?.items || []).length)
  const body = `<section class="page-hero"><div class="shell"><p class="kicker">Novidades</p><h1>Mudanças públicas, sem despejar o log do GitHub no visitante.</h1><p class="lead">Releases vêm primeiro. Commits de merge, robôs, ruído de CI e dados de repositórios privados ficam de fora.</p></div></section>
  <section class="section"><div class="shell"><div class="filters" aria-label="Filtrar novidades"><button type="button" class="filter active" data-news-filter="all">Todos</button>${filters.map((project) => `<button type="button" class="filter" data-news-filter="${esc(project.slug)}">${esc(project.name)}</button>`).join('')}</div>
  ${items.length ? `<ol class="news-list">${items.map((item) => `<li data-news-item="${esc(item.slug)}"><div><span class="type-badge">${esc(item.kindLabel || item.type)}</span><time datetime="${esc(item.date)}">${esc(item.displayDate)}</time></div><h2>${esc(item.projectName)}</h2><p>${esc(item.summary)}</p>${item.url ? `<a class="text-link" href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">Ver fonte pública</a>` : ''}</li>`).join('')}</ol>` : '<p class="empty-state">Nenhuma atualização pública no cache. O próximo sync tentará novamente sem interromper o site.</p>'}</div></section>`
  return layout({ profile, links, title: 'Novidades de desenvolvimento | Wícolly', description: 'Linha do tempo pública e sanitizada dos projetos de Wícolly.', pathName: '/novidades/', body })
}

function blacklight(profile, links, products, gallery) {
  const cards = products.map((product) => `<article class="product-card" id="produto-${esc(product.slug)}"><div class="product-photo-missing" role="img" aria-label="Foto real será adicionada em breve">Foto real será adicionada em breve.</div><p class="kicker">${esc(product.status)}</p><h2>${esc(product.name)}</h2><p>${esc(product.customization)}</p><dl><dt>Material</dt><dd>A definir após avaliar o uso</dd><dt>Dimensões</dt><dd>A definir no orçamento</dd><dt>Produção</dt><dd>Prazo informado após análise</dd></dl><details><summary>Ver detalhes</summary><p>Esta é uma categoria de orçamento, não um produto pronto. Uma peça real só será publicada com foto, medidas e dados de produção confirmados.</p></details><div class="product-actions"><button type="button" class="text-button" data-product-quote="${esc(product.name)}">Solicitar orçamento</button><button type="button" class="text-button" data-share-url="${SITE}/blacklight3d/#produto-${esc(product.slug)}" data-share-title="${esc(product.name)} — BlackLight 3D">Compartilhar</button><button type="button" class="text-button" data-copy-url="${SITE}/blacklight3d/#produto-${esc(product.slug)}">Copiar link</button></div></article>`).join('')
  const body = `<section class="blacklight-hero"><div class="shell split"><div><p class="kicker">BlackLight 3D · Goiatuba</p><h1>Impressão 3D começa com medidas e uso, não com uma foto genérica.</h1><p class="lead">Ainda não há fotografias reais de peças neste repositório. Por isso, o catálogo abaixo apresenta categorias de orçamento e diz claramente o que falta confirmar.</p><div class="actions"><a class="button light" href="#orcamento">Montar pedido</a><a class="button outline-light" href="${esc(links.blacklightInstagram)}?utm_source=wicolly.com.br&utm_medium=referral&utm_campaign=blacklight_catalogo" target="_blank" rel="noopener noreferrer">Instagram</a></div></div><img class="blacklight-logo" src="/blacklight3d/assets/blacklight-logo.webp" alt="Logotipo da BlackLight 3D" width="640" height="320"></div></section>
  <section class="section"><div class="shell"><div class="section-heading"><div><p class="kicker">Categorias</p><h2>O que pode ser avaliado</h2></div><p>Disponibilidade, material e prazo só são confirmados depois do orçamento.</p></div><div class="product-grid">${cards}</div></div></section>
  <section class="section ruled"><div class="shell"><div class="section-heading"><div><p class="kicker">Galeria real</p><h2>Bastidores e peças produzidas</h2></div></div><p class="empty-state">${esc(gallery.emptyMessage)}</p></div></section>
  <section id="orcamento" class="section"><div class="shell quote-layout"><div><p class="kicker">Orçamento</p><h2>Prepare uma mensagem com o que já sabe.</h2><p>O formulário não envia nem armazena dados. Ele abre o WhatsApp com uma mensagem estruturada.</p><p><strong>Arquivo 3D:</strong> não há upload no site. Depois de abrir a conversa, envie fotos, referências ou o arquivo STL diretamente pelo WhatsApp.</p></div>
  <form class="quote-form" data-blacklight-form data-phone="${esc(links.blacklightWhatsApp)}"><label>Nome<input name="nome" required autocomplete="name"></label><label>Tipo de peça<select name="tipo" required><option value="">Selecione</option>${products.map((p) => `<option>${esc(p.name)}</option>`).join('')}<option>Projeto personalizado</option></select></label><label class="wide">Descrição<textarea name="descricao" required rows="4"></textarea></label><label>Quantidade<input name="quantidade" type="number" min="1" required></label><label>Medidas aproximadas<input name="medidas" placeholder="Ex.: 12 × 8 × 3 cm"></label><label>Cor<input name="cor"></label><label>Finalidade<input name="finalidade" required></label><label>Prazo desejado<input name="prazo" placeholder="Data ou período"></label><fieldset class="wide"><legend>Possui arquivo 3D?</legend><label><input type="radio" name="arquivo" value="Sim" required> Sim</label><label><input type="radio" name="arquivo" value="Não"> Não</label></fieldset><label class="wide">Observações<textarea name="observacoes" rows="3"></textarea></label><button class="button primary wide" type="submit">Abrir mensagem no WhatsApp</button><p class="form-status wide" role="status" aria-live="polite"></p></form></div></section>`
  return layout({ profile, links, title: 'BlackLight 3D | Impressão 3D sob encomenda em Goiatuba', description: 'Categorias de impressão 3D sob encomenda, com orçamento estruturado e catálogo baseado apenas em fotos reais.', pathName: '/blacklight3d/', body })
}

function resume(profile, links, projects) {
  const selected = projects.filter((project) => ['campus-flow', 'veredra', 'little-x', 'blacklight-3d'].includes(project.slug))
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Currículo | ${esc(profile.name)}</title><meta name="description" content="Currículo de ${esc(profile.name)}, estudante de Ciência da Computação com projetos em software, IA e infraestrutura."><link rel="canonical" href="${SITE}/portfolio/curriculo.html"><link rel="stylesheet" href="/shared/redesign.css"></head><body class="resume"><main><header><p class="kicker">Currículo · atualizado em ${esc(profile.resume.updatedAt)}</p><h1>${esc(profile.name)}</h1><p>${esc(profile.headline)}</p><p>${esc(profile.location)} · <a href="mailto:${esc(links.email)}">${esc(links.email)}</a> · <a href="${esc(links.linkedin)}">LinkedIn</a> · <a href="${esc(links.github)}">GitHub</a></p></header><section><h2>Perfil</h2><p>${esc(profile.shortBio)}</p><p>${esc(profile.resume.objective)}</p></section><section><h2>Formação</h2><h3>${esc(profile.education.course)}</h3><p>${esc(profile.education.institution)} · ${esc(profile.education.period)} · ${esc(profile.education.status)}</p><p>${esc(profile.academicLeadership)}</p></section><section><h2>Projetos selecionados</h2>${selected.map((project) => `<article><h3>${esc(project.name)} <small>— ${esc(project.status)}</small></h3><p>${esc(project.shortDescription)}</p><p><strong>Tecnologias:</strong> ${esc(project.technologies.join(', '))}</p></article>`).join('')}</section><section><h2>Conhecimentos em prática</h2><p>${esc(profile.technologies.join(' · '))}</p></section><section><h2>Disponibilidade</h2><p>${esc(profile.resume.availability)}</p></section></main><script src="/shared/redesign.js" defer></script></body></html>`
}

async function writePage(distDir, relativeDir, html) {
  const target = path.join(distDir, relativeDir, 'index.html')
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.writeFile(target, `${html}\n`)
}

export async function renderSite({ root, distDir }) {
  const readJson = async (relative) => JSON.parse(await fs.readFile(path.join(root, relative), 'utf8'))
  const [profile, links, projects, activity, products, gallery] = await Promise.all([
    readJson('data/profile.json'), readJson('data/social-links.json'), readJson('data/projects.json'),
    readJson('data/generated/github-activity.json'), readJson('data/blacklight-products.json'), readJson('data/blacklight-gallery.json'),
  ])

  await fs.writeFile(path.join(distDir, 'index.html'), `${home(profile, links, projects, activity)}\n`)
  await writePage(distDir, 'sobre', about(profile, links))
  await writePage(distDir, 'projetos', projectsIndex(profile, links, projects, activity))
  for (const project of projects) await writePage(distDir, path.join('projetos', project.slug), projectCase(profile, links, project, activity))
  await writePage(distDir, 'novidades', news(profile, links, projects, activity))
  await writePage(distDir, 'blacklight3d', blacklight(profile, links, products, gallery))
  await writePage(distDir, 'portfolio', projectsIndex(profile, links, projects, activity, '/portfolio/'))
  await fs.writeFile(path.join(distDir, 'portfolio', 'curriculo.html'), `${resume(profile, links, projects)}\n`)
}
