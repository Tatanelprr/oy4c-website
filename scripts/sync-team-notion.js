/**
 * Sync the Team roster (src/data/team.json) into the Notion Team database.
 *
 * The roster in team.json is the source of truth. For every member:
 *   - fuzzy-match by name against existing Notion pages (same normalize() as upload-photos.js)
 *   - if found  → update Role, Pronouns, Team, LinkedIn, Section (Quote & Photo are left untouched)
 *   - if absent → create a new page
 * Notion pages that are NOT in the roster are flagged for manual review (they are
 * never deleted). Pass --archive to move them to Notion's trash (recoverable).
 *
 * Usage:
 *   node scripts/sync-team-notion.js            # apply updates/creates, list orphans
 *   node scripts/sync-team-notion.js --dry-run  # preview only, no writes
 *   node scripts/sync-team-notion.js --archive  # also archive orphaned pages (trash)
 *
 * Required env vars (auto-loaded from .env.local if present):
 *   VITE_NOTION_TOKEN
 *   VITE_NOTION_TEAM_DB_ID
 */

import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load .env.local if present (no dotenv dependency needed) ─────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const root      = join(__dirname, '..')
const envPath   = join(root, '.env.local')

if (existsSync(envPath)) {
  const raw = await readFile(envPath, 'utf-8')
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const val = trimmed.slice(eq + 1).trim()
    if (key && !(key in process.env)) process.env[key] = val
  }
}

// ── Config ──────────────────────────────────────────────────────────────────

const NOTION_TOKEN   = process.env.VITE_NOTION_TOKEN
const TEAM_DB_ID     = process.env.VITE_NOTION_TEAM_DB_ID
const NOTION_VERSION = '2022-06-28'
const SLEEP_MS       = 334 // stay within Notion's ~3 req/s limit

const DRY_RUN = process.argv.includes('--dry-run')
const ARCHIVE = process.argv.includes('--archive')

// team.json grouping key → Notion "Section" select option
const SECTION_MAP = {
  seniorLeadership: 'Senior Leadership',
  operations:       'Operations',
  peopleAndCulture: 'People & Culture',
  executiveTeam:    'Executive Team',
  functions:        'Functions',
}

const missing = ['VITE_NOTION_TOKEN', 'VITE_NOTION_TEAM_DB_ID'].filter((k) => !process.env[k])
if (missing.length) {
  console.error(`❌ Missing env vars: ${missing.join(', ')}`)
  process.exit(1)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Normalize a name for fuzzy matching (identical rules to upload-photos.js):
 * strip accents, drop parenthetical nicknames, hyphens→spaces, lowercase, collapse.
 */
function normalize(str) {
  return String(str)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/-/g, ' ')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function richText(value) {
  if (!value) return []
  return [{ type: 'text', text: { content: String(value).slice(0, 2000) } }]
}

function urlValue(value) {
  if (!value) return null
  return String(value).startsWith('http') ? value : null
}

// ── Notion API ────────────────────────────────────────────────────────────────

function notionHeaders() {
  return {
    Authorization:    `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type':   'application/json',
  }
}

async function fetchAllPages(dbId) {
  const pages = []
  let cursor  = undefined
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const resp = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method:  'POST',
      headers: notionHeaders(),
      body:    JSON.stringify(body),
    })
    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}))
      throw new Error(`Notion query error ${resp.status}: ${err.message ?? ''}`)
    }
    const data = await resp.json()
    pages.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return pages
}

async function createPage(properties) {
  const resp = await fetch('https://api.notion.com/v1/pages', {
    method:  'POST',
    headers: notionHeaders(),
    body:    JSON.stringify({ parent: { database_id: TEAM_DB_ID }, properties }),
  })
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}))
    throw new Error(`create error ${resp.status}: ${err.message ?? ''}`)
  }
}

async function patchPage(pageId, payload) {
  const resp = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method:  'PATCH',
    headers: notionHeaders(),
    body:    JSON.stringify(payload),
  })
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}))
    throw new Error(`update error ${resp.status}: ${err.message ?? ''}`)
  }
}

// ── Read current values off a Notion page ───────────────────────────────────────

function readPage(page) {
  const p = page.properties
  return {
    pageId:   page.id,
    name:     p.Name?.title?.[0]?.plain_text ?? '',
    role:     p.Role?.rich_text?.[0]?.plain_text ?? '',
    pronouns: p.Pronouns?.rich_text?.[0]?.plain_text ?? '',
    team:     p.Team?.select?.name ?? '',
    linkedin: p.LinkedIn?.url ?? '',
    section:  p.Section?.select?.name ?? '',
  }
}

/** The five fields we sync differ between roster member and existing page? */
function needsUpdate(current, member, section) {
  return (
    current.role     !== (member.role     ?? '') ||
    current.pronouns !== (member.pronouns ?? '') ||
    current.team     !== (member.team     ?? '') ||
    (current.linkedin || '') !== (urlValue(member.linkedin) || '') ||
    current.section  !== section
  )
}

/** Property payload for the five synced fields (used for both create and update). */
function syncedProps(member, section) {
  return {
    Role:     { rich_text: richText(member.role) },
    Pronouns: { rich_text: richText(member.pronouns) },
    Team:     { select: member.team ? { name: member.team } : null },
    LinkedIn: { url: urlValue(member.linkedin) },
    Section:  { select: { name: section } },
  }
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`🔧 Team ↔ Notion sync${DRY_RUN ? '  (dry-run — no writes)' : ''}`)

  // 1. Load roster
  const rosterRaw = JSON.parse(await readFile(join(root, 'src', 'data', 'team.json'), 'utf-8'))
  const roster = []
  for (const [key, members] of Object.entries(rosterRaw)) {
    const section = SECTION_MAP[key]
    if (!section) {
      console.warn(`  ⚠  Unknown section key "${key}" in team.json — skipping ${members.length} member(s)`)
      continue
    }
    for (const m of members) roster.push({ ...m, section })
  }
  console.log(`   Roster: ${roster.length} members across ${Object.keys(rosterRaw).length} sections`)

  // 2. Fetch current Notion state
  console.log('📥 Fetching Notion records…')
  const pages = await fetchAllPages(TEAM_DB_ID)
  console.log(`   Notion: ${pages.length} existing records`)

  const lookup = new Map() // normalize(name) → readPage()
  for (const page of pages) {
    const rec = readPage(page)
    if (rec.name) lookup.set(normalize(rec.name), rec)
  }

  const matchedIds = new Set()
  const stats = { updated: 0, created: 0, unchanged: 0, failed: 0 }

  // 3. Reconcile roster → Notion
  console.log('\n🔄 Reconciling members…')
  for (const member of roster) {
    const key   = normalize(member.name)
    const entry = lookup.get(key)

    if (entry) {
      matchedIds.add(entry.pageId)
      if (!needsUpdate(entry, member, member.section)) {
        stats.unchanged++
        continue
      }
      try {
        if (!DRY_RUN) await patchPage(entry.pageId, { properties: syncedProps(member, member.section) })
        console.log(`  ✏️  updated  ${member.name}  [${member.section}]`)
        stats.updated++
        if (!DRY_RUN) await sleep(SLEEP_MS)
      } catch (err) {
        console.error(`  ✗  update failed  ${member.name} — ${err.message}`)
        stats.failed++
      }
    } else {
      try {
        const props = {
          Name:  { title: richText(member.name) },
          ...syncedProps(member, member.section),
        }
        // On create we also seed Quote/Photo if the roster carries them.
        if (member.quote) props.Quote = { rich_text: richText(member.quote) }
        if (urlValue(member.photo)) props.Photo = { url: urlValue(member.photo) }
        if (!DRY_RUN) await createPage(props)
        console.log(`  ➕  created  ${member.name}  [${member.section}]`)
        stats.created++
        if (!DRY_RUN) await sleep(SLEEP_MS)
      } catch (err) {
        console.error(`  ✗  create failed  ${member.name} — ${err.message}`)
        stats.failed++
      }
    }
  }

  // 4. Orphans: in Notion but not in roster
  const orphans = pages.map(readPage).filter((rec) => !matchedIds.has(rec.pageId))
  if (orphans.length) {
    console.log(`\n🗂  ${orphans.length} record(s) in Notion but NOT in the roster:`)
    for (const o of orphans) {
      if (ARCHIVE && !DRY_RUN) {
        try {
          await patchPage(o.pageId, { archived: true })
          console.log(`  🗑  archived  ${o.name}  (moved to Notion trash — recoverable)`)
          await sleep(SLEEP_MS)
        } catch (err) {
          console.error(`  ✗  archive failed  ${o.name} — ${err.message}`)
          stats.failed++
        }
      } else {
        console.log(`  •  ${o.name}${o.role ? `  (${o.role})` : ''}  — review manually`)
      }
    }
  }

  // 5. Summary
  console.log('\n📊 Summary')
  console.log(`   ✏️  Updated:            ${stats.updated}`)
  console.log(`   ➕  Created:            ${stats.created}`)
  console.log(`   ✅ Unchanged:          ${stats.unchanged}`)
  console.log(`   🗂  To review (orphans): ${orphans.length}${ARCHIVE && !DRY_RUN ? ' (archived)' : ''}`)
  if (stats.failed) console.log(`   ✗  Failed:             ${stats.failed}`)
  if (DRY_RUN) console.log('\n   (dry-run — nothing was written to Notion)')

  if (stats.failed) process.exit(1)
}

main().catch((err) => {
  console.error('\n❌ Fatal:', err.message)
  process.exit(1)
})
