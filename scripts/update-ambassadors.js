// Ambassadors 2026 update from the programme lead's brief:
//   - hide 5 ambassadors from the site (archived, so recoverable from Notion's trash)
//   - replace the Bio of the 7 who stay with the shortened version
//
// Dry run (default, read only): node --env-file=.env.local scripts/update-ambassadors.js
// Apply the changes:            node --env-file=.env.local scripts/update-ambassadors.js --apply

const NOTION_TOKEN      = process.env.VITE_NOTION_TOKEN
const AMBASSADORS_DB_ID = process.env.VITE_NOTION_AMBASSADORS_DB_ID
const NOTION_VERSION    = '2022-06-28'
const APPLY             = process.argv.includes('--apply')

if (!NOTION_TOKEN || !AMBASSADORS_DB_ID) {
  console.error('Error: VITE_NOTION_TOKEN and VITE_NOTION_AMBASSADORS_DB_ID must be set')
  process.exit(1)
}

const TO_REMOVE = ['Chanina', 'Tanatswa', 'Sophie', 'Emmanuel', 'Charlotte']

// Verbatim from the brief, do not edit.
const NEW_BIOS = {
  Noor:    'Through community cleanups, volunteer tutoring, science communication, and sustainable engineering, Noor has been refining her teaching skills and staying involved with climate outreach. Having grown up in Canada and the Middle East, she believes in the power of shifting narratives to inspire collective action.',
  Renee:   'Renee is a climate advocate and firm believer in youth-driven change, studying Bioeconomy Sciences and Technology at the University of British Columbia. As an OY4C Ambassador, she hopes to expand climate education globally through accessible curricula centred on climate justice and mitigation.',
  Buse:    "Buse is a sixth-year medical student and youth group founder in Istanbul, Türkiye. Witnessing how geography and inequality shape people's lives inspired her activism, and she hopes to raise awareness of how environmental damage affects living beings and reflects deeper inequalities.",
  Amy:     "Amy is an environmental science student in Northern Ireland who has been heavily involved in hands-on conservation projects. Through her OY4C ambassadorship, she hopes to create an empowering space for young people, recognising that changing a person's mindset can be just as powerful as changing the world.",
  Subheya: 'Subheya is a political activist and journalist from Libya who believes environmental justice is deeply connected to human rights, particularly for vulnerable communities and women. As an OY4C Ambassador, she hopes to strengthen youth engagement in climate advocacy and amplify local voices from Libya and the region.',
  Musa:    'Musa is a student leader and award-winning climate action advocate passionate about empowering communities with the knowledge and skills to develop effective solutions. Through grassroots climate education, he hopes to help people understand local environmental challenges and expand his impact.',
  Rim:     "Driven by curiosity and a love for learning, Rim is passionate about meaningful initiatives that contribute to society's wellbeing. As an OY4C Ambassador, she hopes to create something meaningful while growing personally and professionally as part of a global community working towards impactful change.",
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function notionHeaders() {
  return {
    Authorization:   `Bearer ${NOTION_TOKEN}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type':  'application/json',
  }
}

const getName  = (page) => page.properties.Name?.title?.map((t) => t.plain_text).join('') ?? ''
const getBio   = (page) => page.properties.Bio?.rich_text?.map((t) => t.plain_text).join('') ?? ''
const sleep    = (ms) => new Promise((r) => setTimeout(r, ms))

// Retries on rate limit (429, honouring Retry-After) and transient 5xx errors.
async function notionFetch(url, options = {}, attempt = 1) {
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

async function queryAllPages() {
  const pages = []
  let cursor
  do {
    const body = { page_size: 100 }
    if (cursor) body.start_cursor = cursor
    const data = await notionFetch(
      `https://api.notion.com/v1/databases/${AMBASSADORS_DB_ID}/query`,
      { method: 'POST', body: JSON.stringify(body) }
    )
    pages.push(...data.results)
    cursor = data.has_more ? data.next_cursor : undefined
  } while (cursor)
  return pages
}

// ── Plan ──────────────────────────────────────────────────────────────────────

const pages = await queryAllPages()

// Match on the first word of the Name (case-insensitive); 0 or 2+ matches → no action.
function match(firstName) {
  const found = pages.filter((p) => getName(p).trim().split(/\s+/)[0].toLowerCase() === firstName.toLowerCase())
  if (found.length !== 1) {
    problems.push(`${firstName}: ${found.length} fiche(s) trouvée(s) (${found.map(getName).join(', ') || 'aucune'}), aucune action proposée`)
    return null
  }
  return found[0]
}

const problems = []
const removals = TO_REMOVE.map((n) => ({ firstName: n, page: match(n) })).filter((r) => r.page)
const bios     = Object.entries(NEW_BIOS).map(([n, bio]) => ({ firstName: n, page: match(n), bio })).filter((r) => r.page)
const planned  = new Set([...removals, ...bios].map((r) => r.page.id))

console.log(APPLY ? '\nMode: APPLY\n' : '\nMode: DRY RUN (nothing will be modified)\n')
console.log(`Base Ambassadors 2026: ${pages.length} fiche(s)\n`)
console.table(pages.map((p) => ({
  Nom:    getName(p),
  Action: removals.some((r) => r.page === p) ? 'RETIRER (archiver)'
        : bios.some((r) => r.page === p)     ? 'nouvelle bio'
        : 'aucune',
})))

console.log('\n(a) Fiches à retirer du site (archivées, récupérables dans la corbeille Notion):')
for (const r of removals) console.log(`  - ${getName(r.page)}`)

console.log('\n(b) Nouvelles bios:')
for (const r of bios) {
  console.log(`\n  ${getName(r.page)}`)
  console.log(`    Actuelle : ${getBio(r.page)}`)
  console.log(`    Nouvelle : ${r.bio}`)
}

const untouched = pages.filter((p) => !planned.has(p.id))
if (untouched.length) console.log(`\nFiches non concernées: ${untouched.map(getName).join(', ')}`)
console.log(problems.length ? `\nÀ signaler:\n  - ${problems.join('\n  - ')}` : '\nAucune correspondance ambiguë.')
console.log(`\n${removals.length} fiche(s) à retirer, ${bios.length} bio(s) à remplacer.`)

if (!APPLY) {
  console.log('\nDry run: aucune modification. Relancez avec --apply pour appliquer.')
  process.exit(0)
}

// ── Apply ─────────────────────────────────────────────────────────────────────

let done = 0
let failed = 0
async function step(label, url, payload) {
  try {
    await notionFetch(url, { method: 'PATCH', body: JSON.stringify(payload) })
    console.log(`  ✓ ${label}`)
    done++
  } catch (err) {
    console.error(`  ✗ ${label}: ${err.message}`)
    failed++
  }
  await sleep(350) // stay under Notion's ~3 requests/second average
}

console.log('')
for (const r of removals) {
  await step(`${getName(r.page)}: archivée`, `https://api.notion.com/v1/pages/${r.page.id}`, { archived: true })
}
for (const r of bios) {
  // Only Bio is sent, so Name, Photo, Country and LinkedIn stay untouched.
  await step(`${getName(r.page)}: bio remplacée`, `https://api.notion.com/v1/pages/${r.page.id}`, {
    properties: { Bio: { rich_text: [{ type: 'text', text: { content: r.bio } }] } },
  })
}

console.log(`\nTerminé: ${done} réussie(s), ${failed} en échec.`)
process.exitCode = failed ? 1 : 0
