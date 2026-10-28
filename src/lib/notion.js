export async function fetchBlogPosts() {
  const res = await fetch('/api/blog-posts')
  if (!res.ok) throw new Error(`Failed to fetch posts (${res.status})`)
  return res.json()
}

export async function fetchBlogPost(id) {
  const res = await fetch(`/api/blog-post?id=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error(`Failed to fetch post (${res.status})`)
  return res.json()
}

// Proxied image resized by /api/img (w: 400, 800 or 1200); other sources unchanged.
export const imgAtWidth = (src, w) => (src?.startsWith('/api/img?') ? `${src}&w=${w}` : src)

// srcset for a proxied image at the given widths; undefined for other sources.
export const imgSrcSet = (src, widths) =>
  src?.startsWith('/api/img?') ? widths.map((w) => `${imgAtWidth(src, w)} ${w}w`).join(', ') : undefined

// Notion dates as "12 March 2026"; '' when missing or unparseable.
export function formatPostDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
