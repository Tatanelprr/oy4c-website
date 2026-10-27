// Shared response helpers for the Notion-backed API routes.
//
// Caching: the Vercel CDN keeps a response for 5 minutes (s-maxage=300), then
// serves it stale for up to an hour while it refreshes in the background
// (stale-while-revalidate=3600). An edit in Notion is therefore live within
// about 5 minutes for an active page, and visitors never wait on Notion when a
// cached copy exists. Browsers do not cache (max-age=0): they always ask the CDN.
const CACHE_OK = 'public, max-age=0, s-maxage=300, stale-while-revalidate=3600'

export function sendJson(res, data) {
  res.setHeader('Cache-Control', CACHE_OK)
  res.status(200).json(data)
}

// Generic error for the client; the detail only goes to the server logs.
// Errors are never cached, so the next request retries Notion.
export function sendError(res, status, label, detail) {
  if (detail !== undefined) console.error(`${label}:`, detail)
  res.setHeader('Cache-Control', 'no-store')
  const message = status === 404 ? 'Not found' : status === 502 ? 'Upstream error' : 'Internal error'
  res.status(status).json({ error: message })
}

// Error raised when Notion answers with a non-2xx status.
export class NotionError extends Error {
  constructor(status, body) {
    super(`Notion error ${status}`)
    this.status = status
    this.body = body
  }
}

export async function notionErrorFrom(resp) {
  let body
  try { body = await resp.json() } catch { body = null }
  return new NotionError(resp.status, body?.message ?? body)
}

// Notion failures answer 502, anything else 500.
export function sendHandlerError(res, label, err) {
  if (err instanceof NotionError) return sendError(res, 502, label, `${err.message}: ${err.body}`)
  return sendError(res, 500, label, err?.message ?? err)
}
