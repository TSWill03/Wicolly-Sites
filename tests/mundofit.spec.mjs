import { test, expect } from '@playwright/test'

test('Mundo Fit Goiás: página da loja com fontes reais, não listada no site principal', async ({ page, request }) => {
  const response = await request.get('/mundofit/')
  expect(response.status()).toBe(200)
  await page.goto('/mundofit/')
  await expect(page).toHaveTitle(/Mundo Fit Goiás/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Mundo Fit Goiás')
  await expect(page.getByText('Rua Mato Grosso, 2063')).toBeVisible()
  await expect(page.getByText('Vila Esperança, Goiatuba')).toBeVisible()
  await expect(page.getByText(/identidade visual e os exemplos não são um catálogo oficial/)).toBeVisible()
  await expect(page.getByText(/ainda não estão implementados/)).toBeVisible()
  await page.goto('/')
  await expect(page.locator('a[href*="/mundofit"], a[href*="/MundoFit"]')).toHaveCount(0)
})

test('Mundo Fit Goiás: roteiro personalizado de 45 segundos, com exportação local', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/mundofit/')
  await page.getByLabel('Tipo de campanha').selectOption('vitrine')
  await page.getByLabel(/Produto, linha ou assunto/).fill('Creatina de exemplo')
  await page.getByLabel(/Para quem é o vídeo/).fill('Clientes de Goiatuba')
  await page.getByLabel('Estilo do vídeo').selectOption('educativo')
  await page.getByRole('button', { name: /Gerar roteiro de 45 segundos/ }).click()
  await expect(page.locator('#timeline li')).toHaveCount(3)
  await expect(page.locator('#timeline')).toContainText('00–05s')
  await expect(page.locator('#timeline')).toContainText('05–30s')
  await expect(page.locator('#timeline')).toContainText('30–45s')
  await expect(page.locator('#timeline')).toContainText('Mundo Fit Goiás')
  await expect(page.locator('#caption')).toContainText('Creatina de exemplo')
  await expect(page.locator('#caption')).toContainText('#Goiatuba')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Baixar .txt' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('mundo-fit-goias-roteiro-45s.txt')
  expect(errors).toEqual([])
})

test('Mundo Fit Goiás: três pautas preenchem briefing sem alegações inventadas', async ({ page }) => {
  await page.goto('/mundofit/')
  await page.locator('[data-preset="educativo"]').click()
  await expect(page.locator('#campaign')).toHaveValue('educativo')
  await expect(page.locator('#product')).toHaveValue('Como ler o rótulo de um suplemento')
  await page.getByRole('button', { name: /Gerar roteiro/ }).click()
  await expect(page.locator('#timeline')).toContainText('informações')
  await expect(page.locator('#timeline')).toContainText('Evite dosagens, alegações médicas')
  await page.locator('[data-preset="bastidores"]').click()
  await expect(page.locator('#campaign')).toHaveValue('bastidores')
  await page.getByRole('button', { name: /Gerar roteiro/ }).click()
  await expect(page.locator('#caption')).toContainText('Rua Mato Grosso, 2063')
  await expect(page.locator('#timeline')).toContainText('Peça autorização')
})

test('Mundo Fit Goiás: prévia só local e bloqueio de arquivo incorreto', async ({ page }) => {
  await page.goto('/mundofit/')
  const input = page.locator('#video-file')
  await input.setInputFiles({ name: 'video.mp4', mimeType: 'video/mp4', buffer: Buffer.from('0000000000000000') })
  await expect(page.locator('#video-preview')).toBeVisible()
  await expect(page.locator('#video-status')).toContainText('não foi enviado ou editado')
  await input.setInputFiles({ name: 'malicioso.mp4', mimeType: 'text/plain', buffer: Buffer.from('invalid') })
  await expect(page.locator('#video-preview')).toBeHidden()
  await expect(page.locator('#video-status')).toContainText('Selecione um MP4')
})

test('Mundo Fit Goiás: mobile e desktop sem rolagem lateral nem erro JS', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const width of [320, 375, 390, 768, 1024, 1366]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/mundofit/')
    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      scroll: document.documentElement.scrollWidth
    }))
    expect(dimensions.scroll, `largura ${width}`).toBeLessThanOrEqual(dimensions.viewport)
    await expect(page.getByRole('button', { name: /Gerar roteiro de 45 segundos/ })).toBeVisible()
  }
  expect(errors).toEqual([])
})
