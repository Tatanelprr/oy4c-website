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
    author:  getRichText(p.Author) || p.Author?.people?.[0]?.name || '',
    tags:    p.Tags?.multi_select?.map((t) => t.name) ?? [],
    image:   p.Image?.url ?? page.cover?.external?.url ?? page.cover?.file?.url ?? null,
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.setHeader('Pragma', 'no-cache')

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

    if (!response.ok) {
      const err = await response.json()
      console.error('Notion API error:', err)
      return res.status(502).json({ error: 'Notion API error', detail: err.message })
    }

    const data     = await response.json()
    const articles = data.results.map(parseArticle)
    res.status(200).json(articles)
  } catch (err) {
    console.error('Handler error:', err.message)
    res.status(500).json({ error: 'Internal error', detail: err.message })
  }
}
