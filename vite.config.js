import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf-8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (key && !(key in process.env)) process.env[key] = val
  }
}

// Serves api/*.js handlers locally so `npm run dev` works without vercel CLI
function devApiPlugin() {
  return {
    name: 'vercel-api-dev',
    configureServer(server) {
      loadEnvFile(resolve(process.cwd(), '.env.local'))

      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? '').split('?')[0]
        if (!pathname.startsWith('/api/')) return next()

        const route = pathname.slice(5)
        if (!/^[a-z0-9-]+$/.test(route)) return next()

        // Shim Express-like methods expected by handlers
        res.status = (code) => { res.statusCode = code; return res }
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }

        // Parse query string for handlers that use req.query (e.g. blog-post)
        const qs = new URLSearchParams((req.url ?? '').split('?')[1] ?? '')
        req.query = Object.fromEntries(qs)

        try {
          const mod = await server.ssrLoadModule(`/api/${route}.js`)
          await mod.default(req, res)
        } catch (err) {
          console.error(`[dev-api] /api/${route}:`, err.message)
          if (!res.headersSent) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: err.message }))
          }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devApiPlugin()],
})
