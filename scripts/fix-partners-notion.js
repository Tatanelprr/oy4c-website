// Fix Partners Notion DB:
//   - Rename "Digital Campus" → "Digital Camp"
//   - Archive "Arts Council England"
//
// Run with: node --env-file=.env.local scripts/fix-partners-notion.js

const NOTION_TOKEN   = process.env.VITE_NOTION_TOKEN
const PARTNERS_DB_ID = process.env.VITE_NOTION_PARTNERS_DB_ID
const NOTION_VERSION = '2022-06-28'

if (!NOTION_TOKEN || !PARTNERS_DB_ID) {
  console.error('Error: VITE_NOTION_TOKEN and VITE_NOTION_PARTNERS_DB_ID must be set')
  process.exit(1)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function notionHeaders() {
  return {
    Authorization:   `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type':  'application/json',
  }
}

const getTitle = (page) => page.properties?.Name?.title?.[0]?.plain_text ?? ''
const sleep    = (ms) => new Promise((r) => setTimeout(r, ms))

// ── Notion API ────────────────────────────────────────────────────────────────

async function queryAllPages() {
  const pages = []
  let cursor = undefined
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const res = await fetch(
      `https://api.notion.com/v1/databases/${PARTNERS_DB_ID}/query`,
      { method: 'POST', headers: notionHeaders(), body: JSON.stringify(body) }
    )
    if (!res.ok) {
      const err = await res.json()
      throw new Error(`Query failed: ${err.message ?? res.status}`)
    }
    const data = await res.json()
    pages.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return pages
}

async function updatePage(pageId, payload) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: notionHeaders(),
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(`Update failed: ${err.message ?? res.status}`)
  }
  return res.json()
}

async function renamePage(pageId, newName) {
  return updatePage(pageId, {
    properties: {
      Name: { title: [{ type: 'text', text: { content: newName } }] },
    },
  })
}

async function archivePage(pageId) {
  return updatePage(pageId, { archived: true })
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Fetching Partners database entries…')
  const pages = await queryAllPages()
  console.log(`   ${pages.length} entries found`)

  const digitalCampus = pages.find((p) => getTitle(p) === 'Digital Campus')
  const artsCouncil   = pages.find((p) => getTitle(p) === 'Arts Council England')

  // 1. Rename Digital Campus → Digital Camp
  if (digitalCampus) {
    await renamePage(digitalCampus.id, 'Digital Camp')
    console.log('  ✓ Renamed "Digital Campus" → "Digital Camp"')
    await sleep(334)
  } else {
    console.log('  – "Digital Campus" not found (already renamed?)')
  }

  // 2. Archive Arts Council England
  if (artsCouncil) {
    await archivePage(artsCouncil.id)
    console.log('  ✓ Archived "Arts Council England"')
  } else {
    console.log('  – "Arts Council England" not found (already removed?)')
  }

  console.log('\n🎉 Partners cleanup complete!')
}

main().catch((err) => {
  console.error('\n❌ Fix failed:', err.message)
  process.exit(1)
})
