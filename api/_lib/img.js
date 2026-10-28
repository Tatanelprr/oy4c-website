// Shared image-proxy helpers. Files under api/_lib are not exposed as routes
// (Vercel ignores "_"-prefixed paths; the dev plugin only matches [a-z0-9-]).
//
// Images pasted into Notion are hosted on third parties (imgbb, Squarespace).
// Rewriting them to /api/img keeps the visitor's browser on our own domain, so
// their IP address never reaches those hosts.

export const ALLOWED_IMAGE_HOSTS = new Set(['i.ibb.co', 'images.squarespace-cdn.com'])

// Returns the parsed URL if it is an https URL on an allowed host, else null.
export function parseAllowedImageUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return null
  let url
  try {
    url = new URL(value)
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  if (url.username || url.password || url.port) return null
  if (!ALLOWED_IMAGE_HOSTS.has(url.hostname)) return null
  return url
}

// Rewrites an allowed third-party image URL to our proxy; anything else
// (null, local /paths, other hosts) is returned unchanged.
export function proxyImageUrl(value) {
  if (!parseAllowedImageUrl(value)) return value
  return `/api/img?u=${encodeURIComponent(value)}`
}

// First body image that can go through the proxy, used as the cover of an
// article that has none. Notion-hosted files are skipped: their URLs expire
// after about an hour, sooner than a cached API response can be served.
export function firstBodyImage(blocks = []) {
  for (const b of blocks) {
    if (b.type !== 'image') continue
    const url = proxyImageUrl(b.image?.external?.url)
    if (url?.startsWith('/api/img?')) return { url, caption: b.image.caption ?? [], blockId: b.id }
  }
  return null
}
