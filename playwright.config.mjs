import { defineConfig, devices } from '@playwright/test'

const projects = [
  { name: 'desktop-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } } },
  { name: 'notebook-chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } },
  { name: 'tablet-chromium', use: { ...devices['iPad (gen 7)'], browserName: 'chromium' } },
  { name: 'iphone-chromium', use: { ...devices['iPhone 13'], browserName: 'chromium' } },
  { name: 'android-chromium', use: { ...devices['Pixel 5'], browserName: 'chromium' } },
  { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
]

if (process.env.PLAYWRIGHT_EDGE === '1') projects.push({ name: 'desktop-edge', use: { ...devices['Desktop Edge'], channel: 'msedge', viewport: { width: 1440, height: 900 } } })

export default defineConfig({
  testDir: './tests',
  outputDir: './output/playwright/test-results',
  reporter: [['list'], ['html', { outputFolder: './output/playwright/report', open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 3 : undefined,
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  webServer: { command: 'node scripts/serve-dist.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI, timeout: 30_000 },
  projects,
})
