// Local copies of the ambassador photos, used by the Ambassador page when the
// Notion photo (hosted on i.ibb.co, which is sometimes down) fails to load.
//
// For every ambassador the site shows (the Notion "Ambassadors 2026" database,
// archived pages excluded, as in /api/ambassadors), takes the original photo
// from public/ambassadors/ when there is one (file named after the ambassador,
// e.g. "Noor Alabed.png"; the originals now live outside the repository, in
// ../photos-ambassadeurs-originaux: copy one back here to use it), otherwise
// downloads the Notion photo with the image
// proxy's own checks (host allowlist, https, redirects re-checked). Either way:
// raster types only so no SVG, 4 MB limit. Converts it to WebP quality 80
// without metadata, 400 and 800 px wide, never enlarged:
//   public/ambassadors/<first-name>-400.webp and <first-name>-800.webp
// --apply also rewrites src/data/ambassadorPhotos.js, the list the page reads.
//
// Dry run (default, writes nothing): node scripts/import-ambassador-photos.js
// Write the files:                   node scripts/import-ambassador-photos.js --apply
//
// The Notion token is read from .env.local and never printed.

import sharp from 'sharp'
import { readFileSync, readdirSync, existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { loadImage } from '../api/img.js'
import { parseAllowedImageUrl } from '../api/_lib/img.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const APPLY = process.argv.includes('--apply')
const WIDTHS = [400, 800]
const QUALITY = 80
const NOTION_VERSION = '2022-06-28'
const PHOTO_DIR = join(root, 'public/ambassadors')
const MAX_BYTES = 4 * 1024 * 1024 // same limit as the image proxy
const RASTER = new Set(['jpeg', 'png', 'webp', 'gif', 'avif']) // sharp formats; no SVG

// Same parsing as vite.config.js; values already in the environment win.
function loadEnvFile(path) {
  if (!existsSync(path)) return
  for (const line of readFileSync(path, 'utf-8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    if (key && !(key in process.env)) process.env[key] = trimmed.slice(eq + 1).trim()
  }
}
loadEnvFile(join(root, '.env.local'))

const NOTION_TOKEN = process.env.NOTION_TOKEN
const AMBASSADORS_DB_ID = process.env.NOTION_AMBASSADORS_DB_ID
if (!NOTION_TOKEN || !AMBASSADORS_DB_ID) {
  console.error('Error: NOTION_TOKEN and NOTION_AMBASSADORS_DB_ID must be set in .env.local')
  process.exit(1)
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

// "Noor Alabed" -> "noor"; "Renée" -> "renee".
const slugOf = (name) =>
  name.trim().split(/\s+/)[0].normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-')

async function fetchAmbassadors() {
  const resp = await fetch(`https://api.notion.com/v1/databases/${AMBASSADORS_DB_ID}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${NOTION_TOKEN}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 100 }),
  })
  if (!resp.ok) throw new Error(`Notion ${resp.status}`)
  const { results } = await resp.json()
  return results.map((page) => ({
    name: page.properties.Name?.title?.map((t) => t.plain_text).join('').trim() ?? '',
    photo: page.properties.Photo?.url ?? null,
  }))
}

// Lowercase, no accents, single spaces: "Musa Muhammad Musa " -> "musa muhammad musa".
const norm = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()

// Original photos in public/ambassadors/ (not the generated -400/-800 copies).
const ORIGINALS = existsSync(PHOTO_DIR)
  ? readdirSync(PHOTO_DIR).filter((f) => /\.(jpe?g|png|webp|gif|avif)$/i.test(f) && !/-(400|800)\.webp$/.test(f))
  : []
const stem = (file) => norm(file.replace(/\.[^.]+$/, ''))

// The original whose name is the ambassador's full name, else the only one
// starting with the same first name. { ambiguous } when several match.
function findOriginal(name) {
  const full = ORIGINALS.filter((f) => stem(f) === norm(name))
  if (full.length === 1) return { file: full[0] }
  const first = norm(name).split(' ')[0]
  const byFirst = ORIGINALS.filter((f) => stem(f).split(' ')[0] === first)
  if (full.length > 1 || byFirst.length > 1) return { ambiguous: [...full, ...byFirst] }
  return byFirst.length ? { file: byFirst[0], byFirstName: true } : {}
}

async function readOriginal(file) {
  const body = readFileSync(join(PHOTO_DIR, file))
  if (body.length > MAX_BYTES) throw new Error(`${file} is over 4 MB`)
  const { format } = await sharp(body).metadata()
  if (!RASTER.has(format)) throw new Error(`${file} is not an allowed image type: ${format}`)
  return { type: `local ${file} (${format})`, body }
}

// i.ibb.co sheds bursts with 503s or stalls: several spaced attempts.
const ATTEMPTS = 6
async function download(url) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await loadImage(url)
    } catch (err) {
      const transient = err.name === 'AbortError' || err.status >= 500
      if (!transient || attempt === ATTEMPTS) throw err
      await sleep(2000 * attempt)
    }
  }
}

const ambassadors = await fetchAmbassadors()
const manifest = {}
const seen = new Map()
let failed = 0
console.log(`${APPLY ? 'APPLY' : 'DRY RUN (nothing written)'}: ${ambassadors.length} ambassadors\n`)

for (const { name, photo } of ambassadors) {
  const slug = slugOf(name)
  if (!slug) { console.log(`- (no name): skipped`); continue }
  if (seen.has(slug)) throw new Error(`"${name}" and "${seen.get(slug)}" would share the file name ${slug}`)
  seen.set(slug, name)

  const original = findOriginal(name)
  if (original.ambiguous) console.log(`- ${name}: AMBIGUOUS local originals (${original.ambiguous.join(', ')}), using Notion`)
  if (original.byFirstName) console.log(`- ${name}: local original matched by first name only: ${original.file}`)
  const url = parseAllowedImageUrl(photo)
  if (!original.file && !url) { console.log(`- ${name}: no local original and no photo on an allowed host, skipped`); continue }

  try {
    const { type, body } = original.file ? await readOriginal(original.file) : await download(url)
    const outputs = []
    for (const width of WIDTHS) {
      // rotate() applies the EXIF orientation; sharp drops all metadata unless asked to keep it.
      const webp = await sharp(body, { limitInputPixels: 50e6 })
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toBuffer({ resolveWithObject: true })
      const file = `public/ambassadors/${slug}-${width}.webp`
      outputs.push(`${file} ${webp.info.width}x${webp.info.height} ${kb(webp.data.length)}`)
      if (APPLY) await writeFile(join(root, file), webp.data)
    }
    manifest[name] = slug
    console.log(`- ${name}: ${type} ${kb(body.length)}\n    ${outputs.join('\n    ')}`)
  } catch (err) {
    failed++
    console.log(`- ${name}: FAILED (${err.name === 'AbortError' ? 'timeout' : err.message})`)
    // keep copies written by an earlier run in the list
    if (WIDTHS.every((w) => existsSync(join(PHOTO_DIR, `${slug}-${w}.webp`)))) manifest[name] = slug
  }
}

if (APPLY) {
  const entries = Object.entries(manifest).map(([n, s]) => `  ${JSON.stringify(n)}: ${JSON.stringify(s)},`).join('\n')
  await writeFile(
    join(root, 'src/data/ambassadorPhotos.js'),
    `// Written by scripts/import-ambassador-photos.js --apply, do not edit by hand.
// Notion name -> file prefix of its local copies in public/ambassadors/
// (<prefix>-400.webp and <prefix>-800.webp).
export const AMBASSADOR_PHOTOS = {${entries ? `\n${entries}\n` : ''}}
`,
  )
}
console.log(`\n${Object.keys(manifest).length} photos ${APPLY ? 'written' : 'ready'}, ${failed} failed.`)
if (failed) process.exitCode = 1
