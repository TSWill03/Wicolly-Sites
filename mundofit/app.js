(() => {
  'use strict'

  const $ = (id) => document.getElementById(id)
  const form = $('brief-form')
  const timeline = $('timeline')
  const summary = $('plan-summary')
  const caption = $('caption')
  const feedback = $('feedback')
  const clean = (value, max) => String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max)
  let latestText = ''

  // Os exemplos são pautas editoriais, nunca dados de estoque ou ofertas reais.
  const presets = Object.freeze({
    vitrine: {
      product: 'Suplementação esportiva',
      audience: 'Pessoas que treinam em Goiatuba',
      tone: 'energetico'
    },
    educativo: {
      product: 'Como ler o rótulo de um suplemento',
      audience: 'Quem deseja entender as informações da embalagem',
      tone: 'educativo'
    },
    bastidores: {
      product: 'Rotina e atendimento da Mundo Fit Goiás',
      audience: 'Pessoas de Goiatuba que querem conhecer a loja',
      tone: 'elegante'
    }
  })

  const campaigns = Object.freeze({
    vitrine: {
      label: 'Vitrine de produtos',
      hook: (p) => `Abra com um close real em ${p}. Mostre a embalagem sem inserir preço ou promoção não conferidos.`,
      detail: (p, a) => `Faça planos curtos de ${p}, registrando somente informações verificadas no rótulo ou pela equipe, relevantes para ${a}. Não prometa resultados físicos ou de saúde.`,
      end: () => 'Mostre a fachada ou o balcão, identifique Mundo Fit Goiás em Goiatuba e convide a consultar a disponibilidade diretamente na loja.',
      caption: (p) => `${p} em destaque na nossa pauta de hoje. Quer conhecer as opções? Converse com a equipe da Mundo Fit Goiás, em Goiatuba. Consulte preços e disponibilidade na loja.`
    },
    educativo: {
      label: 'Conteúdo informativo',
      hook: (p) => `Comece perguntando: "Você já parou para conferir ${p}?" Use uma embalagem real com rótulo legível.`,
      detail: (p) => `Demonstre onde encontrar as informações sobre ${p} no rótulo e recomende seguir as instruções do fabricante. Evite dosagens, alegações médicas ou benefícios que não tenham sido validados.`,
      end: () => 'Encerre convidando o público a conversar com a equipe Mundo Fit Goiás sobre informações dos produtos, sem substituir orientação de profissional habilitado.',
      caption: (p) => `Uma dica de leitura: ${p}. Observe as informações da embalagem e busque orientação profissional quando necessário. Mundo Fit Goiás · Goiatuba.`
    },
    bastidores: {
      label: 'Bastidores da loja',
      hook: () => 'Abra com uma cena real da entrada da loja ou do início do atendimento em Goiatuba.',
      detail: (p, a) => `Mostre a organização, a rotina e momentos reais de ${p} que interessam a ${a}. Peça autorização antes de gravar clientes ou funcionários.`,
      end: () => 'Termine mostrando o nome Mundo Fit Goiás e o endereço da loja: Rua Mato Grosso, 2063, Vila Esperança, Goiatuba.',
      caption: () => 'Nos bastidores da Mundo Fit Goiás: um pouco do nosso dia a dia em Goiatuba. Venha conhecer nossa loja na Rua Mato Grosso, 2063, Vila Esperança.'
    },
    novidade: {
      label: 'Novidade para apresentar',
      hook: (p) => `Mostre ${p} logo no início, apenas se a equipe confirmar que a novidade realmente chegou.`,
      detail: (p, a) => `Registre detalhes reais de ${p} de interesse de ${a}. Confirme marca, características, preço e disponibilidade antes de gravar ou divulgar.`,
      end: () => 'Convide a conferir as informações diretamente com a Mundo Fit Goiás; não anuncie promoção ou quantidade sem confirmação.',
      caption: (p) => `Temos uma pauta para apresentar: ${p}. Confira com a equipe Mundo Fit Goiás se o item já está disponível e quais informações podem ser divulgadas.`
    }
  })

  const tones = Object.freeze({
    energetico: { label: 'Dinâmico e energético', note: 'Use cortes visuais rápidos, boa luz e movimentos curtos, sem exagerar nas informações.' },
    elegante: { label: 'Elegante e objetivo', note: 'Prefira enquadramentos limpos, ritmo confortável e textos curtos.' },
    educativo: { label: 'Informativo e direto', note: 'Dê prioridade à legibilidade do rótulo e às informações verificadas.' }
  })

  function makeScene(time, title, content) {
    const item = document.createElement('li')
    const timeEl = document.createElement('strong')
    const titleEl = document.createElement('h4')
    const textEl = document.createElement('p')
    timeEl.textContent = time
    titleEl.textContent = title
    textEl.textContent = content
    item.append(timeEl, titleEl, textEl)
    return item
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!form.reportValidity()) return
    const product = clean($('product').value, 65)
    const audience = clean($('audience').value, 75)
    if (!product || !audience) return
    const campaign = campaigns[$('campaign').value] || campaigns.vitrine
    const tone = tones[$('tone').value] || tones.energetico
    const scenes = [
      ['00–05s', 'Gancho', campaign.hook(product)],
      ['05–30s', 'A história do produto / da loja', `${campaign.detail(product, audience)} ${tone.note}`],
      ['30–45s', 'Convite à Mundo Fit Goiás', campaign.end()]
    ]
    timeline.replaceChildren(...scenes.map(([time, title, detail]) => makeScene(time, title, detail)))
    summary.textContent = `${campaign.label} · ${tone.label} · Público: ${audience} · 45 segundos.`
    caption.textContent = `${campaign.caption(product)} #MundoFitGoias #Goiatuba`
    latestText = [
      'MUNDO FIT GOIÁS × MUNDOFIT X — DEMONSTRAÇÃO DE ROTEIRO',
      'Roteiro por regras locais (não é geração por IA). Duração-alvo: 45 segundos.',
      `Campanha: ${campaign.label}`,
      `Produto/assunto: ${product}`,
      `Público: ${audience}`,
      `Estilo: ${tone.label}`,
      '',
      ...scenes.map(([time, title, detail]) => `${time} | ${title}\n${detail}\n`),
      `Legenda sugerida: ${caption.textContent}`,
      '',
      'Antes de publicar: confirmar estoque, rótulos, preços, direitos de imagem/música e aprovar o material com a equipe.',
      'Este laboratório não edita vídeos e não publica em redes sociais.'
    ].join('\n')
    $('result-empty').hidden = true
    $('result-content').hidden = false
    feedback.textContent = 'Roteiro criado no navegador. Revise as informações com a equipe antes de publicar.'
  })

  document.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.preset
      const preset = presets[key]
      if (!preset) return
      $('campaign').value = key
      $('product').value = preset.product
      $('audience').value = preset.audience
      $('tone').value = preset.tone
      // Evita a corrida entre rolagem animada, foco e clique no submit (Firefox).
      $('laboratorio').scrollIntoView({ behavior: 'instant', block: 'start' })
      $('product').focus({ preventScroll: true })
    })
  })

  $('copy-script').addEventListener('click', async () => {
    if (!latestText) return
    try {
      await navigator.clipboard.writeText(latestText)
      feedback.textContent = 'Roteiro copiado.'
    } catch {
      feedback.textContent = 'O navegador não autorizou a cópia. Use “Baixar .txt”.'
    }
  })

  $('save-script').addEventListener('click', () => {
    if (!latestText) return
    const url = URL.createObjectURL(new Blob([latestText], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'mundo-fit-goias-roteiro-45s.txt'
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 3000)
    feedback.textContent = 'Arquivo de roteiro gerado localmente.'
  })

  const fileInput = $('video-file')
  const preview = $('video-preview')
  let videoUrl = null
  const releaseVideo = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl)
    videoUrl = null
  }

  fileInput.addEventListener('change', () => {
    releaseVideo()
    preview.pause()
    preview.removeAttribute('src')
    preview.load()
    preview.hidden = true
    const file = fileInput.files?.[0]
    if (!file) {
      $('video-status').textContent = 'Nenhum vídeo selecionado.'
      return
    }
    const validMime = ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)
    const validUntyped = !file.type && /\.(mp4|webm|mov)$/i.test(file.name)
    if ((!validMime && !validUntyped) || file.size > 500 * 1024 * 1024) {
      fileInput.value = ''
      $('video-status').textContent = 'Selecione um MP4, WebM ou MOV de até 500 MB compatível com o navegador.'
      return
    }
    videoUrl = URL.createObjectURL(file)
    preview.src = videoUrl
    preview.hidden = false
    $('video-status').textContent = `Prévia local: ${file.name.slice(0, 100)}. O vídeo não foi enviado ou editado.`
  })
  window.addEventListener('pagehide', releaseVideo)
})()
