import { useLayoutEffect } from 'react'
import { HOME_META, SITE_URL } from '../data/pageMeta'

// Sets document.title, the meta description, the canonical link and (for the
// 404) a noindex robots tag; restores the home defaults from index.html when
// the page unmounts. Layout effect: applied before the browser paints, so
// client-side navigation never shows the previous page's title.
function apply({ title, description, path, noindex }) {
  document.title = title

  document.querySelector('meta[name="description"]')?.setAttribute('content', description)

  let canonical = document.querySelector('link[rel="canonical"]')
  if (path) {
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = SITE_URL + path
  } else {
    canonical?.remove()
  }

  let robots = document.querySelector('meta[name="robots"]')
  if (noindex) {
    if (!robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.appendChild(robots)
    }
    robots.content = 'noindex'
  } else {
    robots?.remove()
  }
}

export default function usePageMeta(meta) {
  const { title, description, path, noindex } = meta
  useLayoutEffect(() => {
    apply({ title, description, path, noindex })
    return () => apply(HOME_META)
  }, [title, description, path, noindex])
}
