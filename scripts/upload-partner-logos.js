/**
 * Upload partner logos to imgbb, then update the Logo field in Notion Partners DB.
 *
 * Usage:
 *   $env:IMGBB_API_KEY="your_key"; node scripts/upload-partner-logos.js
 *
 * Or rely on .env.local (auto-loaded if present):
 *   node scripts/upload-partner-logos.js
 *
 * Required env vars:
 *   IMGBB_API_KEY
 *   VITE_NOTION_TOKEN
 *   VITE_NOTION_PARTNERS_DB_ID
 */

import { readFile }  from 'fs/promises'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// ── Load .env.local if present ─────────────────────────────────────────────────

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

const IMGBB_KEY      = process.env.IMGBB_API_KEY
const NOTION_TOKEN   = process.env.VITE_NOTION_TOKEN
const PARTNERS_DB_ID = process.env.VITE_NOTION_PARTNERS_DB_ID
const NOTION_VERSION = '2022-06-28'
const SLEEP_MS       = 500
// Tried in this order for each candidate filename
const LOGO_EXTS      = ['.png', '.webp', '.jpg', '.jpeg', '.avif', '.svg']

const missing = ['IMGBB_API_KEY', 'VITE_NOTION_TOKEN', 'VITE_NOTION_PARTNERS_DB_ID']
  .filter((k) => !process.env[k])
if (missing.length) {
  console.error(`❌ Missing env vars: ${missing.join(', ')}`)
  process.exit(1)
}

// ── Name → filename aliases ───────────────────────────────────────────────────
// For names that don't map cleanly to their kebab-case filename.

const FILENAME_ALIASES = {
  'dosomething org':               'dosomething',
  'environmental media association':'ema',
  'qs impact':                     'qs',
  'energy for refugees amsterdam': 'energy-for-refugees',
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function normalize(str) {
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\(.*?\)/g, '')
    .replace(/[.\-_]/g, ' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function toKebab(str) {
  return normalize(str).replace(/\s+/g, '-')
}

// ── Notion API ────────────────────────────────────────────────────────────────

function notionHeaders() {
  return {
    Authorization:    `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type':   'application/json',
  }
}

async function fetchAllPartners() {
  const pages  = []
  let cursor   = undefined
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const resp = await fetch(`https://api.notion.com/v1/databases/${PARTNERS_DB_ID}/query`, {
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

async function updateNotionLogo(pageId, url) {
  const resp = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method:  'PATCH',
    headers: notionHeaders(),
    body:    JSON.stringify({ properties: { Logo: { url } } }),
  })
  if (!resp.ok) {
    const err = await resp.json()
    throw new Error(`Notion update error ${resp.status}: ${err.message ?? ''}`)
  }
}

// ── imgbb upload ──────────────────────────────────────────────────────────────

async function uploadToImgbb(filePath) {
  const buf    = await readFile(filePath)
  const base64 = buf.toString('base64')

  const form = new FormData()
  form.append('key',   IMGBB_KEY)
  form.append('image', base64)

  const resp = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body: form })
  if (!resp.ok) throw new Error(`imgbb HTTP ${resp.status}`)

  const json = await resp.json()
  if (!json.success) throw new Error(`imgbb rejected: ${JSON.stringify(json.error ?? json)}`)

  return json.data.url
}

// ── File resolution ───────────────────────────────────────────────────────────

function findLogoFile(name, root) {
  const key       = normalize(name)
  const candidates = [
    FILENAME_ALIASES[key],    // alias first
    toKebab(name),            // then full kebab
  ].filter(Boolean)

  const dirs = [
    join(root, 'public', 'partners'),
    join(root, 'public', 'seen-in'),
  ]

  for (const stem of candidates) {
    for (const dir of dirs) {
      for (const ext of LOGO_EXTS) {
        const filePath = join(dir, stem + ext)
        if (existsSync(filePath)) return filePath
      }
    }
  }
  return null
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const root = join(__dirname, '..')

  console.log('📥 Fetching Partners from Notion…')
  const pages = await fetchAllPartners()
  console.log(`   ${pages.length} partners found\n`)

  let ok = 0, skipped = 0, failed = 0

  for (const page of pages) {
    const name    = page.properties.Name?.title?.[0]?.plain_text ?? ''
    const hasLogo = Boolean(page.properties.Logo?.url)

    if (!name) { skipped++; continue }

    if (hasLogo) {
      console.log(`  ⏭  ${name} — logo already set, skipping`)
      skipped++
      continue
    }

    const filePath = findLogoFile(name, root)
    if (!filePath) {
      console.warn(`  ⚠  ${name} — no local file found (tried: ${toKebab(name)}.*)`)
      skipped++
      continue
    }

    try {
      const url = await uploadToImgbb(filePath)
      await updateNotionLogo(page.id, url)
      console.log(`  ✓  ${name} → ${url}`)
      ok++
    } catch (err) {
      console.error(`  ✗  ${name} — ${err.message}`)
      failed++
    }

    await sleep(SLEEP_MS)
  }

  console.log(`\n✅ Done — ✓ ${ok}  ⏭ ${skipped}  ✗ ${failed}`)
  if (failed > 0) process.exit(1)
}

main().catch((err) => {
  console.error('\n❌ Fatal:', err.message)
  process.exit(1)
})
