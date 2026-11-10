(() => {
  'use strict'
  const $ = (id) => document.getElementById(id)
  const form = $('brief-form')
  const timeline = $('timeline')
  const summary = $('plan-summary')
  const caption = $('caption')
  const feedback = $('feedback')
  let latestText = ''
  const clean = (value, max) => String(value || '').trim().replace(/\s+/g, ' ').slice(0, max)
  const scripts = {
    energetico: {
      hook: (p) => `Mostre ${p} nos primeiros segundos com enquadramento próximo e movimento.`,
      detail: (p, a) => `Alterne cenas reais de ${p} e destaque visualmente o que importa para ${a}, sem fazer afirmações não verificadas.`,
      ending: () => 'Mostre o produto novamente e convide o público a conhecer as opções disponíveis na loja.',
      tone: 'Dinâmico e energético'
    },
    elegante: {
      hook: (p) => `Apresente ${p} em um plano limpo com boa iluminação e pouca informação na tela.`,
      detail: (p, a) => `Explore detalhes reais de ${p} e use legendas objetivas voltadas a ${a}.`,
      ending: () => 'Encerre com o nome da loja e convite discreto para conversar sobre disponibilidade.',
      tone: 'Elegante e objetivo'
    },
    educativo: {
      hook: (p) => `Abra com uma pergunta sobre ${p} que o cliente realmente faria.`,
      detail: (p, a) => `Mostre ${p} e explique características observáveis relevantes para ${a}; confirme cada informação antes de publicar.`,
      ending: () => 'Recapitule o principal e convide o público a tirar dúvidas diretamente com a equipe.',
      tone: 'Informativo e direto'
    }
  }
  const makeScene = (time, name, content) => {
    const item = document.createElement('li')
    const timeEl = document.createElement('strong')
    const nameEl = document.createElement('h4')
    const description = document.createElement('p')
    timeEl.textContent = time
    nameEl.textContent = name
    description.textContent = content
    item.append(timeEl, nameEl, description)
    return item
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    if (!form.reportValidity()) return
    const product = clean($('product').value, 65)
    const audience = clean($('audience').value, 75)
    if (!product || !audience) return
    const style = scripts[$('tone').value] || scripts.energetico
    const scenes = [
      ['00–05s', 'O gancho', style.hook(product)],
      ['05–30s', 'O produto em cena', style.detail(product, audience)],
      ['30–45s', 'Fechamento', style.ending()]
    ]
    timeline.replaceChildren(...scenes.map(([time, title, detail]) => makeScene(time, title, detail)))
    summary.textContent = `Estilo: ${style.tone} · Público: ${audience} · Duração alvo: 45 segundos.`
    caption.textContent = `${product}: uma ideia para quem procura ${audience.toLocaleLowerCase('pt-BR')}. Fale com a Mundo Fit Goiás para verificar modelos, informações e disponibilidade. #MundoFitGoias`
    latestText = [
      'MUNDOFIT X — ROTEIRO DE DEMONSTRAÇÃO (45s)',
      'Observação: roteiro determinístico, não produzido por IA.',
      `Produto: ${product}`, `Público: ${audience}`, `Estilo: ${style.tone}`, '',
      ...scenes.map(([time, title, detail]) => `${time} — ${title}\n${detail}\n`),
      `Legenda: ${caption.textContent}`,
      'Antes de publicar: confira afirmações, disponibilidade, preço, direitos de imagem e música.'
    ].join('\n')
    $('result-empty').hidden = true
    $('result-content').hidden = false
    feedback.textContent = 'Roteiro preparado no navegador. Revise antes de utilizar.'
  })
  $('copy-script').addEventListener('click', async () => {
    if (!latestText) return
    try {
      await navigator.clipboard.writeText(latestText)
      feedback.textContent = 'Roteiro copiado.'
    } catch {
      feedback.textContent = 'O navegador não permitiu copiar automaticamente. Use “Salvar .txt”.'
    }
  })
  $('save-script').addEventListener('click', () => {
    if (!latestText) return
    const url = URL.createObjectURL(new Blob([latestText], {type:'text/plain;charset=utf-8'}))
    const a = document.createElement('a')
    a.href = url
    a.download = 'mundofit-x-roteiro-45s.txt'
    document.body.append(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 3000)
    feedback.textContent = 'Roteiro .txt gerado localmente.'
  })
  const fileInput = $('video-file')
  const video = $('video-preview')
  let videoUrl = null
  const revoke = () => { if (videoUrl) { URL.revokeObjectURL(videoUrl); videoUrl = null } }
  fileInput.addEventListener('change', () => {
    revoke()
    const file = fileInput.files?.[0]
    video.pause()
    video.removeAttribute('src')
    video.load()
    video.hidden = true
    if (!file) { $('video-status').textContent = 'Nenhum arquivo selecionado.'; return }
    if ((!file.type.startsWith('video/') && !/\.(mp4|webm|mov)$/i.test(file.name)) || file.size > 500 * 1024 * 1024) {
      $('video-status').textContent = 'Selecione um vídeo de até 500 MB, compatível com o seu navegador.'
      fileInput.value = ''
      return
    }
    videoUrl = URL.createObjectURL(file)
    video.src = videoUrl
    video.hidden = false
    $('video-status').textContent = `Prévia local: ${file.name.slice(0, 100)}. O vídeo não foi enviado ou editado.`
  })
  window.addEventListener('pagehide', revoke)
})()