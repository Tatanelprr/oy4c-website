// Authors are sometimes typed in Notion as "Written by: Name" or "Written and
// edited by: Name" (or just the label). Strip that prefix so the site never
// shows it twice or alone.
const WRITTEN_BY = /^\s*written\s+(?:and\s+edited\s+)?by\s*:\s*/i

// Returns the cleaned author name, or '' when nothing is left.
export function normalizeAuthor(value) {
  if (typeof value !== 'string') return ''
  return value.replace(WRITTEN_BY, '').trim()
}
