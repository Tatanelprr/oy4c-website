import { proxyImageUrl } from './_lib/img.js'
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
    sendJson(res, articles)
  } catch (err) {
    sendHandlerError(res, 'blog-posts handler error', err)
  }
}
