/**
 * Upload team and ambassador photos to imgbb, then update Notion Photo fields.
 *
 * Usage:
 *   IMGBB_API_KEY=xxx node scripts/upload-photos.js
 *
 * Or rely on .env.local (auto-loaded if present):
 *   node scripts/upload-photos.js
 *
 * Required env vars:
 *   IMGBB_API_KEY
 *   VITE_NOTION_TOKEN
 *   VITE_NOTION_TEAM_DB_ID
 *   VITE_NOTION_AMBASSADORS_DB_ID
 */

import { readdir, readFile } from 'fs/promises'
import { existsSync }        from 'fs'
import { fileURLToPath }     from 'url'
import { dirname, join, extname, basename } from 'path'

// ── Load .env.local if present (no dotenv dependency needed) ─────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath   = join(__dirname, '..', '.env.local')

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

// ── Config ────────────────────────────────────────────────────────────────────

const IMGBB_KEY          = process.env.IMGBB_API_KEY
const NOTION_TOKEN       = process.env.VITE_NOTION_TOKEN
const TEAM_DB_ID         = process.env.VITE_NOTION_TEAM_DB_ID
const AMBASSADORS_DB_ID  = process.env.VITE_NOTION_AMBASSADORS_DB_ID
const NOTION_VERSION     = '2022-06-28'
const SLEEP_MS           = 500
const IMAGE_EXTS = new Set(['.webp', '.jpg', '.jpeg', '.png', '.gif', '.avif'])

const missing = ['IMGBB_API_KEY', 'VITE_NOTION_TOKEN', 'VITE_NOTION_TEAM_DB_ID', 'VITE_NOTION_AMBASSADORS_DB_ID']
  .filter((k) => !process.env[k])
if (missing.length) {
  console.error(`❌ Missing env vars: ${missing.join(', ')}`)
  process.exit(1)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Normalize a name for fuzzy matching:
 * - Strip accents  (Zoé → Zoe, Gonçalves → Goncalves)
 * - Remove parenthetical nicknames  (Jerry (Miaofu) Tian → Jerry  Tian)
 * - Lowercase, collapse whitespace, trim
 */
function normalize(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/-/g, ' ')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
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
  const pages  = []
  let cursor   = undefined
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const resp = await fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method:  'POST',
      headers: notionHeaders(),
      body:    JSON.stringify(body),
    })
    if (!resp.ok) {
      const err = await resp.json()
      throw new Error(`Notion query error ${resp.status}: ${err.message ?? ''}`)
    }
    const data = await resp.json()
    pages.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return pages
}

async function updateNotionPhoto(pageId, url) {
  const resp = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method:  'PATCH',
    headers: notionHeaders(),
    body:    JSON.stringify({ properties: { Photo: { url } } }),
  })
  if (!resp.ok) {
    const err = await resp.json()
    throw new Error(`Notion update error ${resp.status}: ${err.message ?? ''}`)
  }
}

/**
 * Build a lookup map:  normalize(name)  →  { pageId, name, hasPhoto }
 */
function buildLookup(pages) {
  const map = new Map()
  for (const page of pages) {
    const name = page.properties.Name?.title?.[0]?.plain_text ?? ''
    if (!name) continue
    const key = normalize(name)
    map.set(key, {
      pageId:   page.id,
      name,
      hasPhoto: Boolean(page.properties.Photo?.url),
    })
  }
  return map
}

// ── imgbb upload ──────────────────────────────────────────────────────────────

async function uploadToImgbb(filePath) {
  const buf    = await readFile(filePath)
  const base64 = buf.toString('base64')

  const form = new FormData()
  form.append('key',   IMGBB_KEY)
  form.append('image', base64)

  const resp = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body:   form,
  })
  if (!resp.ok) throw new Error(`imgbb HTTP ${resp.status}`)

  const json = await resp.json()
  if (!json.success) throw new Error(`imgbb rejected: ${JSON.stringify(json.error ?? json)}`)

  return json.data.url
}

// ── Process a directory ───────────────────────────────────────────────────────

/**
 * @param {string}   dir        - absolute path to photos directory
 * @param {Map}      lookup     - normalize(name) → { pageId, hasPhoto }
 * @param {Function} toKey      - filename stem → string to normalize for lookup
 */
async function processDir(dir, lookup, toKey) {
  const ext = (f) => f.slice(f.lastIndexOf('.')).toLowerCase()
  const files = (await readdir(dir)).filter((f) => IMAGE_EXTS.has(ext(f))).sort()
  const stats = { ok: 0, skipped: 0, failed: 0 }

  for (const file of files) {
    const filePath = join(dir, file)
    const stem     = basename(file, extname(file))
    const lookupKey = normalize(toKey(stem))

    const entry = lookup.get(lookupKey)
    if (!entry) {
      console.warn(`  ⚠  No Notion match for: ${file}  (key tried: "${lookupKey}")`)
      stats.skipped++
      continue
    }

    if (entry.hasPhoto) {
      console.log(`  ⏭  ${file} — already uploaded, skipping`)
      stats.skipped++
      continue
    }

    try {
      const url = await uploadToImgbb(filePath)
      await updateNotionPhoto(entry.pageId, url)
      console.log(`  ✓  ${file} → ${url}`)
      stats.ok++
    } catch (err) {
      console.error(`  ✗  ${file} — ${err.message}`)
      stats.failed++
    }

    await sleep(SLEEP_MS)
  }

  return stats
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const root            = join(__dirname, '..')
  const teamDir         = join(root, 'public', 'team')
  const ambassadorsDir  = join(root, 'public', 'ambassadors')

  console.log('📥 Fetching Notion records…')
  const [teamPages, ambassadorPages] = await Promise.all([
    fetchAllPages(TEAM_DB_ID),
    fetchAllPages(AMBASSADORS_DB_ID),
  ])
  console.log(`   Team: ${teamPages.length} records  |  Ambassadors: ${ambassadorPages.length} records`)

  const teamLookup        = buildLookup(teamPages)
  const ambassadorsLookup = buildLookup(ambassadorPages)

  // Team files: kebab-case  →  replace hyphens with spaces for matching
  console.log('\n📸 Uploading team photos…')
  const teamStats = await processDir(
    teamDir,
    teamLookup,
    (stem) => stem.replace(/-/g, ' '),
  )

  // Ambassador files: filename IS the display name (may have trailing space)
  console.log('\n📸 Uploading ambassador photos…')
  const ambStats = await processDir(
    ambassadorsDir,
    ambassadorsLookup,
    (stem) => stem,
  )

  console.log('\n✅ Done')
  console.log(`   Team:        ✓ ${teamStats.ok}  ⏭ ${teamStats.skipped}  ✗ ${teamStats.failed}`)
  console.log(`   Ambassadors: ✓ ${ambStats.ok}  ⏭ ${ambStats.skipped}  ✗ ${ambStats.failed}`)

  if (teamStats.failed + ambStats.failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error('\n❌ Fatal:', err.message)
  process.exit(1)
})
