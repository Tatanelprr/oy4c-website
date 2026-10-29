import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'fs'
import { resolve, dirname } from 'path'
import { execFileSync } from 'child_process'
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

// Replaces the content of <meta {attr}="{key}" content="..." />.
const setMeta = (html, attr, key, value) =>
  html.replace(new RegExp(`<meta ${attr}="${key}" content="[^"]*" />`), `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`)

// Copy of the built index.html with one route's title, description and
// canonical, also used for og:title / og:description / og:url and
// twitter:title / twitter:description (no canonical and no og:url, or a
// noindex tag, when the meta asks for it).
export function renderMeta(html, { title, description, path, noindex }) {
  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`)
  for (const [attr, key, value] of [
    ['name', 'description', description],
    ['property', 'og:title', title],
    ['property', 'og:description', description],
    ['name', 'twitter:title', title],
    ['name', 'twitter:description', description],
  ]) out = setMeta(out, attr, key, value)
  out = path
    ? setMeta(out, 'property', 'og:url', `${SITE_URL}${path}`)
        .replace(/<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${SITE_URL}${path}" />`)
    : out
        .replace(/\s*<meta property="og:url" content="[^"]*" \/>/, '')
        .replace(/\s*<link rel="canonical" href="[^"]*" \/>/, '')
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

// "Coming soon" placeholders: left out of the sitemap until they have content.
const SITEMAP_EXCLUDED = new Set(['/takeaction', '/consultancy', '/speaker', '/last-push'])

// Static routes of App.jsx with the page component each one renders.
function appRoutes(root) {
  const app = readFileSync(resolve(root, 'src/App.jsx'), 'utf-8')
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '') // JSX comments (hidden routes)
    .replace(/^\s*\/\/.*$/gm, '')
  return [...app.matchAll(/<Route path="([^"]+)" element=\{<(\w+)\b/g)]
    .map(([, path, component]) => ({ path, component }))
    .filter(({ path, component }) => !path.includes(':') && path !== '*' && component !== 'Navigate')
}

// Date of the last commit touching a file, else today (shallow clones).
function lastModified(root, file) {
  try {
    const date = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], { cwd: root, encoding: 'utf-8' }).trim()
    if (date) return date
  } catch { /* no git available */ }
  return new Date().toISOString().slice(0, 10)
}

// Published articles from the Notion "Blog & Articles" database, with their
// last edit date. Needs NOTION_TOKEN and NOTION_DATABASE_ID (or their old
// VITE_ names) at build time (Vercel exposes project env vars to the build).
// Without them, the sitemap only lists the static routes.
// TODO: if the build log shows "sitemap: no Notion token", check in Vercel >
// Settings > Environment Variables that both variables are enabled for the
// Production (and Preview) environments, then redeploy.
async function publishedArticles() {
  const token = process.env.NOTION_TOKEN ?? process.env.VITE_NOTION_TOKEN
  const db = process.env.NOTION_DATABASE_ID ?? process.env.VITE_NOTION_DATABASE_ID
  if (!token || !db) {
    console.warn('sitemap: no Notion token at build time, articles not listed')
    return []
  }
  const items = []
  let cursor
  do {
    const resp = await fetch(`https://api.notion.com/v1/databases/${db}/query`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_size: 100, filter: { property: 'Published', checkbox: { equals: true } }, ...(cursor && { start_cursor: cursor }) }),
    })
    if (!resp.ok) throw new Error(`Notion status ${resp.status}`)
    const data = await resp.json()
    items.push(...data.results.map((page) => ({ path: `/blog/${page.id}`, lastmod: page.last_edited_time.slice(0, 10) })))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return items
}

// Writes dist/sitemap.xml: App.jsx routes (minus placeholders) + articles.
function sitemapPlugin() {
  return {
    name: 'sitemap',
    apply: 'build',
    async closeBundle() {
      const root = process.cwd()
      const urls = appRoutes(root)
        .filter(({ path }) => !SITEMAP_EXCLUDED.has(path))
        .map(({ path, component }) => ({ path, lastmod: lastModified(root, `src/pages/${component}.jsx`) }))
      try {
        const articles = await publishedArticles()
        urls.push(...articles)
        console.log(`sitemap: ${urls.length - articles.length} pages + ${articles.length} articles`)
      } catch (err) {
        console.warn(`sitemap: articles not listed (${err.message})`)
      }
      const body = urls
        .map(({ path, lastmod }) => `  <url><loc>${SITE_URL}${path}</loc><lastmod>${lastmod}</lastmod></url>`)
        .join('\n')
      writeFileSync(resolve(root, 'dist/sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`)
    },
  }
}

// Size of the public Topic 10 PDF, shown next to its download link
// (0 when the file is missing: the size is then not displayed).
const FOOD_PDF = resolve(process.cwd(), 'public/curriculum/food-management.pdf')
const FOOD_PDF_BYTES = existsSync(FOOD_PDF) ? statSync(FOOD_PDF).size : 0

export default defineConfig({
  plugins: [react(), devApiPlugin(), prerenderMetaPlugin(), sitemapPlugin()],
  define: {
    'import.meta.env.FOOD_PDF_BYTES': JSON.stringify(FOOD_PDF_BYTES),
  },
})
