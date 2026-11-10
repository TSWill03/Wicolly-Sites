import { test, expect } from '@playwright/test'

test('MeuX abre com cadastro WhatsApp em primeiro lugar e sem chat web', async ({ page }) => {
  const response = await page.goto('/meux/')
  expect(response?.status()).toBe(200)

  await expect(page.getByRole('heading', { name: 'Coloque seu número' })).toBeVisible()
  await expect(page.locator('#phone')).toBeVisible()
  await expect(page.locator('#start-button')).toBeVisible()
  await expect(page.locator('#consent')).not.toBeChecked()
  await expect(page.locator('.hero > :first-child')).toHaveClass(/enroll/)
  await expect(page.locator('#chatForm,#messages,#chathead,#message,#file')).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'O que é a Little X 2.0?' })).toBeVisible()

  const source = await page.locator('body').innerText()
  expect(source).toContain('Roteamento de modelos')
  expect(source).toContain('Memória e sessões')
  expect(source).toContain('Aprovações e auditoria')
  expect(source).toContain('Em laboratório')
})

test('formulário rejeita telefone inválido e exige consentimento', async ({ page }) => {
  await page.goto('/meux/')
  const status = page.locator('#form-status')
  await page.locator('#phone').fill('123')
  await page.locator('#start-button').click()
  await expect(status).toContainText('Confira o DDD')
  await page.locator('#phone').fill('(64) 99999-8888')
  await page.locator('#start-button').click()
  await expect(status).toContainText('consentimento')
  await expect(page.locator('#consent')).not.toBeChecked()
})

test('início do teste abre solicitação explícita no WhatsApp, sem afirmar OTP enviada', async ({ page }) => {
  await page.goto('/meux/')
  let destination = ''
  await page.route('https://wa.me/**', async route => {
    destination = route.request().url()
    await route.abort()
  })
  await page.locator('#phone').fill('64 99999 8888')
  await page.locator('#consent').check()
  await page.locator('#start-button').click()
  await expect.poll(() => destination).toContain('https://wa.me/')
  const url = new URL(destination)
  expect(url.host).toBe('wa.me')
  const message = url.searchParams.get('text')
  expect(message).toContain('INICIAR TESTE MEUX')
  expect(message).toContain('+5564999998888')
  expect(message).toContain('Confirmo que solicitei acesso')
  // O navegador sai para wa.me; não acessar DOM após a navegação abortada pelo teste.
})

test('validação de DDD e celular não libera credenciais nem endpoints de IA na página', async ({ page }) => {
  await page.goto('/meux/')
  expect(await page.evaluate(() => window.meuxPhoneValidator('(64) 99999-8888'))).toBe('5564999998888')
  expect(await page.evaluate(() => window.meuxPhoneValidator('+55 (64) 99999-8888'))).toBe('5564999998888')
  expect(await page.evaluate(() => window.meuxPhoneValidator('99'))).toBeNull()
  expect(await page.evaluate(() => window.meuxPhoneValidator('(01) 99999-8888'))).toBeNull()
  expect(await page.locator('script[src="/meux/app.js"]').count()).toBe(1)
  await expect(page.locator('input[type=password]')).toHaveCount(0)
  await expect(page.locator('#file, #chatForm, #ai-form')).toHaveCount(0)
})

test('mobile mostra formulário antes da descrição', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/meux/')
  const registration = await page.locator('.enroll').boundingBox()
  const intro = await page.locator('.hero-copy').boundingBox()
  expect(registration).toBeTruthy()
  expect(intro).toBeTruthy()
  expect(registration.y).toBeLessThan(intro.y)
  await expect(page.getByRole('button', { name: /Iniciar teste pelo WhatsApp/ })).toBeVisible()
})
