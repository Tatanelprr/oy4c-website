// Converts the photos in public/ heavier than 200 kB to WebP quality 80
// (metadata dropped, never enlarged) and moves each original out of the
// repository, to ../photos-originaux (same sub-path), so it can be run again:
//   - public/team/<name>.*  ->  <name>-400.webp and <name>-800.webp (400 / 800 px wide)
//   - any other photo       ->  <name>.webp, 1600 px wide at most
// A photo whose original is already in ../photos-originaux is skipped (never
// overwritten), as is one whose WebP would not be at least 10% smaller
// (already-compressed WebP: re-encoding would only lose quality).
// References to renamed files (team photos) must then be updated by hand.
//
// Dry run (default, writes nothing): node scripts/optimize-images.js
// Convert and move the originals:    node scripts/optimize-images.js --apply

import sharp from 'sharp'
import { readFile, writeFile, rename, mkdir, readdir, stat, copyFile, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, relative, extname, basename } from 'path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(root, 'public')
const ORIGINALS = join(root, '..', 'photos-originaux')
const APPLY = process.argv.includes('--apply')
const MIN_BYTES = 200 * 1024
const QUALITY = 80
const PHOTO = /\.(jpe?g|png|webp)$/i
const MIN_SAVING = 0.1

const kb = (bytes) => `${Math.round(bytes / 1024)} kB`

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(path)
    else yield path
  }
}

// Renames work within a drive only; fall back to copy + delete.
async function move(from, to) {
  await mkdir(dirname(to), { recursive: true })
  try {
    await rename(from, to)
  } catch {
    await copyFile(from, to)
    await unlink(from)
  }
}

const encode = (input, width) =>
  sharp(input, { limitInputPixels: 50e6 })
    .rotate() // applies the EXIF orientation; metadata is then dropped
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toBuffer({ resolveWithObject: true })

console.log(APPLY ? 'APPLY' : 'DRY RUN (nothing written)')
for await (const path of walk(PUBLIC)) {
  if (!PHOTO.test(path) || /-(400|800)\.webp$/.test(path)) continue // skip our own outputs
  const before = (await stat(path)).size
  if (before <= MIN_BYTES) continue
  const rel = relative(PUBLIC, path)
  const original = join(ORIGINALS, rel)
  if (existsSync(original)) { console.log(`- ${rel}: original already in photos-originaux, skipped`); continue }

  const input = await readFile(path)
  const { width, height } = await sharp(input).metadata()
  const stem = join(dirname(path), basename(path, extname(path)))
  const outputs = rel.startsWith(`team${rel.includes('\\') ? '\\' : '/'}`)
    ? [[`${stem}-400.webp`, 400], [`${stem}-800.webp`, 800]]
    : [[`${stem}.webp`, 1600]]

  const results = []
  for (const [out, w] of outputs) results.push([out, await encode(input, w)])
  const largest = Math.max(...results.map(([, r]) => r.data.length))
  if (largest > before * (1 - MIN_SAVING)) { console.log(`- ${rel}: WebP only ${kb(largest)} (under 10% saved), kept`); continue }

  console.log(`- ${rel} ${width}x${height} ${kb(before)}`)
  for (const [out, r] of results) console.log(`    -> ${relative(PUBLIC, out)} ${r.info.width}x${r.info.height} ${kb(r.data.length)}`)
  if (!APPLY) continue
  await move(path, original)
  for (const [out, r] of results) await writeFile(out, r.data)
}
