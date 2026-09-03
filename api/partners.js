const NOTION_TOKEN   = process.env.VITE_NOTION_TOKEN
const PARTNERS_DB_ID = process.env.VITE_NOTION_PARTNERS_DB_ID
const NOTION_VERSION = '2022-06-28'

function notionHeaders() {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

const getRichText = (prop) => prop?.rich_text?.[0]?.plain_text ?? ''
const getTitle    = (prop) => prop?.title?.[0]?.plain_text ?? ''
const getSelect   = (prop) => prop?.select?.name ?? ''
const getUrl      = (prop) => prop?.url ?? null

function parsePartner(page) {
  const p = page.properties
  return {
    name:        getTitle(p.Name),
    description: getRichText(p.Description),
    logo:        getUrl(p.Logo),
    website:     getUrl(p.Website),
    category:    getSelect(p.Category),
  }
}

async function fetchActivePartners() {
  const items = []
  let cursor = undefined
  do {
    const body = {
      page_size: 100,
      filter: { property: 'Active', checkbox: { equals: true } },
    }
    if (cursor) body.start_cursor = cursor
    const resp = await fetch(
      `https://api.notion.com/v1/databases/${PARTNERS_DB_ID}/query`,
      { method: 'POST', headers: notionHeaders(), body: JSON.stringify(body) }
    )
    if (!resp.ok) {
      const err = await resp.json()
      throw new Error(err.message ?? `Notion error ${resp.status}`)
    }
    const data = await resp.json()
    items.push(...data.results.map(parsePartner))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return items
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.setHeader('Pragma', 'no-cache')

  try {
    const all = await fetchActivePartners()
    res.status(200).json({
      partners: all.filter((p) => p.category === 'Partner'),
      seenIn:   all.filter((p) => p.category === 'As Seen In'),
    })
  } catch (err) {
    console.error('Partners handler error:', err.message)
    res.status(500).json({ error: 'Internal error', detail: err.message })
  }
}
