import { test, expect } from '@playwright/test'

const routes = ['/sobre/', '/projetos/', '/projetos/campus-flow/', '/projetos/veredra/', '/projetos/little-x/', '/projetos/openclaw-little-x/', '/projetos/blacklight-3d/', '/projetos/laboratorio-infraestrutura/', '/projetos/wicolly-sites/', '/novidades/', '/servicos/', '/contato/', '/infraestrutura/', '/blacklight3d/', '/portfolio/', '/portfolio/curriculo.html', '/privacidade/', '/hefesto/', '/poseidon/']
const criticalRoutes = ['/', '/sobre/', '/projetos/', '/servicos/', '/contato/', '/infraestrutura/', '/veredra/', '/blacklight3d/', '/novidades/', '/portfolio/', '/privacidade/', '/hefesto/', '/poseidon/']
const exactViewports = [320, 375, 768, 1024, 1440, 1920]

test('home apresenta Wícolly, projetos e canais confirmados sem overflow', async ({ page }) => {
  const errors = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Um ecossistema de projetos')
  await expect(page.getByRole('heading', { name: 'O que estou construindo agora' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'LinkedIn' }).first()).toHaveAttribute('href', /wicolly-alcantara-3454102a7/)
  await expect(page.getByRole('link', { name: 'GitHub' }).first()).toHaveAttribute('href', 'https://github.com/TSWill03')
  const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: window.innerWidth }))
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
  expect(errors).toEqual([])
})

test('rotas públicas e estudos de caso respondem com HTML sem imagens quebradas', async ({ page, request }, testInfo) => {
  test.skip(!['desktop-chromium', 'desktop-firefox', 'desktop-edge'].includes(testInfo.project.name))
  for (const route of routes) {
    const response = await page.goto(route)
    expect(response?.status(), route).toBe(200)
    await expect(page.locator('body')).not.toBeEmpty()
    const sources = await page.locator('img').evaluateAll((images) => images.map((image) => image.getAttribute('src')).filter(Boolean))
    const broken = []
    for (const source of sources) {
      const asset = await request.get(new URL(source, page.url()).href)
      if (!asset.ok()) broken.push(`${source} (${asset.status()})`)
    }
    expect(broken, route).toEqual([])
  }
})

test('cards de projetos mostram mídia completa e não mantêm placeholders', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium', 'iphone-chromium'].includes(testInfo.project.name))
  await page.goto('/projetos/')
  await expect(page.locator('.media-missing')).toHaveCount(0)
  const projectImages = page.locator('.project-image')
  await expect(projectImages).toHaveCount(7)
  for (let index = 0; index < await projectImages.count(); index += 1) {
    const image = projectImages.nth(index)
    await image.scrollIntoViewIfNeeded()
    await expect.poll(() => image.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true)
  }
  const media = await projectImages.evaluateAll((images) => images.map((image) => {
    const rect = image.getBoundingClientRect()
    return { width: rect.width, height: rect.height, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight }
  }))
  expect(media).toHaveLength(7)
  for (const image of media) {
    expect(image.naturalWidth).toBeGreaterThan(0)
    expect(image.naturalHeight).toBeGreaterThan(0)
    expect(image.height).toBeLessThanOrEqual(image.width * 0.7)
  }
})

test('navegação móvel abre, mantém foco visível e não cria overflow', async ({ page }, testInfo) => {
  test.skip(!['iphone-chromium', 'android-chromium', 'tablet-chromium'].includes(testInfo.project.name))
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Menu' })
  await menu.focus()
  await expect(menu).toBeFocused()
  await menu.press('Enter')
  await expect(menu).toHaveAttribute('aria-expanded', 'true')
  await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible()
  await menu.press('Escape')
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
  await expect(menu).toBeFocused()
  const dimensions = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: window.innerWidth }))
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport)
})

test('tema segue o sistema, alterna, persiste e atualiza o controle', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  const toggle = page.getByRole('button', { name: 'Usar tema escuro' })
  await toggle.click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('button', { name: 'Usar tema claro' })).toBeVisible()
  await page.evaluate(() => localStorage.removeItem('wicolly-theme'))
})

test('navegação principal usa páginas reais e identifica a página atual', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  for (const route of ['/', '/sobre/', '/projetos/', '/servicos/', '/infraestrutura/', '/blacklight3d/', '/contato/']) {
    await page.goto(route)
    const current = page.locator('.site-nav a[aria-current="page"]')
    await expect(current).toHaveCount(1)
    await expect(current).toHaveAttribute('href', route)
  }
  const hrefs = await page.locator('.site-nav a').evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  expect(hrefs.some((href) => href?.startsWith('/#'))).toBe(false)
})

test('BlackLight gera orçamento estruturado sem upload fictício', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium', 'desktop-edge'].includes(testInfo.project.name))
  await page.goto('/blacklight3d/')
  await expect(page.getByText('não há upload no site')).toBeVisible()
  await page.getByLabel('Nome').fill('Teste automatizado')
  await page.getByLabel('Tipo de peça').selectOption({ label: 'Suportes' })
  await page.getByLabel('Descrição').fill('Suporte para controle')
  await page.getByLabel('Quantidade').fill('2')
  await page.getByLabel('Medidas aproximadas').fill('12 x 8 x 3 cm')
  await page.getByLabel('Cor', { exact: true }).fill('Preto')
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

test('Novidades filtra um projeto sem recarregar', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium', 'desktop-edge'].includes(testInfo.project.name))
  await page.goto('/novidades/')
  const filter = page.getByRole('button', { name: 'Veredra' })
  await expect(filter).toBeVisible()
  await filter.click()
  await expect(page.locator('[data-news-item]:visible')).toHaveCount(5)
  await expect(page.locator('[data-news-item="wicolly-sites"]')).toHaveCount(5)
  expect(await page.locator('[data-news-item="wicolly-sites"]').evaluateAll((items) => items.every((item) => item.hidden))).toBe(true)
})

test('metadados sociais, canonical e JSON-LD estão presentes', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium', 'desktop-edge'].includes(testInfo.project.name))
  for (const route of ['/', '/sobre/', '/projetos/', '/novidades/', '/blacklight3d/']) {
    await page.goto(route)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents()
    expect(schemas.length).toBeGreaterThan(0)
    for (const schema of schemas) expect(() => JSON.parse(schema)).not.toThrow()
  }
})

test('Veredra preserva a superfície Flutter sem erro de console', async ({ page }, testInfo) => {
  test.skip(!['desktop-chromium', 'desktop-edge'].includes(testInfo.project.name))
  const errors = []
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  const response = await page.goto('/veredra/', { waitUntil: 'domcontentloaded' })
  expect(response?.status()).toBe(200)
  await expect(page.locator('flutter-view')).toBeVisible({ timeout: 20_000 })
  expect(errors).toEqual([])
})

test('rotas críticas não têm overflow nem erro de console nas larguras de aceite', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  test.setTimeout(120_000)

  for (const width of exactViewports) {
    await page.setViewportSize({ width, height: 900 })

    for (const route of criticalRoutes) {
      const errors = []
      const collectConsoleError = (message) => {
        if (message.type() === 'error') errors.push(message.text())
      }

      page.on('console', collectConsoleError)
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' })
      expect(response?.status(), `${route} em ${width}px`).toBe(200)
      await page.waitForTimeout(150)

      const dimensions = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }))
      expect(dimensions.document, `${route} em ${width}px`).toBeLessThanOrEqual(dimensions.viewport)
      expect(errors, `${route} em ${width}px`).toEqual([])
      page.off('console', collectConsoleError)
    }

    if (width <= 768) {
      await page.goto('/')
      const menu = page.getByRole('button', { name: 'Menu' })
      await menu.click()
      await expect(page.getByRole('navigation', { name: 'Navegação principal' })).toBeVisible()
    }
  }
})
