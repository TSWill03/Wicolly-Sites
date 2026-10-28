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


test('contato rápido móvel mostra ambos os WhatsApps sem ocultar conteúdo', async ({ page }, testInfo) => {
  test.skip(!['iphone-chromium','android-chromium','tablet-chromium'].includes(testInfo.project.name))
  for (const route of ['/', '/blacklight3d/', '/en/']) {
    await page.goto(route)
    const en = route === '/en/'
    const dock = page.getByRole('navigation', { name: en ? 'Quick WhatsApp contact' : 'Contato rápido pelo WhatsApp' })
    await expect(dock).toBeVisible()
    const technology = dock.getByRole('link', { name: en ? 'WhatsApp for websites, systems and AI' : 'WhatsApp para sites, sistemas e IA' })
    const blacklight = dock.getByRole('link', { name: en ? 'BlackLight 3D WhatsApp quotes' : 'WhatsApp BlackLight 3D para orçamentos' })
    await expect(technology).toHaveAttribute('href', /^https:\/\/wa\.me\/5534997675400\?text=/)
    await expect(blacklight).toHaveAttribute('href', /^https:\/\/wa\.me\/5564993252339\?text=/)
    await expect(technology).toHaveAttribute('target', '_blank')
    await expect(blacklight).toHaveAttribute('rel', /noopener/)
    await expect(technology.locator('small')).toHaveText(en ? 'Websites, Systems & AI' : 'Sites, Sistemas e IA')
    const buttons = await dock.getByRole('link').all()
    expect(buttons).toHaveLength(2)
    expect(await buttons[0].getAttribute('aria-label')).toContain(route === '/blacklight3d/' ? 'BlackLight' : (en ? 'websites' : 'sites'))
    for (const button of buttons) {
      const box = await button.boundingBox()
      expect(box).toBeTruthy()
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x + box.width).toBeLessThanOrEqual(page.viewportSize().width)
    }
    const width = await page.evaluate(() => document.documentElement.scrollWidth)
    expect(width).toBeLessThanOrEqual(page.viewportSize().width)
  }
})

test('barra de contato móvel some ao rolar para baixo e reaparece ao subir', async ({ page }, testInfo) => {
  test.skip(!['iphone-chromium','android-chromium','tablet-chromium'].includes(testInfo.project.name))
  await page.goto('/')
  const dock = page.locator('.mobile-contact-bar')
  await expect(dock).toBeVisible()

  // Tiny movement and the very top of the page should keep the controls available.
  await page.evaluate(() => window.scrollTo({ top: 35, behavior: 'instant' }))
  await expect(dock).toBeVisible()
  await expect(dock).not.toHaveClass(/is-hidden/)

  await page.evaluate(() => window.scrollTo({ top: 650, behavior: 'instant' }))
  await expect(dock).toHaveClass(/is-hidden/)
  await expect(dock).toBeHidden()
  await expect(dock).toHaveAttribute('aria-hidden', 'true')
  await expect(dock).toHaveAttribute('inert', '')

  await page.evaluate(() => window.scrollBy({ top: -6, behavior: 'instant' }))
  await expect(dock).toHaveClass(/is-hidden/)
  await page.evaluate(() => window.scrollBy({ top: -130, behavior: 'instant' }))
  await expect(dock).toBeVisible()
  await expect(dock).not.toHaveClass(/is-hidden/)
  await expect(dock).toHaveAttribute('aria-hidden', 'false')
  await expect(dock).not.toHaveAttribute('inert', '')
  await expect(dock.getByRole('link')).toHaveCount(2)

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await expect(dock).toBeVisible()
})

test('efeito de scroll funciona também na BlackLight e no site em inglês', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'iphone-chromium')
  for (const route of ['/blacklight3d/', '/en/']) {
    await page.goto(route)
    const dock = page.locator('.mobile-contact-bar')
    await expect(dock).toBeVisible()
    await page.evaluate(() => window.scrollTo({ top: 750, behavior: 'instant' }))
    await expect(dock).toBeHidden()
    await page.evaluate(() => window.scrollBy({ top: -160, behavior: 'instant' }))
    await expect(dock).toBeVisible()
    await expect(dock.getByRole('link')).toHaveCount(2)
  }
})

test('label de serviços não extrapola o dock em telas de 320px', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'iphone-chromium')
  await page.setViewportSize({ width: 320, height: 720 })
  await page.goto('/')
  const dock = page.getByRole('navigation', { name: 'Contato rápido pelo WhatsApp' })
  await expect(dock).toBeVisible()
  const technology = dock.getByRole('link', { name: 'WhatsApp para sites, sistemas e IA' })
  await expect(technology.locator('small')).toHaveText('Sites, Sistemas e IA')
  const result = await technology.evaluate((link) => {
    const label = link.querySelector('small')
    const box = link.getBoundingClientRect()
    const textBox = label.getBoundingClientRect()
    return { labelWidth: label.scrollWidth, labelClientWidth: label.clientWidth, inside: textBox.left >= box.left && textBox.right <= box.right }
  })
  expect(result.labelWidth).toBeLessThanOrEqual(result.labelClientWidth + 1)
  expect(result.inside).toBe(true)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)
})

test('página de contato exibe serviços de sites, sistemas e IA e números de WhatsApp', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  for (const route of ['/contato/', '/en/contact/']) {
    await page.goto(route)
    await expect(page.locator('.contact-grid')).toContainText(route.startsWith('/en/') ? 'Websites, Systems & AI' : 'Sites, Sistemas e IA')
    await expect(page.locator('.contact-grid')).toContainText('+55 (34) 99767-5400')
    await expect(page.locator('.contact-grid')).toContainText('+55 (64) 99325-2339')
    await expect(page.locator('.contact-grid a[href^="https://wa.me/5534997675400"]')).toHaveCount(1)
    await expect(page.locator('.contact-grid a[href^="https://wa.me/5564993252339"]')).toHaveCount(1)
    await expect(page.locator('.mobile-contact-bar')).toBeHidden()
  }
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

test('BlackLight: trabalho real, fotos locais e pedido pré-preenchido', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  await page.goto('/blacklight3d/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Sua ideia')
  await expect(page.locator('.bl-proof-card')).toHaveCount(1)
  await expect(page.locator('.bl-proof-photos img')).toHaveCount(2)
  await expect(page.getByText('As duas fotos mostram o mesmo projeto')).toBeVisible()
  const asset = await request.get('/blacklight3d/assets/porta-lata-frente.jpg')
  expect(asset.status()).toBe(200)
  expect(asset.headers()['content-type']).toContain('image/jpeg')
  await page.getByRole('link', { name: 'Quero algo assim' }).click()
  await expect(page).toHaveURL(/\/blacklight3d\/orcamento\/\?tipo=/)
  await expect(page.getByLabel('Tipo de peça')).toHaveValue('Porta-lata personalizado')
  await expect(page.getByLabel('Descrição')).toHaveValue(/porta-lata personalizado/)
  await page.goto('/en/blacklight3d/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Your idea')
  await page.getByRole('link', { name: 'I want something like this' }).click()
  await expect(page.getByLabel('Project type')).toHaveValue('Custom can holder')
})

test('BlackLight: páginas comerciais não causam overflow em dispositivos pequenos', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  for (const width of [320, 375, 768, 1280]) {
    await page.setViewportSize({ width, height: 850 })
    for (const route of ['/blacklight3d/', '/blacklight3d/projetos/', '/blacklight3d/orcamento/']) {
      await page.goto(route)
      const size = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }))
      expect(size.document, `${route}: ${width}px`).toBeLessThanOrEqual(size.viewport)
    }
  }
})

test('capas autorais dos projetos carregam e Goiatuba aparece na infraestrutura', async ({ page, request }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop-chromium')
  const covers = ['campus-flow-cover.svg', 'veredra-cover.svg', 'little-x-cover.svg', 'openclaw-little-x-cover.svg', 'blacklight-3d-cover.svg', 'infrastructure-cover.svg', 'wicolly-sites-cover.svg']
  await page.goto('/projetos/')
  const cards = page.locator('.project-card')
  await expect(cards).toHaveCount(7)
  for (const cover of covers) {
    const url = '/assets/projects/' + cover
    await expect(cards.locator('img[src="' + url + '"]')).toHaveCount(1)
    const response = await request.get(url)
    expect(response.status(), cover).toBe(200)
    expect(response.headers()['content-type'], cover).toContain('image/svg+xml')
  }
  await expect(cards.getByRole('heading', { name: 'Hefesto, Poseidon e Goiatuba' })).toBeVisible()
  await page.goto('/en/projects/')
  await expect(page.locator('.project-card img[src="/assets/projects/infrastructure-cover.svg"]')).toHaveCount(1)
  await page.goto('/projetos/campus-flow/')
  await expect(page.locator('.case-hero img')).toHaveAttribute('src', '/assets/projects/campus-flow.webp')
  await page.goto('/projetos/veredra/')
  await expect(page.locator('.case-hero img')).toHaveAttribute('src', '/assets/projects/veredra.webp')
})
