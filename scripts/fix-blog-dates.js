// Fix Blog & Articles dates mistakenly set in 2027 or later: same day and month, year 2026.
//
// Dry run (default, read only): node --env-file=.env.local scripts/fix-blog-dates.js
// Apply the changes:            node --env-file=.env.local scripts/fix-blog-dates.js --apply

import assert from 'node:assert/strict'

const NOTION_TOKEN   = process.env.NOTION_TOKEN
const DATABASE_ID    = process.env.NOTION_DATABASE_ID
const NOTION_VERSION = '2022-06-28'
const APPLY          = process.argv.includes('--apply')
const TARGET_YEAR    = 2026

if (!NOTION_TOKEN || !DATABASE_ID) {
  console.error('Error: NOTION_TOKEN and NOTION_DATABASE_ID must be set')
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

const getTitle = (page) => {
  const p = page.properties
  return (p.Title ?? p.Name)?.title?.map((t) => t.plain_text).join('') || 'Untitled'
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// "2027-03-14" or "2027-03-14T10:00:00.000+01:00" → same string with year 2026.
// Returns null when that day does not exist in 2026 (29 February).
function toTargetYear(iso) {
  if (!iso || Number(iso.slice(0, 4)) <= TARGET_YEAR) return iso
  const shifted = `${TARGET_YEAR}${iso.slice(4)}`
  const [y, m, d] = shifted.slice(0, 10).split('-').map(Number)
  const check = new Date(Date.UTC(y, m - 1, d))
  return check.getUTCMonth() === m - 1 && check.getUTCDate() === d ? shifted : null
}

assert.equal(toTargetYear('2027-03-14'), '2026-03-14')
assert.equal(toTargetYear('2027-03-14T10:00:00.000+01:00'), '2026-03-14T10:00:00.000+01:00')
assert.equal(toTargetYear('2026-12-31'), '2026-12-31')
assert.equal(toTargetYear('2028-02-29'), null)
assert.equal(toTargetYear(null), null)

// ── Notion API ────────────────────────────────────────────────────────────────

// Retries on rate limit (429, honouring Retry-After) and transient 5xx errors.
async function notionFetch(url, options, attempt = 1) {
  const res = await fetch(url, { ...options, headers: notionHeaders() })
  if ((res.status === 429 || res.status >= 500) && attempt <= 5) {
    const wait = Number(res.headers.get('retry-after')) * 1000 || 1000 * 2 ** attempt
    console.warn(`  Notion ${res.status}, retrying in ${wait / 1000}s (attempt ${attempt}/5)`)
    await sleep(wait)
    return notionFetch(url, options, attempt + 1)
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Notion ${res.status}: ${err.message ?? res.statusText}`)
  }
  return res.json()
}

async function queryFutureArticles() {
  const pages = []
  let cursor
  do {
    const body = {
      page_size: 100,
      filter: { property: 'Date', date: { after: `${TARGET_YEAR}-12-31` } },
      sorts:  [{ property: 'Date', direction: 'ascending' }],
    }
    if (cursor) body.start_cursor = cursor
    const data = await notionFetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      { method: 'POST', body: JSON.stringify(body) }
    )
    pages.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return pages
}

// ── Main ──────────────────────────────────────────────────────────────────────

const pages = await queryFutureArticles()

const rows = pages.map((page) => {
  const date = page.properties.Date.date
  const start = toTargetYear(date.start)
  const end   = toTargetYear(date.end)
  return {
    page,
    title:    getTitle(page),
    current:  date.end ? `${date.start} → ${date.end}` : date.start,
    proposed: start && (end || !date.end) ? (date.end ? `${start} → ${end}` : start) : null,
    newDate:  { start, end, time_zone: date.time_zone },
  }
})

console.log(APPLY ? '\nMode: APPLY\n' : '\nMode: DRY RUN (nothing will be modified)\n')
console.table(rows.map((r) => ({
  Titre:            r.title,
  'Date actuelle':  r.current,
  'Date proposée':  r.proposed ?? 'IGNORÉ (date invalide en 2026)',
})))
const valid = rows.filter((r) => r.proposed)
console.log(`\n${rows.length} article(s) concerné(s), ${valid.length} modifiable(s).`)

if (!APPLY) {
  console.log('\nDry run: aucune modification. Relancez avec --apply pour appliquer.')
  process.exit(0)
}

let updated = 0
let failed  = 0
for (const r of valid) {
  try {
    // Only the Date property is sent, so every other field stays untouched.
    await notionFetch(`https://api.notion.com/v1/pages/${r.page.id}`, {
      method: 'PATCH',
      body:   JSON.stringify({ properties: { Date: { date: r.newDate } } }),
    })
    console.log(`  ✓ ${r.title}: ${r.current} → ${r.proposed}`)
    updated++
  } catch (err) {
    console.error(`  ✗ ${r.title}: ${err.message}`)
    failed++
  }
  await sleep(350) // stay under Notion's ~3 requests/second average
}

console.log(`\nTerminé: ${updated} mis à jour, ${failed} en échec, ${rows.length - valid.length} ignoré(s).`)
process.exitCode = failed ? 1 : 0
