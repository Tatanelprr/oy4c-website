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
