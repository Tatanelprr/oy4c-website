import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Loader } from 'lucide-react'
import { fetchBlogPost, formatPostDate, imgAtWidth, imgSrcSet } from '../lib/notion'

// Rendered widths: hero spans the page minus 10vw (5vw on phones) each side,
// body images the 900px content column minus its padding.
const HERO_SIZES = '(max-width: 768px) 90vw, 80vw'
const BODY_SIZES = '(max-width: 768px) calc(100vw - 40px), 820px'
import styles from './BlogPost.module.css'
import usePageMeta from '../lib/usePageMeta'
import { BLOG_POST_LOADING_META, NOT_FOUND_META, blogPostMeta } from '../data/pageMeta'

// Puts the image's natural ratio on its figure, where the CSS uses it to cap
// the height without distorting the image (see --r in BlogPost.module.css).
function setRatio(e) {
  const { naturalWidth: w, naturalHeight: h, parentElement } = e.currentTarget
  if (h) parentElement.style.setProperty('--r', w / h)
}

// ── Rich text ──────────────────────────────────────────────────────────────

// Bare http(s) URLs in a citation, without trailing punctuation such as "." or ")".
const URL_RE = /https?:\/\/[^\s<>"]+[^\s<>".,;:!?)\]]/g

// Plain text with its bare URLs turned into links.
function linkified(content, className) {
  const parts = []
  let last = 0
  for (const m of content.matchAll(URL_RE)) {
    if (m.index > last) parts.push(content.slice(last, m.index))
    parts.push(<a key={m.index} href={m[0]} target="_blank" rel="noreferrer" className={className}>{m[0]}</a>)
    last = m.index + m[0].length
  }
  if (last < content.length) parts.push(content.slice(last))
  return parts
}

// linkify: also make bare URLs clickable (image credits and captions).
function RichText({ tokens = [], linkify = false }) {
  return tokens.map((token, i) => {
    const { annotations: a, text: { content, link } } = token
    const className = [
      a.bold          ? styles.bold       : '',
      a.italic        ? styles.italic     : '',
      a.strikethrough ? styles.strike     : '',
      a.underline     ? styles.underline  : '',
      a.code          ? styles.inlineCode : '',
    ].filter(Boolean).join(' ') || undefined

    if (link) return <a key={i} href={link.url} target="_blank" rel="noreferrer" className={className}>{content}</a>
    return <span key={i} className={className}>{linkify ? linkified(content) : content}</span>
  })
}

// True when rich text has visible characters.
const hasText = (tokens = []) => tokens.some((t) => (t.plain_text ?? t.text?.content ?? '').trim())

// ── Block grouping ─────────────────────────────────────────────────────────

function groupBlocks(blocks) {
  const groups = []
  let i = 0
  while (i < blocks.length) {
    const b = blocks[i]
    if (b.type === 'bulleted_list_item') {
      const items = []
      while (i < blocks.length && blocks[i].type === 'bulleted_list_item') items.push(blocks[i++])
      groups.push({ type: 'bulleted_list', items })
    } else if (b.type === 'numbered_list_item') {
      const items = []
      while (i < blocks.length && blocks[i].type === 'numbered_list_item') items.push(blocks[i++])
      groups.push({ type: 'numbered_list', items })
    } else {
      groups.push(b)
      i++
    }
  }
  return groups
}

// ── Individual block ───────────────────────────────────────────────────────

// Images get an empty alt: Notion has no alt text for them, and the article
// title (the old alt) is already the page's h1. Captions stay.
function Block({ block }) {
  const rt = (key) => block[key]?.rich_text ?? []

  switch (block.type) {
    case 'paragraph':
      return (
        <p className={styles.paragraph}>
          <RichText tokens={rt('paragraph')} />
        </p>
      )

    case 'heading_1':
      return <h1 className={styles.h1}><RichText tokens={rt('heading_1')} /></h1>

    case 'heading_2':
      return <h2 className={styles.h2}><RichText tokens={rt('heading_2')} /></h2>

    case 'heading_3':
      return <h3 className={styles.h3}><RichText tokens={rt('heading_3')} /></h3>

    case 'quote':
      return (
        <blockquote className={styles.quote}>
          <RichText tokens={rt('quote')} />
        </blockquote>
      )

    case 'callout': {
      const icon = block.callout?.icon?.emoji ?? block.callout?.icon?.external?.url
      return (
        <div className={styles.callout}>
          {icon && <span className={styles.calloutIcon}>{icon}</span>}
          <span><RichText tokens={rt('callout')} /></span>
        </div>
      )
    }

    case 'image': {
      const src = block.image?.external?.url ?? block.image?.file?.url
      const cap = block.image?.caption ?? []
      if (!src) return null
      return (
        <figure className={styles.figure}>
          {/* Notion gives no dimensions: 3:2 reserves the space until the image loads */}
          <img
            src={imgAtWidth(src, 1200)}
            srcSet={imgSrcSet(src, [800, 1200])}
            sizes={BODY_SIZES}
            alt=""
            width={1200}
            height={800}
            className={styles.blockImg}
            loading="lazy"
            onLoad={setRatio}
          />
          {hasText(cap) && (
            <figcaption className={styles.caption}><RichText tokens={cap} linkify /></figcaption>
          )}
        </figure>
      )
    }

    case 'code': {
      const text = (block.code?.rich_text ?? []).map(t => t.text?.content).join('')
      return <pre className={styles.code}><code>{text}</code></pre>
    }

    case 'divider':
      return <hr className={styles.blockDivider} />

    default:
      return null
  }
}

// ── Grouped block renderer ─────────────────────────────────────────────────

// skipId: body image already shown as the cover.
function NotionContent({ blocks, skipId }) {
  const groups = groupBlocks(blocks.filter((b) => b.id !== skipId))
  return (
    <div className={styles.content}>
      {groups.map((group, i) => {
        if (group.type === 'bulleted_list') {
          return (
            <ul key={i} className={styles.ul}>
              {group.items.map((item) => (
                <li key={item.id} className={styles.li}>
                  <RichText tokens={item.bulleted_list_item?.rich_text ?? []} />
                </li>
              ))}
            </ul>
          )
        }
        if (group.type === 'numbered_list') {
          return (
            <ol key={i} className={styles.ol}>
              {group.items.map((item) => (
                <li key={item.id} className={styles.li}>
                  <RichText tokens={item.numbered_list_item?.rich_text ?? []} />
                </li>
              ))}
            </ol>
          )
        }
        return <Block key={group.id ?? i} block={group} />
      })}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

// Plain text of the opening paragraphs (at least 120 characters when the
// article allows), used for the meta description when the excerpt is empty.
function leadText(blocks = []) {
  let text = ''
  for (const b of blocks) {
    if (b.type !== 'paragraph') continue
    const para = (b.paragraph?.rich_text ?? []).map((t) => t.plain_text ?? t.text?.content ?? '').join('').trim()
    if (para) text = text ? `${text} ${para}` : para
    if (text.length >= 120) break
  }
  return text
}

export default function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  // Track error per-id so stale errors don't leak to new navigation
  const [fetchError, setFetchError] = useState({ id: null, msg: null })
  // Hero image that failed to load (by src), so a broken image is never shown
  const [failedImg, setFailedImg] = useState(null)

  const error   = fetchError.id === id ? fetchError.msg : null
  const loading = !error && post?.id !== id

  // The API answers 404 for unknown or unpublished articles.
  const notFound = error?.includes('(404)')
  usePageMeta(
    notFound ? NOT_FOUND_META
      : !loading && post ? blogPostMeta(post, leadText(post.blocks))
      : BLOG_POST_LOADING_META
  )

  useEffect(() => {
    let active = true
    fetchBlogPost(id)
      .then((data) => {
        if (active) { setPost(data); setFetchError({ id: null, msg: null }) }
      })
      .catch((err) => {
        if (active) setFetchError({ id, msg: err.message })
      })
    return () => { active = false }
  }, [id])

  if (loading) {
    return (
      <div className={styles.loading}>
        <Loader size={28} className={styles.spinner} />
        <p>Loading article…</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className={styles.notFound}>
        <p>Article not found.</p>
        <Link to="/blog" className={styles.back}>
          <ArrowLeft size={15} /> Back to blog
        </Link>
      </div>
    )
  }

  const tags   = post.tags ?? []
  const author = post.author?.trim()
  const date   = formatPostDate(post.date)

  return (
    <>
      <Link to="/blog" className={styles.back}>
        <ArrowLeft size={15} /> Back to blog
      </Link>

      <div className={styles.hero}>
        {post.image && post.image !== failedImg && (
          <figure className={styles.heroFigure}>
            <img
              src={imgAtWidth(post.image, 1200)}
              srcSet={imgSrcSet(post.image, [800, 1200])}
              sizes={HERO_SIZES}
              fetchPriority="high"
              alt=""
              width={1600}
              height={900}
              className={styles.heroImg}
              onError={() => setFailedImg(post.image)}
            />
            {hasText(post.imageCredit) && (
              <figcaption className={styles.credit}><RichText tokens={post.imageCredit} linkify /></figcaption>
            )}
          </figure>
        )}

        {tags.length > 0 && (
          <div className={styles.heroTags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <h1 className={styles.title}>{post.title}</h1>

        {(date || author) && (
          <div className={styles.meta}>
            {date && (
              <span className={styles.metaItem}>
                <Calendar size={14} aria-hidden="true" />
                {date}
              </span>
            )}
            {author && (
              <span className={styles.metaItem}>
                <User size={14} aria-hidden="true" />
                {author}
              </span>
            )}
          </div>
        )}
      </div>

      <hr className={styles.divider} />

      {post.blocks && <NotionContent blocks={post.blocks} skipId={post.coverBlockId} />}
    </>
  )
}
