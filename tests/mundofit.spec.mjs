import { test, expect } from '@playwright/test'

test('MundoFit: rota isolada existe e não é divulgada pela home', async ({ page, request }) => {
  const response = await request.get('/mundofit/')
  expect(response.status()).toBe(200)
  await page.goto('/mundofit/')
  await expect(page).toHaveTitle(/MundoFit X/)
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Uma assistente')
  await expect(page.getByText('Ainda não exporta vídeos automaticamente')).toBeVisible()
  await page.goto('/')
  await expect(page.locator('a[href*="/mundofit"], a[href*="/MundoFit"]')).toHaveCount(0)
})

test('MundoFit: roteiro de 45s funciona com dados e download locais', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/mundofit/')
  await page.getByLabel(/Produto ou categoria/).fill('Legging personalizada')
  await page.getByLabel(/Público ou intenção/).fill('clientes que praticam corrida')
  await page.getByLabel('Estilo do vídeo').selectOption('educativo')
  await page.getByRole('button', { name: /Montar roteiro/ }).click()
  await expect(page.locator('#timeline li')).toHaveCount(3)
  await expect(page.locator('#timeline')).toContainText('00–05s')
  await expect(page.locator('#timeline')).toContainText('05–30s')
  await expect(page.locator('#timeline')).toContainText('30–45s')
  await expect(page.locator('#caption')).toContainText('Legging personalizada')
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'Salvar .txt' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('mundofit-x-roteiro-45s.txt')
  expect(errors).toEqual([])
})

test('MundoFit: aceita prévia de arquivo local e bloqueia tipos incorretos', async ({ page }) => {
  await page.goto('/mundofit/')
  const file = page.locator('#video-file')
  await file.setInputFiles({ name:'demo.mp4', mimeType:'video/mp4', buffer:Buffer.from('0000000000000000') })
  await expect(page.locator('#video-preview')).toBeVisible()
  await expect(page.locator('#video-status')).toContainText('não foi enviado ou editado')
  await file.setInputFiles({ name:'invalid.txt', mimeType:'text/plain', buffer:Buffer.from('arquivo') })
  await expect(page.locator('#video-preview')).toBeHidden()
  await expect(page.locator('#video-status')).toContainText('Selecione um vídeo')
})

test('MundoFit: layouts não apresentam scroll horizontal ou falha JS', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const width of [320, 375, 768, 1366]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/mundofit/')
    const dimensions = await page.evaluate(() => ({ viewport: window.innerWidth, body: document.documentElement.scrollWidth }))
    expect(dimensions.body, `viewport ${width}`).toBeLessThanOrEqual(dimensions.viewport)
    await expect(page.getByRole('button', { name: /Montar roteiro/ })).toBeVisible()
  }
  expect(errors).toEqual([])
})
