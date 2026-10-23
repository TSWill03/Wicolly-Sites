import { esc, layout } from './common.mjs'

function blPaths(en) {
  return {
    home: en ? '/en/blacklight3d/' : '/blacklight3d/',
    projects: en ? '/en/blacklight3d/projects/' : '/blacklight3d/projetos/',
    quote: en ? '/en/blacklight3d/quote/' : '/blacklight3d/orcamento/',
  }
}
function quoteLink(path, item, en = false) {
  const query = new URLSearchParams({ tipo: en ? item.nameEn : (item.quoteType || item.name), descricao: en ? item.descriptionEn : (item.quoteDescription || item.description) })
  return `${path}?${query.toString()}`
}
function localNav(links, en, current = 'home') {
  const p = blPaths(en)
  return `<nav class="bl-localbar shell" aria-label="${en ? 'BlackLight 3D pages' : 'Páginas da BlackLight 3D'}">
    <a class="bl-localbrand" href="${p.home}"><span class="bl-brand-emblem" aria-hidden="true">B<span>L</span></span><span><strong>BLACKLIGHT 3D</strong><small>${en ? 'Custom 3D printing' : 'Impressões 3D sob encomenda'}</small></span></a>
    <div class="bl-localnav">
      <a href="${p.home}#catalogo"${current === 'home' ? ' aria-current="page"' : ''}>${en ? 'Real work' : 'Peças reais'}</a>
      <a href="${p.projects}"${current === 'projects' ? ' aria-current="page"' : ''}>${en ? 'What we make' : 'O que fazemos'}</a>
      <a class="bl-localcta" href="${p.quote}">${en ? 'Get a quote →' : 'Pedir orçamento →'}</a>
    </div>
  </nav>`
}
function proofGallery(items, en, quote) {
  if (!items.length) return ''
  return `<section class="section bl-showcase" id="catalogo"><div class="shell">
    <div class="section-heading"><div><p class="eyebrow orange">${en ? 'REAL PHOTOS / OUR WORK' : 'FOTOS REAIS / NOSSO TRABALHO'}</p>
      <h2>${en ? 'Already produced. <span>Made for people.</span>' : 'Já saiu da impressora. <span>E foi para a vida real.</span>'}</h2>
    </div><p>${en ? 'Real photographs, no mockups or imaginary stock. Each new order is evaluated separately.' : 'Fotografias de uma peça que produzimos — nada de estoque fictício ou render apresentado como produto entregue.'}</p></div>
    <div class="bl-proof-grid">${items.map(item => `<article class="bl-proof-card">
      <div class="bl-proof-photos">
        ${item.images.map((photo, i) => `<figure class="${i === 0 ? 'bl-photo-primary' : 'bl-photo-secondary'}"><img src="${esc(photo.src)}" alt="${esc(en ? photo.altEn : photo.alt)}" loading="lazy" decoding="async" width="899" height="1599"><figcaption>${en ? (i === 0 ? 'Actual print / photo 01' : 'Same piece / photo 02') : (i === 0 ? 'Peça real / foto 01' : 'Mesma peça / foto 02')}</figcaption></figure>`).join('')}
      </div><div class="bl-proof-text"><span class="bl-status-dot">${esc(en ? item.statusEn : item.status)}</span>
        <h3>${esc(en ? item.nameEn : item.name)}</h3>
        <p>${esc(en ? item.descriptionEn : item.description)}</p>
        <a class="button orange-button" href="${esc(quoteLink(quote, item, en))}">${en ? 'I want something like this →' : 'Quero algo assim →'}</a>
      </div>
    </article>`).join('')}</div>
    <p class="bl-gallery-disclaimer">${en ? 'Photos show a completed project, not a product in stock. Custom art and third-party brands require appropriate authorization.' : 'As duas fotos mostram o mesmo projeto e não representam estoque. A personalização com marcas ou artes de terceiros depende da autorização de uso.'}</p>
  </div></section>`
}
export function blacklightHome(profile, links, gallery = { items: [] }, lang = 'pt') {
  const en = lang === 'en', p = blPaths(en), first = gallery.items[0]
  const body = `${localNav(links, en)}
  <section class="bl-hero"><div class="shell bl-hero-grid">
    <div class="bl-hero-copy"><p class="eyebrow orange">BLACKLIGHT 3D / ${en ? 'CUSTOM 3D PRINTING' : 'IMPRESSÕES 3D SOB ENCOMENDA'}</p>
      <h1>${en ? 'Your idea. <span>Made real.</span>' : 'Sua ideia. <span>Em 3D.</span>'}</h1>
      <p class="bl-tagline">${en ? 'REAL PRINTS. CUSTOM PROJECTS.' : 'PEÇAS REAIS. PROJETOS PERSONALIZADOS.'}</p>
      <p class="lead">${en ? 'Accessories, functional parts, unique gifts and prototypes. Tell us what you need and get a personalized quote before production.' : 'Acessórios, peças funcionais, presentes e protótipos. Conte sua ideia e receba um orçamento antes da produção.'}</p>
      <div class="actions"><a class="button orange-button" href="${p.quote}">${en ? 'Request a quote →' : 'Pedir orçamento →'}</a>
        <a class="button" href="#catalogo">${en ? 'See real work' : 'Ver peças reais'}</a></div>
      <div class="bl-hero-trust"><span>${en ? 'Custom quotes' : 'Orçamento personalizado'}</span><span>${en ? 'No minimum order promised' : 'Quantidade sob consulta'}</span><span>${en ? 'Real photos' : 'Fotos reais'}</span></div>
    </div>
    ${first ? `<a class="bl-hero-visual" href="#catalogo" aria-label="${en ? 'See photos of produced prints' : 'Ver fotos reais da peça produzida'}">
      <img src="${esc(first.images[0].src)}" alt="${esc(en ? first.images[0].altEn : first.images[0].alt)}" width="899" height="1599" fetchpriority="high">
      <span class="bl-hero-photo-label"><b>01 / ${en ? 'REAL PRINT' : 'IMPRESSÃO REAL'}</b><small>${esc(en ? first.nameEn : first.name)}</small></span></a>` : ''}
  </div></section>
  ${proofGallery(gallery.items, en, p.quote)}
  <section class="section"><div class="shell"><div class="section-heading"><div>
    <p class="eyebrow orange">${en ? 'WHAT WE OFFER' : 'O QUE PODEMOS FAZER'}</p>
    <h2>${en ? 'Do you have a drawing, an STL or just an idea?' : 'Tem um STL, um desenho ou só uma ideia?'}</h2>
    </div><p>${en ? 'These are categories of requests, not a promise of ready-to-ship stock.' : 'Estas são categorias para orçamento, não produtos fingindo estar em estoque.'}</p></div>
    <div class="bl-categories">
      <a href="${p.projects}#funcionais"><strong>${en ? 'Useful parts' : 'Peças funcionais'}</strong><p>${en ? 'Supports, organizers and tailored fittings.' : 'Suportes, organizadores e encaixes sob medida.'}</p><span>${en ? 'Explore →' : 'Explorar →'}</span></a>
      <a href="${p.projects}#personalizados"><strong>${en ? 'Custom objects' : 'Personalizados'}</strong><p>${en ? 'Accessories, gifts and personalized pieces.' : 'Acessórios, presentes e peças personalizadas.'}</p><span>${en ? 'Explore →' : 'Explorar →'}</span></a>
      <a href="${p.projects}#prototipos"><strong>${en ? 'Prototypes' : 'Protótipos'}</strong><p>${en ? '3D models, fit tests and projects in development.' : 'Modelagem, testes de encaixe e projetos em desenvolvimento.'}</p><span>${en ? 'Explore →' : 'Explorar →'}</span></a>
    </div></div></section>
  <section class="section"><div class="shell bl-quote-band"><div>
    <p class="eyebrow orange">${en ? 'HOW TO ORDER' : 'COMO ENCOMENDAR'}</p>
    <h2>${en ? 'Tell us. We quote. Then we print.' : 'Você pede. A gente avalia. Depois imprime.'}</h2>
    <p>${en ? 'Send a photo, reference or dimensions. We check feasibility, price and deadline before starting.' : 'Envie foto, referência, medida ou arquivo 3D. Avaliamos viabilidade, valor e prazo antes de começar.'}</p>
    <div class="actions"><a class="button orange-button" href="${p.quote}">${en ? 'Prepare a quote →' : 'Montar pedido →'}</a>
      <a class="button" href="#" data-contact data-phone="${esc(links.blacklightWhatsApp)}" data-message="${esc(en ? 'Hello! I found BlackLight 3D through the website. I would like a quote.' : 'Olá! Vi o site da BlackLight 3D e gostaria de fazer um orçamento.')}" target="_blank" rel="noopener noreferrer">WhatsApp ↗</a></div>
    </div><ol>${(en ? ['Describe the idea', 'Confirm price and timeline', 'Produce and deliver as agreed'] : ['Conte o que precisa', 'Combine valor e prazo', 'Produção e entrega combinadas']).map((s, i) => `<li><b>0${i + 1}</b><strong>${s}</strong></li>`).join('')}</ol>
  </div></section>`
  return layout({ profile, links, title: en ? 'BlackLight 3D | Custom 3D printing' : 'BlackLight 3D | Impressões 3D sob encomenda', description: en ? 'Real 3D printed pieces and custom manufacturing quotes. Request yours on WhatsApp.' : 'Veja fotos reais de peças impressas pela BlackLight 3D e solicite seu orçamento de impressão 3D personalizada.', path: p.home, body, lang, scene: 'blacklight', bodyClass: 'blacklight-site' })
}
export function blacklightProjects(profile, links, products = [], lang = 'pt') {
  const en = lang === 'en', p = blPaths(en)
  const categories = en
    ? [['funcionais', 'Functional parts', 'Holders, organizers, adapters and measured fittings.'], ['personalizados', 'Custom items', 'Accessories, gifts, decorations and keychains.'], ['prototipos', 'Prototypes', '3D modeling, testing dimensions and concepts.'], ['confeitaria', 'Confectionery tooling', 'Ejectors and molds under technical assessment, not yet validated for food contact.'], ['lotes', 'Small batches', 'Items for teams, companies and events; quantity and timeline by quote.'], ['outros', 'Other ideas', 'Tell us what you need.']]
    : [['funcionais', 'Peças funcionais', 'Suportes, organizadores, adaptadores e encaixes sob medida.'], ['personalizados', 'Itens personalizados', 'Acessórios, presentes, decoração e chaveiros.'], ['prototipos', 'Protótipos', 'Modelagem 3D, validação de medidas, forma e encaixes.'], ['confeitaria', 'Ferramentas para confeitaria', 'Ejetores e moldes sob avaliação técnica; ainda sem validação para contato com alimentos.'], ['lotes', 'Pequenos lotes', 'Peças para equipes, empresas e eventos; quantidade e prazo sob consulta.'], ['outros', 'Outras ideias', 'Conte o que precisa e analisamos a viabilidade.']]
  const body = `${localNav(links, en, 'projects')}
    <section class="page-hero"><div class="shell"><p class="eyebrow orange">BLACKLIGHT / ${en ? 'WHAT WE MAKE' : 'O QUE FAZEMOS'}</p><h1>${en ? 'The starting point is <span>your project.</span>' : 'O ponto de partida é <span>o seu projeto.</span>'}</h1><p class="lead">${en ? 'Production on request, tailored to real constraints. No ready-stock promises.' : 'Produção por encomenda, respeitando medidas, uso e prazo. Sem prometer estoque que não existe.'}</p><div class="actions"><a class="button orange-button" href="${p.quote}">${en ? 'Request a quote →' : 'Solicitar orçamento →'}</a><a class="button" href="${p.home}#catalogo">${en ? 'Real photographs' : 'Fotos reais'}</a></div></div></section>
    <section class="section"><div class="shell project-type-grid">${categories.map(([id, title, description], i) => `<article id="${id}"><span>0${i + 1} / ${en ? 'BY REQUEST' : 'SOB ENCOMENDA'}</span><h2>${esc(title)}</h2><p>${esc(description)}</p><a class="text-link" href="${p.quote}">${en ? 'REQUEST QUOTE →' : 'ORÇAR →'}</a></article>`).join('')}</div></section>
    <section class="section"><div class="shell bl-bottom-cta"><div><h2>${en ? 'Send your reference. We will assess it.' : 'Mande sua referência. A gente avalia.'}</h2><p>${en ? 'Photos, sketches and STL files can be shared directly through WhatsApp.' : 'Fotos, desenhos e STL são enviados diretamente na conversa do WhatsApp.'}</p></div><a class="button orange-button" href="${p.quote}">${en ? 'Build a request →' : 'Montar solicitação →'}</a></div></section>`
  return layout({ profile, links, title: en ? 'Project types | BlackLight 3D' : 'Tipos de peças | BlackLight 3D', description: en ? 'Custom 3D printing, prototyping and small production batches.' : 'Impressões 3D, personalização, protótipos e pequenos lotes por encomenda.', path: p.projects, body, lang, scene: 'blacklight', bodyClass: 'blacklight-site' })
}
export function blacklightQuote(profile, links, products = [], lang = 'pt') {
  const en = lang === 'en', p = blPaths(en)
  const body = `${localNav(links, en, 'quote')}
    <section class="page-hero"><div class="shell"><p class="eyebrow orange">BLACKLIGHT / ${en ? 'QUOTE' : 'ORÇAMENTO'}</p>
      <h1>${en ? 'Tell us what the part <span>needs to do.</span>' : 'Conta o que a peça <span>precisa fazer.</span>'}</h1>
      <p class="lead">${en ? 'Fill in what you know. There is no file upload on the site; images and 3D files go directly in WhatsApp.' : 'Preencha o que souber. Não há upload no site; imagens e arquivos 3D são enviados diretamente no WhatsApp.'}</p>
    </div></section><section class="section"><div class="shell quote-layout">
      <aside class="surface-card"><p class="eyebrow orange">${en ? 'PERSONALIZED QUOTE' : 'ORÇAMENTO PERSONALIZADO'}</p>
        <h2>${en ? 'No need to have everything ready.' : 'Não precisa ter tudo pronto.'}</h2>
        <p>${en ? 'A photo, reference, approximate measurements or STL can be enough to start. The final price and deadline are confirmed after analysis.' : 'Uma foto, referência, medida aproximada ou STL já ajudam. Valor e prazo são confirmados após a análise do pedido.'}</p>
        <p class="bl-quote-aside-note">${en ? 'Submitting this form only opens WhatsApp. The request is not confirmed until you send the message.' : 'Este formulário apenas prepara o WhatsApp. A solicitação só é enviada quando você confirma o envio da mensagem.'}</p>
      </aside><form class="quote-form" data-blacklight-form data-phone="${esc(links.blacklightWhatsApp)}">
        <label>${en ? 'Name' : 'Nome'}<input name="nome" required autocomplete="name" maxlength="120"></label>
        <label>${en ? 'Project type' : 'Tipo de peça'}<select name="tipo" required><option value="">${en ? 'Choose' : 'Selecione'}</option>${products.map(item => `<option>${esc(en && item.nameEn ? item.nameEn : item.name)}</option>`).join('')}<option>${en ? 'Custom project' : 'Projeto personalizado'}</option></select></label>
        <label class="wide">${en ? 'Description' : 'Descrição'}<textarea name="descricao" required rows="4" maxlength="2000" placeholder="${en ? 'What will this piece be used for?' : 'O que você deseja produzir?'}"></textarea></label>
        <label>${en ? 'Quantity' : 'Quantidade'}<input name="quantidade" type="number" min="1" max="10000" required></label>
        <label>${en ? 'Approx. dimensions' : 'Medidas aproximadas'}<input name="medidas" maxlength="120" placeholder="${en ? 'e.g. 12 × 8 × 3 cm' : 'Ex.: 12 × 8 × 3 cm'}"></label>
        <label>${en ? 'Color / finish' : 'Cor / acabamento'}<input name="cor" maxlength="120"></label>
        <label>${en ? 'Use' : 'Finalidade'}<input name="finalidade" required maxlength="200"></label>
        <label>${en ? 'Desired deadline' : 'Prazo desejado'}<input name="prazo" maxlength="120"></label>
        <fieldset class="wide"><legend>${en ? 'Do you have a 3D file?' : 'Possui arquivo 3D?'}</legend>
          <label><input type="radio" name="arquivo" value="Sim" required> ${en ? 'Yes' : 'Sim'}</label>
          <label><input type="radio" name="arquivo" value="Não"> ${en ? 'No' : 'Não'}</label>
        </fieldset>
        <label class="wide">${en ? 'Notes' : 'Observações'}<textarea name="observacoes" rows="3" maxlength="1200"></textarea></label>
        <button class="button orange-button wide" type="submit">${en ? 'Open message in WhatsApp' : 'Abrir mensagem no WhatsApp'}</button>
        <p class="wide form-status" role="status" aria-live="polite"></p>
        <p class="wide bl-form-fineprint">${en ? 'No online payment or instant quote. We contact you through WhatsApp after you send your message.' : 'Não há pagamento online nem preço automático. O atendimento acontece pelo WhatsApp após o envio da mensagem.'}</p>
      </form></div></section>`
  return layout({ profile, links, title: en ? 'Quote | BlackLight 3D' : 'Orçamento | BlackLight 3D', description: en ? 'Tell us about your 3D printing project and prepare a structured WhatsApp request.' : 'Solicite um orçamento personalizado de impressão 3D pela BlackLight 3D via WhatsApp.', path: p.quote, body, lang, scene: 'blacklight', bodyClass: 'blacklight-site' })
}
