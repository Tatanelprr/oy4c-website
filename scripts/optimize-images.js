import sharp from 'sharp'
import { readFile, writeFile, stat } from 'fs/promises'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// file → max width (px)
const TARGETS = [
  { file: 'public/hero/hero-1.jpg', width: 1920 },
  { file: 'public/hero/hero-2.jpg', width: 1920 },
  { file: 'public/hero/hero-3.jpg', width: 1920 },
  { file: 'public/hero/hero-4.jpg', width: 1920 },
  { file: 'public/paths/path-educator.jpg', width: 800 },
  { file: 'public/paths/path-funder.jpg', width: 800 },
  { file: 'public/paths/path-young-person.jpg', width: 800 },
]

const QUALITY = 80

const kb = (bytes) => (bytes / 1024).toFixed(1) + ' KB'

async function optimize({ file, width }) {
  const path = join(root, file)

  if (!existsSync(path)) {
    console.warn(`⚠️  skipped (not found): ${file}`)
    return
  }

  const before = (await stat(path)).size

  // Read into a buffer first, so we can safely overwrite the same file.
  const input = await readFile(path)
  const output = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality: QUALITY })
    .toBuffer()

  await writeFile(path, output)

  const after = output.length
  const saved = (100 * (1 - after / before)).toFixed(0)
  console.log(`✓ ${file}\n    ${kb(before)} → ${kb(after)}  (-${saved}%, max ${width}px, q${QUALITY})`)
}

for (const target of TARGETS) {
  await optimize(target)
}
