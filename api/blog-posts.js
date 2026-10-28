import { proxyImageUrl, firstBodyImage } from './_lib/img.js'
import { sendJson, sendHandlerError, notionErrorFrom } from './_lib/respond.js'
import { normalizeAuthor } from './_lib/author.js'

const NOTION_TOKEN = process.env.VITE_NOTION_TOKEN
const DATABASE_ID  = process.env.VITE_NOTION_DATABASE_ID
const NOTION_VERSION = '2022-06-28'

function notionHeaders() {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

const getRichText = (prop) => prop?.rich_text?.[0]?.plain_text ?? ''
const getTitle    = (prop) => prop?.title?.[0]?.plain_text ?? 'Untitled'

function parseArticle(page) {
  const p = page.properties
  return {
    id:      page.id,
    title:   getTitle(p.Title ?? p.Name),
    excerpt: getRichText(p.Excerpt ?? p.Description ?? p.Summary),
    date:    p.Date?.date?.start ?? page.created_time,
    author:  normalizeAuthor(getRichText(p.Author) || p.Author?.people?.[0]?.name),
    tags:    p.Tags?.multi_select?.map((t) => t.name) ?? [],
    image:   proxyImageUrl(p.Image?.url ?? page.cover?.external?.url ?? page.cover?.file?.url ?? null),
  }
}

// Cover fallback for articles without one: only their first blocks are read
// (the first image sits within the first 10 blocks in every article today).
const FIRST_BLOCKS      = 25
const COVER_CONCURRENCY = 3 // Notion allows about 3 requests per second on average
const COVER_TIMEOUT_MS  = 5000

// Never throws: an article whose blocks cannot be read keeps the placeholder cover.
async function firstImageOf(pageId) {
  try {
    const res = await fetch(
      `https://api.notion.com/v1/blocks/${pageId}/children?page_size=${FIRST_BLOCKS}`,
      { headers: notionHeaders(), signal: AbortSignal.timeout(COVER_TIMEOUT_MS) }
    )
    if (!res.ok) throw await notionErrorFrom(res)
    return firstBodyImage((await res.json()).results)?.url ?? null
  } catch (err) {
    console.error('blog-posts cover fallback:', pageId, err.message)
    return null
  }
}

// Runs fn over items with at most `limit` calls in flight.
async function mapLimit(items, limit, fn) {
  const out = new Array(items.length)
  let next = 0
  const worker = async () => {
    while (next < items.length) {
      const i = next++
      out[i] = await fn(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker))
  return out
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: 'POST',
        headers: notionHeaders(),
        body: JSON.stringify({
          filter: { property: 'Published', checkbox: { equals: true } },
          sorts:  [{ property: 'Date', direction: 'descending' }],
        }),
      }
    )

    if (!response.ok) throw await notionErrorFrom(response)

    const data     = await response.json()
    const articles = data.results.map(parseArticle)
    const missing  = articles.filter((a) => !a.image)
    const covers   = await mapLimit(missing, COVER_CONCURRENCY, (a) => firstImageOf(a.id))
    missing.forEach((a, i) => { a.image = covers[i] })
    sendJson(res, articles)
  } catch (err) {
    sendHandlerError(res, 'blog-posts handler error', err)
  }
}
