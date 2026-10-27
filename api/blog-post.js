import { proxyImageUrl } from './_lib/img.js'
import { normalizeAuthor } from './_lib/author.js'

const NOTION_TOKEN   = process.env.VITE_NOTION_TOKEN
const NOTION_VERSION = '2022-06-28'

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
    if (!res.ok) throw new Error(`Blocks fetch failed: ${res.status}`)

    const data = await res.json()
    blocks.push(...data.results.map(proxyBlockImages))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)

  return blocks
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.setHeader('Pragma', 'no-cache')

  const { id } = req.query
  if (!id) return res.status(400).json({ error: 'Missing id parameter' })

  try {
    const [pageRes, blocks] = await Promise.all([
      fetch(`https://api.notion.com/v1/pages/${id}`, { headers: notionHeaders() }),
      fetchAllBlocks(id),
    ])

    if (!pageRes.ok) {
      const err = await pageRes.json()
      return res.status(pageRes.status).json({ error: 'Notion error', detail: err.message })
    }

    const page = await pageRes.json()
    res.status(200).json({ ...parsePageMeta(page), blocks })
  } catch (err) {
    console.error('blog-post handler error:', err.message)
    res.status(500).json({ error: 'Internal error', detail: err.message })
  }
}
