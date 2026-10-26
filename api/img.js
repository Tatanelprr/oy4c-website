import { parseAllowedImageUrl } from './_lib/img.js'

// Image proxy: GET /api/img?u=<encoded https URL on an allowed host>.
// Not an open proxy: only hosts in ALLOWED_IMAGE_HOSTS, https only, redirects
// re-checked against the same allowlist, raster images only.

const TIMEOUT_MS    = 8000
const MAX_BYTES     = 4 * 1024 * 1024 // Vercel caps function responses at 4.5 MB
const MAX_REDIRECTS = 3
// SVG is excluded: served from our origin it could run script.
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])

class UpstreamError extends Error {}

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
    if (!resp.ok) throw new UpstreamError(`Upstream status ${resp.status}`)
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

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return sendError(res, 405, 'Method not allowed')

  const raw = new URL(req.url ?? '', 'http://localhost').searchParams.get('u')
  const target = parseAllowedImageUrl(raw)
  if (!target) return sendError(res, 400, 'Invalid or disallowed image URL')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const upstream = await fetchImage(target, controller.signal)
    const type = (upstream.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
    if (!ALLOWED_TYPES.has(type)) throw new UpstreamError(`Not an allowed image type: ${type || 'none'}`)

    const body = await readLimited(upstream)

    res.statusCode = 200
    res.setHeader('Content-Type', type)
    res.setHeader('Content-Length', body.length)
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox")
    res.end(req.method === 'HEAD' ? undefined : body)
  } catch (err) {
    const reason = err.name === 'AbortError' ? 'Upstream timeout' : err.message
    if (!(err instanceof UpstreamError) && err.name !== 'AbortError') console.error('img proxy error:', err.message)
    sendError(res, 502, `Bad gateway: ${reason}`)
  } finally {
    clearTimeout(timer)
    controller.abort() // releases an unread upstream body after an early error
  }
}
