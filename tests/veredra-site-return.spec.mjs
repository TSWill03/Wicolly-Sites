import { test, expect } from '@playwright/test'

test('Veredra: atalho ao site sai do cabeçalho e fica discreto durante a leitura', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium', 'iphone-chromium'].includes(testInfo.project.name))

  await page.goto('/veredra/', { waitUntil: 'domcontentloaded' })
  const link = page.getByRole('link', { name: 'Voltar ao site Wícolly' })
  await expect(link).toBeVisible()
  await expect(link).toHaveAttribute('href', '/')

  const initial = await link.boundingBox()
  expect(initial).not.toBeNull()
  expect(initial.y).toBeGreaterThan(page.viewportSize().height / 2)

  await page.evaluate(() => window.veredraSetReadingMode(true))
  await expect(page.locator('html')).toHaveClass(/veredra-reading/)
  await expect(page.locator('.site-return-label')).toBeHidden()
  await expect(link).toHaveCSS('width', '32px')

  await page.evaluate(() => window.veredraSetReadingMode(false))
  await expect(page.locator('html')).not.toHaveClass(/veredra-reading/)
  if (testInfo.project.name === 'desktop-chromium') {
    await expect(page.locator('.site-return-label')).toBeVisible()
  }
})
