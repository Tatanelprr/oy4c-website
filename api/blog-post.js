import { proxyImageUrl, firstBodyImage } from './_lib/img.js'
import { normalizeAuthor } from './_lib/author.js'
import { sendJson, sendError, sendHandlerError, notionErrorFrom } from './_lib/respond.js'

const NOTION_TOKEN   = process.env.NOTION_TOKEN
const DATABASE_ID    = process.env.NOTION_DATABASE_ID
const NOTION_VERSION = '2022-06-28'

// Notion page ids: 32 hex digits, with or without the UUID dashes.
const compactId = (value) => (typeof value === 'string' ? value.replace(/-/g, '').toLowerCase() : '')
const isNotionId = (value) => /^[0-9a-f]{32}$/.test(compactId(value))

// Only published articles of the Blog & Articles database are served: any
// other page shared with the integration (drafts, team, partners) answers 404.
function isPublishedArticle(page) {
  return page.object === 'page'
    && !page.archived && !page.in_trash
    && page.parent?.type === 'database_id'
    && compactId(page.parent.database_id) === compactId(DATABASE_ID)
    && page.properties?.Published?.checkbox === true
}

function notionHeaders() {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
  }
}

const getRichText = (prop) => prop?.rich_text?.[0]?.plain_text ?? ''
const getTitle    = (prop) => prop?.title?.[0]?.plain_text ?? 'Untitled'

function parsePageMeta(page) {
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

// Body images and callout icons pasted as external links go through the proxy too.
function proxyBlockImages(block) {
  if (block.type === 'image' && block.image?.external?.url) {
    block.image.external.url = proxyImageUrl(block.image.external.url)
  }
  if (block.type === 'callout' && block.callout?.icon?.external?.url) {
    block.callout.icon.external.url = proxyImageUrl(block.callout.icon.external.url)
  }
  return block
}

async function fetchAllBlocks(blockId) {
  const blocks = []
  let cursor = undefined
  do {
    const url = new URL(`https://api.notion.com/v1/blocks/${blockId}/children`)
    url.searchParams.set('page_size', '100')
    if (cursor) url.searchParams.set('start_cursor', cursor)

    const res = await fetch(url.toString(), { headers: notionHeaders() })
    if (!res.ok) throw await notionErrorFrom(res)

    const data = await res.json()
    blocks.push(...data.results.map(proxyBlockImages))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)

  return blocks
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  const { id } = req.query
  if (!isNotionId(id)) return sendError(res, 404, 'blog-post invalid id')

  try {
    // Page first: its blocks are only fetched once it is a published article.
    const pageRes = await fetch(`https://api.notion.com/v1/pages/${compactId(id)}`, { headers: notionHeaders() })
    if (pageRes.status === 404 || pageRes.status === 400) return sendError(res, 404, 'blog-post not found')
    if (!pageRes.ok) throw await notionErrorFrom(pageRes)

    const page = await pageRes.json()
    if (!isPublishedArticle(page)) return sendError(res, 404, 'blog-post not a published article')

    const blocks = await fetchAllBlocks(page.id)
    const meta = parsePageMeta(page)
    // No cover in Notion: the first body image becomes the cover, and is not
    // repeated in the body (coverBlockId).
    const first = meta.image ? null : firstBodyImage(blocks)
    if (first) {
      meta.image = first.url
      meta.coverBlockId = first.blockId
    }
    // Cover credit (Harvard citation typed by the team), as rich text so its links
    // survive; falls back to the caption of the body image used as cover.
    const credit = page.properties['Image credit']?.rich_text ?? []
    meta.imageCredit = credit.some((t) => t.plain_text?.trim()) ? credit : (first?.caption ?? [])
    sendJson(res, { ...meta, blocks })
  } catch (err) {
    sendHandlerError(res, 'blog-post handler error', err)
  }
}
