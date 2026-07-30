export async function fetchBlogPosts() {
  const res = await fetch('/api/blog-posts')
  if (!res.ok) throw new Error(`Failed to fetch posts (${res.status})`)
  return res.json()
}
