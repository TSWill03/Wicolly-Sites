(() => {
  document.querySelectorAll('[data-current-year]').forEach((element) => {
    element.textContent = String(new Date().getFullYear())
  })

  const menuButton = document.querySelector('[data-menu-toggle]')
  const menu = document.querySelector('[data-menu]')
  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true'
      menuButton.setAttribute('aria-expanded', String(!open))
      menu.toggleAttribute('data-open', !open)
    })
  }

  document.querySelectorAll('[data-contact]').forEach((link) => {
    const phone = link.dataset.phone
    if (!phone) return
    link.href = `https://wa.me/${phone}?text=${encodeURIComponent(link.dataset.message || 'Olá! Vim pelo site wicolly.com.br.')}`
  })

  document.querySelectorAll('[data-news-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.newsFilter
      document.querySelectorAll('[data-news-filter]').forEach((item) => item.classList.toggle('active', item === button))
      document.querySelectorAll('[data-news-item]').forEach((item) => {
        item.hidden = filter !== 'all' && item.dataset.newsItem !== filter
      })
    })
  })

  const quoteForm = document.querySelector('[data-blacklight-form]')
  if (quoteForm) {
    const typeField = quoteForm.elements.tipo
    document.querySelectorAll('[data-product-quote]').forEach((button) => {
      button.addEventListener('click', () => {
        typeField.value = button.dataset.productQuote
        quoteForm.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
        quoteForm.elements.nome.focus()
      })
    })
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const data = new FormData(quoteForm)
      const value = (name) => String(data.get(name) || 'Não informado').trim() || 'Não informado'
      const message = [
        'Olá! Vim pelo site da BlackLight 3D e gostaria de solicitar um orçamento.', '',
        `Nome: ${value('nome')}`, `Tipo de peça: ${value('tipo')}`, `Descrição: ${value('descricao')}`,
        `Quantidade: ${value('quantidade')}`, `Medidas aproximadas: ${value('medidas')}`, `Cor: ${value('cor')}`,
        `Finalidade: ${value('finalidade')}`, `Prazo desejado: ${value('prazo')}`, `Possui arquivo 3D: ${value('arquivo')}`,
        `Observações: ${value('observacoes')}`, '', 'Vou enviar fotos, referências ou STL diretamente nesta conversa, se necessário.',
      ].join('\n')
      quoteForm.querySelector('[role="status"]').textContent = 'Mensagem pronta. O WhatsApp será aberto em uma nova aba.'
      window.open(`https://wa.me/${quoteForm.dataset.phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    })
  }

  document.querySelectorAll('[data-copy-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(button.dataset.copyUrl)
      button.textContent = 'Link copiado'
    })
  })
  document.querySelectorAll('[data-share-url]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (navigator.share) await navigator.share({ title: button.dataset.shareTitle, url: button.dataset.shareUrl })
      else {
        await navigator.clipboard.writeText(button.dataset.shareUrl)
        button.textContent = 'Link copiado'
      }
    })
  })
})()
