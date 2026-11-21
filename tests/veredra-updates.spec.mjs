import { test, expect } from '@playwright/test'

test('Veredra mostra manifesto de updates coerente e interface de reload segura', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  const [latest, installed] = await Promise.all([
    request.get('/veredra/updates.json'),
    request.get('/veredra/version.json'),
  ])
  expect(latest.status()).toBe(200)
  expect(installed.status()).toBe(200)
  const feed = await latest.json()
  const version = await installed.json()
  expect(feed.schema).toBe(1)
  expect(feed.version).toBe(version.version)
  expect(Number(feed.buildNumber)).toBe(Number(version.build_number))
  expect(feed.notes.length).toBeGreaterThan(15)

  await page.goto('/veredra/', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('flutter-view')).toBeVisible({ timeout: 20000 })
  expect(await page.evaluate(() => typeof window.veredraReloadForUpdate)).toBe('function')
})
