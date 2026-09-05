import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const NOTION_TOKEN   = process.env.VITE_NOTION_TOKEN
const NOTION_VERSION = '2022-06-28'
const PARENT_PAGE_ID = '3adf5206396380e18649c6fc50b9b5ce'

if (!NOTION_TOKEN) {
  console.error('Error: VITE_NOTION_TOKEN is not set')
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
  return [{ type: 'text', text: { content: String(value).slice(0, 2000) } }]
}

function urlValue(value) {
  if (!value) return null
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

// ── Data ──────────────────────────────────────────────────────────────────────

const PARTNERS = [
  // Partners
  { name: 'Feel Good Action',              logo: '/partners/feel-good-action.webp',        website: 'https://feelgoodaction.org',        category: 'Partner'    },
  { name: 'Climate Cardinals',             logo: '/partners/climate-cardinals.png',         website: 'https://climatecardinals.org',      category: 'Partner'    },
  { name: 'Force of Nature',               logo: '/partners/force-of-nature.webp',          website: 'https://force-of-nature.xyz',       category: 'Partner'    },
  { name: 'Climate Majority Project',      logo: '/partners/climate-majority-project.webp', website: 'https://climatemajorityproject.com',category: 'Partner'    },
  { name: 'Climate Quilt',                 logo: '/partners/climate-quilt.png',             website: 'https://climatequilt.org',          category: 'Partner'    },
  { name: 'Energy for Refugees Amsterdam', logo: '/partners/energy-for-refugees.jpg',       website: 'https://energyforrefugees.nl',      category: 'Partner'    },

  // As Seen In
  { name: 'National Geographic',           logo: '/seen-in/national-geographic.png',        website: 'https://nationalgeographic.com',    category: 'As Seen In' },
  { name: 'DoSomething.org',               logo: '/seen-in/dosomething.png',                website: 'https://dosomething.org',           category: 'As Seen In' },
  { name: 'TedX',                          logo: '/seen-in/tedx.png',                       website: 'https://ted.com',                   category: 'As Seen In' },
  { name: 'Euronews',                      logo: '/seen-in/euronews.png',                   website: 'https://euronews.com',              category: 'As Seen In' },
  { name: 'Environmental Media Association',logo: '/seen-in/ema.png',                       website: 'https://green4ema.org',             category: 'As Seen In' },
  { name: 'Global Heroes',                 logo: '/seen-in/global-heroes.png',              website: 'https://globalheroes.com',          category: 'As Seen In' },
  { name: 'Sierra Club',                   logo: '/seen-in/sierra-club.png',                website: 'https://sierraclub.org',            category: 'As Seen In' },
  { name: 'QS Impact',                     logo: '/seen-in/qs-impact.png',                  website: 'https://qs.com',                    category: 'As Seen In' },
  { name: 'UCL',                           logo: '/seen-in/ucl.png',                        website: 'https://ucl.ac.uk',                 category: 'As Seen In' },
  { name: 'Turner Contemporary',           logo: '/seen-in/turner-contemporary.png',        website: 'https://turnercontemporary.org',    category: 'As Seen In' },
  { name: 'Digital Camp',                  logo: '/seen-in/digital-camp.png',               website: 'https://digitalcamp.fr',            category: 'As Seen In' },
  { name: 'Climate Fresk',                 logo: '/seen-in/climate-fresk.png',              website: 'https://climatefresk.org',          category: 'As Seen In' },
]

// ── Migration ─────────────────────────────────────────────────────────────────

async function migratePartners() {
  console.log('\n📋 Creating Partners database…')

  const db = await createDatabase(PARENT_PAGE_ID, 'Partners', {
    Name:        { title: {} },
    Description: { rich_text: {} },
    Logo:        { url: {} },
    Website:     { url: {} },
    Category: {
      select: {
        options: [
          { name: 'Partner',    color: 'green' },
          { name: 'As Seen In', color: 'blue'  },
        ],
      },
    },
    Active: { checkbox: {} },
  })

  console.log('✓ Partners database created')

  let count = 0
  for (const partner of PARTNERS) {
    await createPage(db.id, {
      Name:        { title:     richText(partner.name) },
      Description: { rich_text: richText(partner.description ?? '') },
      Logo:        { url: urlValue(partner.logo) },
      Website:     { url: urlValue(partner.website) },
      Category:    { select: { name: partner.category } },
      Active:      { checkbox: true },
    })
    count++
    console.log(`  ✓ ${partner.name} added`)
    await sleep(334)
  }

  console.log(`\n✓ Partners done — ${count} partners added`)
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🚀 Migrating partners to Notion page ${PARENT_PAGE_ID}`)
  console.log(`   ${PARTNERS.length} partners · Estimated time: ~${Math.ceil(PARTNERS.length * 0.334 / 60)} min`)

  await migratePartners()

  console.log('\n🎉 Migration complete!')
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err.message)
  process.exit(1)
})
