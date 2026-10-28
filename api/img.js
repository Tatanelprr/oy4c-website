import { parseAllowedImageUrl } from './_lib/img.js'

// Image proxy: GET /api/img?u=<encoded https URL on an allowed host>[&w=400|800|1200].
// Not an open proxy: only hosts in ALLOWED_IMAGE_HOSTS, https only, redirects
// re-checked against the same allowlist, raster images only.
// With w, the image is resized to that width (never enlarged) and served as
// WebP without metadata. w is part of the URL, so the CDN caches each width apart.

// Closed list, matched as exact strings: no arbitrary resize work, and no
// "0400" or "400.0" variants splitting the CDN cache.
const WIDTHS        = new Set(['400', '800', '1200'])
const TIMEOUT_MS    = 5000 // per attempt
const RETRY_DELAY   = 300
const MAX_BYTES     = 4 * 1024 * 1024 // Vercel caps function responses at 4.5 MB
const MAX_REDIRECTS = 3
// SVG is excluded: served from our origin it could run script.
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])

class UpstreamError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

function sendError(res, status, message) {
  res.statusCode = status
  res.setHeader('Content-Type', 'text/plain; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(message)
}

async function fetchImage(url, signal) {
  let current = url
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    // Only these headers go upstream: no visitor cookies, referrer or IP headers.
    const resp = await fetch(current, {
      redirect: 'manual',
      signal,
      headers: { Accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif' },
    })
    if (resp.status >= 300 && resp.status < 400) {
      const next = parseAllowedImageUrl(new URL(resp.headers.get('location') ?? '', current).href)
      if (!next) throw new UpstreamError('Redirect to a disallowed location')
      current = next
      continue
    }
    if (!resp.ok) throw new UpstreamError(`Upstream status ${resp.status}`, resp.status)
    return resp
  }
  throw new UpstreamError('Too many redirects')
}

async function readLimited(resp) {
  const declared = Number(resp.headers.get('content-length'))
  if (declared > MAX_BYTES) throw new UpstreamError('Image too large')

  const chunks = []
  let total = 0
  for await (const chunk of resp.body) {
    total += chunk.length
    if (total > MAX_BYTES) throw new UpstreamError('Image too large')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

// One attempt, timeout covering headers and body.
async function loadImage(target) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const upstream = await fetchImage(target, controller.signal)
    const type = (upstream.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
    if (!ALLOWED_TYPES.has(type)) throw new UpstreamError(`Not an allowed image type: ${type || 'none'}`)
    return { type, body: await readLimited(upstream) }
  } finally {
    clearTimeout(timer)
    controller.abort() // releases an unread upstream body after an early error
  }
}

// imgbb sheds bursts of parallel requests with 503s or stalls: worth one more try.
const isTransient = (err) => err.name === 'AbortError' || err.status >= 500

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return sendError(res, 405, 'Method not allowed')

  const params = new URL(req.url ?? '', 'http://localhost').searchParams
  const target = parseAllowedImageUrl(params.get('u'))
  if (!target) return sendError(res, 400, 'Invalid or disallowed image URL')
  const widths = params.getAll('w')
  if (widths.length > 1 || (widths.length && !WIDTHS.has(widths[0]))) return sendError(res, 400, 'Invalid width')
  const width = params.has('w') ? Number(params.get('w')) : null

  try {
    let image
    try {
      image = await loadImage(target)
    } catch (err) {
      if (!isTransient(err)) throw err
      await new Promise((r) => setTimeout(r, RETRY_DELAY))
      image = await loadImage(target)
    }
    let { type, body } = image
    if (width) {
      const { default: sharp } = await import('sharp')
      // rotate() applies the EXIF orientation; sharp drops all metadata unless asked to keep it.
      body = await sharp(body, { limitInputPixels: 50e6 })
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer()
      type = 'image/webp'
    }

    res.statusCode = 200
    res.setHeader('Content-Type', type)
    res.setHeader('Content-Length', body.length)
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox")
    res.end(req.method === 'HEAD' ? undefined : body)
  } catch (err) {
    // The reason stays in the server logs; the client only gets a generic 502.
    const reason = err.name === 'AbortError' ? 'Upstream timeout' : err.message
    console.error('img proxy error:', reason)
    sendError(res, 502, 'Bad gateway')
  }
}
