import { test, expect } from '@playwright/test'

test('MundoFit: identidade real preto/branco/vermelho e URL não divulgada pela home', async ({ page, request }) => {
  const response = await request.get('/mundofit/')
  expect(response.status()).toBe(200)
  await page.goto('/mundofit/')
  await expect(page).toHaveTitle(/Mundo Fit Goiás/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A MARCA')
  await expect(page.locator('.brand-lockup img')).toHaveAttribute('src', './assets/logo-mundofit-goias-oficial.jpg')
  await expect(page.locator('.hero-media img')).toHaveAttribute('src', './assets/post-mundofit-inicio-saudavel.jpg')
  await expect(page.locator('.social-tile')).toHaveCount(2)
  await expect(page.locator('.brand-details').getByText(/Rua Mato Grosso, 2063/)).toBeVisible()
  await expect(page.getByText(/ainda não estão implementados/i)).toBeVisible()
  await expect(page.locator('a[href="https://www.instagram.com/mundofitgoias/"]')).not.toHaveCount(0)
  const palette = await page.evaluate(() => {
    const css = getComputedStyle(document.documentElement)
    return { red: css.getPropertyValue('--red').trim(), ink: css.getPropertyValue('--ink').trim(), green: css.getPropertyValue('--green').trim() }
  })
  expect(palette.red).toBe('#e51b23')
  expect(palette.ink).toBe('#090909')
  expect(palette.green).toBe('')
  await page.goto('/')
  await expect(page.locator('a[href*="/mundofit"], a[href*="/MundoFit"]')).toHaveCount(0)
})

test('MundoFit: fotos de referência são locais e o crédito remete às publicações oficiais', async ({ page, request }) => {
  await page.goto('/mundofit/')
  for (const [asset, width] of [
    ['logo-mundofit-goias-oficial.jpg', 300],
    ['post-mundofit-inicio-saudavel.jpg', 400],
    ['post-mundofit-comece-pelo-possivel.jpg', 400],
    ['reel-mundofit-loja-suprimentos.jpg', 300]
  ]) {
    const image = await request.get('/mundofit/assets/' + asset)
    expect(image.status(), asset).toBe(200)
    expect((await image.body()).byteLength, asset).toBeGreaterThan(width)
  }
  await expect(page.locator('.social-tile[href*="instagram.com/mundofitgoias/"]')).toHaveCount(2)
  await expect(page.locator('.hero-media[href*="instagram.com/mundofitgoias/"]')).toHaveCount(1)
  await expect(page.getByText('REFERÊNCIA VISUAL: @MUNDOFITGOIAS')).toBeVisible()
})

test('MundoFit: roteiro local de 45s gera três cenas e arquivo sem alegar IA', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/mundofit/')
  await page.getByLabel('Tipo de campanha').selectOption('vitrine')
  await page.getByLabel(/Produto, linha ou assunto/).fill('Creatina - exemplo')
  await page.getByLabel(/Para quem é o vídeo/).fill('Clientes de Goiatuba')
  await page.getByLabel('Estilo do vídeo').selectOption('educativo')
  await page.getByRole('button', { name: /gerar roteiro de 45 segundos/i }).click()
  await expect(page.locator('#timeline li')).toHaveCount(3)
  await expect(page.locator('#timeline')).toContainText('00–05s')
  await expect(page.locator('#timeline')).toContainText('05–30s')
  await expect(page.locator('#timeline')).toContainText('30–45s')
  await expect(page.locator('#timeline')).toContainText('Mundo Fit Goiás')
  await expect(page.locator('#caption')).toContainText('Creatina - exemplo')
  await expect(page.locator('#caption')).toContainText('#Goiatuba')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'BAIXAR .TXT' }).click()
  expect((await downloadPromise).suggestedFilename()).toBe('mundo-fit-goias-roteiro-45s.txt')
  expect(errors).toEqual([])
})

test('MundoFit: presets comerciais, inclusive marca própria, atualizam briefing', async ({ page }) => {
  await page.goto('/mundofit/')
  await page.locator('[data-preset="educativo"]').click()
  await expect(page.locator('#campaign')).toHaveValue('educativo')
  await expect(page.locator('#product')).toHaveValue('Como ler o rótulo de um suplemento')
  await expect(page.locator('[data-preset="educativo"]')).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: /gerar roteiro/i }).click()
  await expect(page.locator('#timeline')).toContainText('Evite dosagens, alegações médicas')
  await page.locator('[data-preset="bastidores"]').click()
  await expect(page.locator('#campaign')).toHaveValue('bastidores')
  await page.getByRole('button', { name: /gerar roteiro/i }).click()
  await expect(page.locator('#caption')).toContainText('Rua Mato Grosso, 2063')
  await expect(page.locator('#timeline')).toContainText('Peça autorização')
  await page.locator('[data-preset="novidade"]').click()
  await expect(page.locator('#campaign')).toHaveValue('novidade')
  await expect(page.locator('#product')).toHaveValue('Marca própria ou lançamento (a confirmar)')
  await expect(page.locator('[data-preset="bastidores"]')).toHaveAttribute('aria-pressed', 'false')
  await expect(page.locator('[data-preset="novidade"]')).toHaveAttribute('aria-pressed', 'true')
})

test('MundoFit: prévia local de vídeo e rejeição de tipo inválido', async ({ page }) => {
  await page.goto('/mundofit/')
  const file = page.locator('#video-file')
  await file.setInputFiles({ name:'video.mp4', mimeType:'video/mp4', buffer:Buffer.from('0000000000000000') })
  await expect(page.locator('#video-preview')).toBeVisible()
  await expect(page.locator('#video-status')).toContainText('não foi enviado ou editado')
  await file.setInputFiles({ name:'malicioso.mp4', mimeType:'text/plain', buffer:Buffer.from('inválido') })
  await expect(page.locator('#video-preview')).toBeHidden()
  await expect(page.locator('#video-status')).toContainText('Selecione um MP4')
})

test('MundoFit: 320–1366px sem scroll lateral ou erro JavaScript', async ({ page }) => {
  const errors = []
  page.on('pageerror',error => errors.push(error.message))
  for (const width of [320, 360, 375, 390, 430, 768, 1024, 1366]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/mundofit/')
    const dimension = await page.evaluate(() => ({ width: window.innerWidth, scroll: document.documentElement.scrollWidth }))
    expect(dimension.scroll, 'largura '+width).toBeLessThanOrEqual(dimension.width)
    await expect(page.getByRole('button', { name:/gerar roteiro de 45 segundos/i })).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('MundoFit: fallback tipográfico não condensado não quebra mobile 320px', async ({ page }) => {
  for (const width of [320, 375, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/mundofit/')
    await page.addStyleTag({ content: 'h1,h2,h3,h4,.hero h1,.section-heading h2,.studio-heading h2,.brand-narrative h3,.social-voice h3,.closing h2{font-family:Arial,sans-serif!important}' })
    const widthDoc = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(widthDoc, 'fonte fallback no viewport '+width).toBeLessThanOrEqual(width)
  }
})
