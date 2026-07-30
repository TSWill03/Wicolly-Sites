import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const port = Number(process.env.PORT || 4173)
const mime = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.pdf': 'application/pdf', '.wasm': 'application/wasm' }

http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://127.0.0.1')
    const decoded = decodeURIComponent(url.pathname)
    const candidate = path.resolve(root, `.${decoded}`)
    if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) throw new Error('outside root')
    let target = candidate
    const stat = await fs.stat(target).catch(() => null)
    if (stat?.isDirectory()) target = path.join(target, 'index.html')
    const content = await fs.readFile(target)
    response.writeHead(200, { 'Content-Type': mime[path.extname(target).toLowerCase()] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' })
    response.end(content)
  } catch {
    const fallback = await fs.readFile(path.join(root, '404.html')).catch(() => Buffer.from('Not found'))
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(fallback)
  }
}).listen(port, '127.0.0.1', () => console.log(`Static test server: http://127.0.0.1:${port}`))
