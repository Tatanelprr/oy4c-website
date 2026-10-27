import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { PAGE_META, SITE_URL, NOT_FOUND_META, BLOG_POST_LOADING_META } from './src/data/pageMeta.js'

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

const escapeHtml = (text) =>
  text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Copy of the built index.html with one route's title, description and
// canonical (or no canonical / a noindex tag when the meta asks for it).
export function renderMeta(html, { title, description, path, noindex }) {
  let out = html
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
  out = path
    ? out.replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_URL}${path}" />`)
    : out.replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '')
  if (noindex) out = out.replace('</title>', '</title>\n    <meta name="robots" content="noindex" />')
  return out
}

// After the build, writes dist/<route>/index.html for every route in
// PAGE_META, so each page has its own title, description and canonical before
// any JavaScript runs (no flash of the home title, and crawlers that do not run
// JavaScript see the right values). Also writes:
// - dist/blog-post.html: template for /blog/:id (generic blog meta, no canonical);
// - dist/404.html: served by Vercel with a real 404 status for any URL that no
//   rewrite in vercel.json matches; the app then renders the NotFound page.
// The build fails if a route of PAGE_META has no rewrite in vercel.json, since
// that route would then answer 404 in production.
function prerenderMetaPlugin() {
  return {
    name: 'prerender-route-meta',
    apply: 'build',
    closeBundle() {
      const root = process.cwd()
      const dist = resolve(root, 'dist')
      const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')
      const write = (file, meta) => {
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, renderMeta(template, meta))
      }
      for (const meta of Object.values(PAGE_META)) {
        write(meta.path === '/' ? resolve(dist, 'index.html') : resolve(dist, `.${meta.path}/index.html`), meta)
      }
      write(resolve(dist, 'blog-post.html'), BLOG_POST_LOADING_META)
      write(resolve(dist, '404.html'), NOT_FOUND_META)

      const { rewrites = [] } = JSON.parse(readFileSync(resolve(root, 'vercel.json'), 'utf-8'))
      const sources = new Set(rewrites.map((r) => r.source))
      const missing = Object.keys(PAGE_META).filter((p) => !sources.has(p))
      if (missing.length) throw new Error(`vercel.json has no rewrite for: ${missing.join(', ')}`)
    },
  }
}

// Size of the public Topic 10 PDF, shown next to its download link
// (0 when the file is missing: the size is then not displayed).
const FOOD_PDF = resolve(process.cwd(), 'public/curriculum/food-management.pdf')
const FOOD_PDF_BYTES = existsSync(FOOD_PDF) ? statSync(FOOD_PDF).size : 0

export default defineConfig({
  plugins: [react(), devApiPlugin(), prerenderMetaPlugin()],
  define: {
    'import.meta.env.FOOD_PDF_BYTES': JSON.stringify(FOOD_PDF_BYTES),
  },
})
