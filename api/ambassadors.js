import { proxyImageUrl } from './_lib/img.js'
import { sendJson, sendHandlerError, notionErrorFrom } from './_lib/respond.js'

const NOTION_TOKEN       = process.env.VITE_NOTION_TOKEN
const AMBASSADORS_DB_ID  = process.env.VITE_NOTION_AMBASSADORS_DB_ID
const NOTION_VERSION     = '2022-06-28'

function notionHeaders() {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

const getRichText = (prop) => prop?.rich_text?.[0]?.plain_text ?? ''
const getTitle    = (prop) => prop?.title?.[0]?.plain_text ?? ''
const getUrl      = (prop) => prop?.url ?? null

function parseAmbassador(page) {
  const p = page.properties
  return {
    name:     getTitle(p.Name),
    country:  getRichText(p.Country),
    linkedin: getUrl(p.LinkedIn),
    bio:      getRichText(p.Bio),
    photo:    proxyImageUrl(getUrl(p.Photo)),
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')

  try {
    const resp = await fetch(
      `https://api.notion.com/v1/databases/${AMBASSADORS_DB_ID}/query`,
      {
        method: 'POST',
        headers: notionHeaders(),
        body: JSON.stringify({ page_size: 100 }),
      }
    )

    if (!resp.ok) throw await notionErrorFrom(resp)

    const data = await resp.json()
    const ambassadors = data.results.map(parseAmbassador)
    sendJson(res, ambassadors)
  } catch (err) {
    sendHandlerError(res, 'ambassadors handler error', err)
  }
}
