import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.VITE_NOTION_TOKEN })
const DATABASE_ID = process.env.VITE_NOTION_DATABASE_ID

function getRichText(prop) {
  return prop?.rich_text?.[0]?.plain_text ?? ''
}

function getTitle(prop) {
  return prop?.title?.[0]?.plain_text ?? 'Untitled'
}

function parseArticle(page) {
  const p = page.properties
  return {
    id: page.id,
    title: getTitle(p.Title ?? p.Name),
    excerpt: getRichText(p.Excerpt ?? p.Description ?? p.Summary),
    date: p.Date?.date?.start ?? page.created_time,
    author: getRichText(p.Author) || p.Author?.people?.[0]?.name || '',
    tags: p.Tags?.multi_select?.map((t) => t.name) ?? [],
    image:
      page.cover?.external?.url ??
      page.cover?.file?.url ??
      p.Cover?.files?.[0]?.external?.url ??
      p.Cover?.files?.[0]?.file?.url ??
      null,
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')

  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: 'Published',
        checkbox: { equals: true },
      },
      sorts: [{ property: 'Date', direction: 'descending' }],
    })

    const articles = response.results.map(parseArticle)
    res.status(200).json(articles)
  } catch (err) {
    console.error('Notion API error:', err.message)
    res.status(500).json({ error: 'Failed to fetch posts' })
  }
}
