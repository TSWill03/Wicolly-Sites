import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const target = path.resolve(root, 'veredra')
const sourceArgument = process.argv[2]

function assertTargetInsideRepository(candidate) {
  if (candidate !== target || !candidate.startsWith(`${root}${path.sep}`)) {
    throw new Error(`Refusing to replace unexpected path: ${candidate}`)
  }
}

async function readRequired(directory, relativePath) {
  const file = path.resolve(directory, relativePath)
  if (!file.startsWith(`${directory}${path.sep}`)) {
    throw new Error(`Invalid source path: ${relativePath}`)
  }
  return fs.readFile(file, 'utf8')
}

async function main() {
  if (!sourceArgument) {
    throw new Error('Usage: npm run update:veredra -- <path-to-flutter-build-web>')
  }

  const source = path.resolve(process.cwd(), sourceArgument)
  if (source === target || source.startsWith(`${target}${path.sep}`)) {
    throw new Error('Source must be an external Flutter build directory.')
  }

  const index = await readRequired(source, 'index.html')
  const manifest = JSON.parse(await readRequired(source, 'manifest.json'))
  const worker = await readRequired(source, 'flutter_service_worker.js')
  const appBundle = await readRequired(source, 'main.dart.js')

  if (!index.includes('<base href="/veredra/">')) {
    throw new Error('Flutter build must use --base-href /veredra/.')
  }
  for (const property of ['id', 'start_url', 'scope']) {
    if (manifest[property] !== '/veredra/') {
      throw new Error(`manifest.json ${property} must be /veredra/.`)
    }
  }
  if (
    !worker.includes('function resourceKeyFromUrl(url)') ||
    !worker.includes('function normalizeNavigationResponse(response)') ||
    !worker.includes('function respondWithCachedIndex(event)') ||
    !worker.includes('response.redirected')
  ) {
    throw new Error('Run the Veredra service-worker patch before copying the build.')
  }
  if (appBundle.includes('https://wicolly.com.br/Veredra/')) {
    throw new Error('Flutter build still contains the deprecated /Veredra/ production URL.')
  }
  if (!appBundle.includes('https://wicolly.com.br/veredra/')) {
    throw new Error('Flutter build must contain the canonical /veredra/ production URL.')
  }

  assertTargetInsideRepository(target)
  await fs.rm(target, { recursive: true, force: true })
  await fs.cp(source, target, { recursive: true })
  console.log(`Veredra build updated from ${source}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
