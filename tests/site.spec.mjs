import { test, expect } from '@playwright/test'

const routes = [
  '/', '/sobre/', '/projetos/', '/ia/', '/diario/', '/servicos/', '/contato/', '/infraestrutura/', '/borda/', '/hefesto/', '/poseidon/', '/goiatuba/',
  '/blacklight3d/', '/blacklight3d/projetos/', '/blacklight3d/orcamento/', '/portfolio/', '/portfolio/curriculo.html', '/privacidade/', '/veredra/',
  '/en/', '/en/about/', '/en/projects/', '/en/ai/', '/en/infrastructure/', '/en/journal/', '/en/contact/', '/en/blacklight3d/', '/en/blacklight3d/projects/', '/en/blacklight3d/quote/',
]
const criticalRoutes = ['/', '/projetos/', '/ia/', '/infraestrutura/', '/blacklight3d/', '/blacklight3d/orcamento/', '/en/', '/en/ai/', '/en/blacklight3d/']
const widths = [320, 375, 768, 1024, 1440, 1920]

function collectConsoleErrors(page) {
  const errors = []
  const fn = (message) => { if (message.type() === 'error') errors.push(message.text()) }
  page.on('console', fn)
  return { errors, stop: () => page.off('console', fn) }
}

test('home V6 carrega identidade, idiomas e cena infinita sem overflow', async ({ page }) => {
  const log = collectConsoleErrors(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Eu construo sistemas')
  await expect(page.locator('#infinite-scene')).toHaveCount(1)
  await expect(page.locator('.flag-br')).toBeVisible()
  await expect(page.locator('.flag-us')).toBeVisible()
  await expect(page.getByRole('link', { name: 'GitHub' }).first()).toHaveAttribute('href', 'https://github.com/TSWill03')
  const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }))
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
  expect(log.errors).toEqual([])
  log.stop()
})

test('barra superior é realmente clicável e navega entre páginas', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  await page.goto('/')
  const canvas = page.locator('#infinite-scene')
  await expect(canvas).toHaveCSS('pointer-events', 'none')
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Projetos' }).click()
  await expect(page).toHaveURL(/\/projetos\/$/)
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'IA', exact: true }).click()
  await expect(page).toHaveURL(/\/ia\/$/)
  await page.getByRole('navigation', { name: 'Navegação principal' }).getByRole('link', { name: 'Infraestrutura' }).click()
  await expect(page).toHaveURL(/\/infraestrutura\/$/)
  await page.getByRole('link', { name: 'Wícolly', exact: false }).first().click()
  await expect(page).toHaveURL(/\/$/)
})

test('seletor de idioma usa bandeiras gráficas e navega PT ↔ EN', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  await page.goto('/')
  await page.getByRole('link', { name: 'English' }).click()
  await expect(page).toHaveURL(/\/en\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('I build systems')
  await page.getByRole('link', { name: 'Português' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('rotas V6 respondem e mantêm documento não vazio', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium','desktop-firefox'].includes(testInfo.project.name))
  for (const route of routes) {
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
    expect(response?.status(), route).toBe(200)
    await expect(page.locator('body')).not.toBeEmpty()
  }
})

test('menu móvel abre, links são clicáveis e Escape restaura foco', async ({ page }, testInfo) => {
  test.skip(!['iphone-chromium','android-chromium','tablet-chromium'].includes(testInfo.project.name))
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Menu' })
  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  const nav = page.getByRole('navigation', { name: 'Navegação principal' })
  await expect(nav).toBeVisible()
  await nav.getByRole('link', { name: 'Projetos' }).click()
  await expect(page).toHaveURL(/\/projetos\/$/)
  await menu.click()
  await page.keyboard.press('Escape')
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})

test('tema segue o sistema, alterna e persiste', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const toggle = page.getByRole('button', { name: 'Usar tema escuro' })
  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.evaluate(() => localStorage.removeItem('wicolly-theme'))
})

test('AI Lab mostra baseline real e não antecipa Render/Hermes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  await page.goto('/ia/')
  for (const term of ['Router','Memory','Tools','Fallback','Fase 1D']) await expect(page.getByText(term, { exact: false }).first()).toBeVisible()
  await expect(page.getByText('Repositório privado · TSWill03/LittleX', { exact: true })).toBeVisible()
  await expect(page.getByText('Hermes', { exact: true })).toHaveCount(0)
  await expect(page.getByText('Hurricane', { exact: true })).toHaveCount(0)
})

test('infraestrutura expõe todos os nós públicos e explica escolhas', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  await page.goto('/infraestrutura/')
  for (const name of ['Borda','Hefesto','Poseidon','Goiatuba']) await expect(page.getByRole('link', { name: new RegExp(name) }).first()).toBeVisible()
  for (const tech of ['Tailscale','Cloudflare Tunnel','Docker','Restic + SFTP','Nginx / Caddy','Uptime Kuma','Pterodactyl','SSH']) await expect(page.getByText(tech, { exact: true }).first()).toBeVisible()
})

test('BlackLight usa uma das sete cenas e gera orçamento estruturado', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium','desktop-firefox'].includes(testInfo.project.name))
  await page.goto('/blacklight3d/')
  await expect(page.locator('body')).toHaveAttribute('data-scene-mode', 'blacklight')
  const scene = await page.evaluate(() => sessionStorage.getItem('blacklight-scene-index'))
  expect(Number(scene)).toBeGreaterThanOrEqual(0)
  expect(Number(scene)).toBeLessThan(7)
  await page.goto('/blacklight3d/orcamento/')
  await expect(page.getByText('Não há upload no site')).toBeVisible()
  await page.getByLabel('Nome').fill('Teste automatizado')
  await page.getByLabel('Tipo de peça').selectOption({ label: 'Suportes' })
  await page.getByLabel('Descrição').fill('Suporte para controle')
  await page.getByLabel('Quantidade').fill('2')
  await page.getByLabel('Medidas aproximadas').fill('12 x 8 x 3 cm')
  await page.getByLabel('Cor / acabamento').fill('Preto')
  await page.getByLabel('Finalidade').fill('Uso doméstico')
  await page.getByLabel('Prazo desejado').fill('Sem urgência')
  await page.getByLabel('Não').check()
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByRole('button', { name: 'Abrir mensagem no WhatsApp' }).click()])
  await popup.waitForLoadState('domcontentloaded')
  const target = new URL(popup.url())
  const message = target.searchParams.get('text') || ''
  expect(popup.url()).toContain('5564993252339')
  expect(message).toContain('Tipo de peça: Suportes')
  expect(message).toContain('Possui arquivo 3D: Não')
})

test('Diário filtra projetos sem recarregar', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  await page.goto('/diario/')
  const filter = page.locator('[data-news-filter]').filter({ hasText: 'Veredra' })
  if (await filter.count()) {
    await filter.click()
    const visible = page.locator('[data-news-item]:visible')
    expect(await visible.count()).toBeGreaterThan(0)
  }
})

test('metadados sociais, canonical, alternate e JSON-LD estão presentes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  for (const route of ['/', '/projetos/', '/ia/', '/infraestrutura/', '/blacklight3d/', '/en/']) {
    await page.goto(route)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(1)
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(schemas.length).toBeGreaterThan(0)
    for (const schema of schemas) expect(() => JSON.parse(schema)).not.toThrow()
  }
})

test('Veredra preserva a superfície Flutter sem erro de console', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  const log = collectConsoleErrors(page)
  const response = await page.goto('/veredra/', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)
  await expect(page.locator('flutter-view')).toBeVisible({ timeout: 20_000 })
  expect(log.errors).toEqual([])
  log.stop()
})

test('rotas críticas não têm overflow nem erro de console nas larguras de aceite', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  test.setTimeout(120_000)
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 })
    for (const route of criticalRoutes) {
      const log = collectConsoleErrors(page)
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), `${route} em ${width}px`).toBe(200)
      await page.waitForTimeout(120)
      const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }))
      expect(dimensions.document, `${route} em ${width}px`).toBeLessThanOrEqual(dimensions.viewport)
      expect(log.errors, `${route} em ${width}px`).toEqual([])
      log.stop()
    }
  }
})
