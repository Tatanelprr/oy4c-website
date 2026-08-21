const NOTION_TOKEN   = process.env.VITE_NOTION_TOKEN
const TEAM_DB_ID     = process.env.VITE_NOTION_TEAM_DB_ID
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

function parseMember(page) {
  const p = page.properties
  return {
    name:     getTitle(p.Name),
    role:     getRichText(p.Role),
    pronouns: getRichText(p.Pronouns),
    team:     getSelect(p.Team),
    linkedin: getUrl(p.LinkedIn),
    quote:    getRichText(p.Quote),
    photo:    getUrl(p.Photo),
    section:  getSelect(p.Section),
  }
}

async function fetchAllMembers() {
  const members = []
  let cursor = undefined
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const resp = await fetch(
      `https://api.notion.com/v1/databases/${TEAM_DB_ID}/query`,
      { method: 'POST', headers: notionHeaders(), body: JSON.stringify(body) }
    )
    if (!resp.ok) {
      const err = await resp.json()
      throw new Error(err.message ?? `Notion error ${resp.status}`)
    }
    const data = await resp.json()
    members.push(...data.results.map(parseMember))
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return members
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate')
  res.setHeader('Pragma', 'no-cache')

  try {
    const members = await fetchAllMembers()

    const grouped = {
      seniorLeadership: [],
      operations: [],
      peopleAndCulture: [],
      executiveTeam: [],
      functions: [],
    }

    for (const m of members) {
      if (m.section === 'Senior Leadership') {
        grouped.seniorLeadership.push(m)
      } else if (m.section === 'Executive Team') {
        grouped.executiveTeam.push(m)
      } else if (m.section === 'Functions') {
        grouped.functions.push(m)
      } else if (m.section === 'Operations') {
        if (m.team === 'People and Culture') {
          grouped.peopleAndCulture.push(m)
        } else {
          grouped.operations.push(m)
        }
      }
    }

    res.status(200).json(grouped)
  } catch (err) {
    console.error('Team handler error:', err.message)
    res.status(500).json({ error: 'Internal error', detail: err.message })
  }
}
