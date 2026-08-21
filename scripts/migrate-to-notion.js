import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const NOTION_TOKEN   = process.env.VITE_NOTION_TOKEN
const NOTION_VERSION = '2022-06-28'
const PAGE_ID        = process.argv[2]

if (!NOTION_TOKEN) {
  console.error('Error: VITE_NOTION_TOKEN is not set')
  process.exit(1)
}
if (!PAGE_ID) {
  console.error('Usage: node scripts/migrate-to-notion.js PAGE_ID')
  process.exit(1)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function notionHeaders() {
  return {
    Authorization: `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json',
  }
}

function richText(value) {
  if (!value) return []
  // Notion rich_text is capped at 2000 chars per object
  const content = String(value).slice(0, 2000)
  return [{ type: 'text', text: { content } }]
}

function urlValue(value) {
  if (!value) return null
  // Only store values that look like full URLs; local filenames are left null
  return value.startsWith('http') ? value : null
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// ── Notion API calls ──────────────────────────────────────────────────────────

async function createDatabase(parentPageId, title, properties) {
  const res = await fetch('https://api.notion.com/v1/databases', {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      parent: { type: 'page_id', page_id: parentPageId },
      title: [{ type: 'text', text: { content: title } }],
      properties,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Failed to create database "${title}": ${err.message ?? res.status}`)
  }
  return res.json()
}

async function createPage(databaseId, properties) {
  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      parent: { database_id: databaseId },
      properties,
    }),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Failed to create page: ${err.message ?? res.status}`)
  }
  return res.json()
}

// ── Team migration ─────────────────────────────────────────────────────────────

const SECTION_MAP = {
  seniorLeadership: 'Senior Leadership',
  operations:       'Operations',
  executiveTeam:    'Executive Team',
  functions:        'Functions',
}

async function migrateTeam(pageId, teamData) {
  console.log('\n📋 Creating Team database…')

  const db = await createDatabase(pageId, 'Team', {
    Name:     { title: {} },
    Role:     { rich_text: {} },
    Pronouns: { rich_text: {} },
    Team:     { select: {} },
    LinkedIn: { url: {} },
    Quote:    { rich_text: {} },
    Photo:    { url: {} },
    Section: {
      select: {
        options: [
          { name: 'Senior Leadership', color: 'blue'   },
          { name: 'Operations',        color: 'green'  },
          { name: 'People & Culture',  color: 'pink'   },
          { name: 'Executive Team',    color: 'purple' },
          { name: 'Functions',         color: 'orange' },
        ],
      },
    },
  })

  console.log(`✓ Team database created`)

  let count = 0
  for (const [key, members] of Object.entries(teamData)) {
    const section = SECTION_MAP[key] ?? key
    for (const member of members) {
      await createPage(db.id, {
        Name:     { title:     richText(member.name) },
        Role:     { rich_text: richText(member.role) },
        Pronouns: { rich_text: richText(member.pronouns) },
        Team:     { select: member.team ? { name: member.team } : null },
        LinkedIn: { url: urlValue(member.linkedin) },
        Quote:    { rich_text: richText(member.quote) },
        Photo:    { url: urlValue(member.photo) },
        Section:  { select: { name: section } },
      })
      count++
      console.log(`  ✓ ${member.name} added`)
      await sleep(334) // stay within Notion's 3 req/s limit
    }
  }

  console.log(`\n✓ Team done — ${count} members added`)
}

// ── Ambassadors migration ──────────────────────────────────────────────────────

async function migrateAmbassadors(pageId, ambassadors) {
  console.log('\n📋 Creating Ambassadors database…')

  const db = await createDatabase(pageId, 'Ambassadors', {
    Name:     { title: {} },
    Country:  { rich_text: {} },
    LinkedIn: { url: {} },
    Bio:      { rich_text: {} },
    Photo:    { url: {} },
  })

  console.log(`✓ Ambassadors database created`)

  let count = 0
  for (const ambassador of ambassadors) {
    await createPage(db.id, {
      Name:     { title:     richText(ambassador.name) },
      Country:  { rich_text: richText(ambassador.country) },
      LinkedIn: { url: urlValue(ambassador.linkedin) },
      Bio:      { rich_text: richText(ambassador.bio) },
      Photo:    { url: urlValue(ambassador.photo) },
    })
    count++
    console.log(`  ✓ ${ambassador.name} added`)
    await sleep(334)
  }

  console.log(`\n✓ Ambassadors done — ${count} ambassadors added`)
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  const teamData    = JSON.parse(readFileSync(join(__dirname, '../src/data/team.json'), 'utf-8'))
  const ambassadors = JSON.parse(readFileSync(join(__dirname, '../src/data/ambassadors.json'), 'utf-8'))

  const totalTeam = Object.values(teamData).reduce((s, a) => s + a.length, 0)
  console.log(`🚀 Migrating to Notion page ${PAGE_ID}`)
  console.log(`   ${totalTeam} team members · ${ambassadors.length} ambassadors`)
  console.log(`   Estimated time: ~${Math.ceil((totalTeam + ambassadors.length) * 0.334 / 60)} min`)

  await migrateTeam(PAGE_ID, teamData)
  await migrateAmbassadors(PAGE_ID, ambassadors)

  console.log('\n🎉 Migration complete!')
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err.message)
  process.exit(1)
})
