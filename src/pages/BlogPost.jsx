import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Loader } from 'lucide-react'
import { fetchBlogPost, formatPostDate } from '../lib/notion'
import styles from './BlogPost.module.css'
import usePageMeta from '../lib/usePageMeta'
import { BLOG_POST_LOADING_META, NOT_FOUND_META, blogPostMeta } from '../data/pageMeta'

// ── Rich text ──────────────────────────────────────────────────────────────

function RichText({ tokens = [] }) {
  return tokens.map((token, i) => {
    const { annotations: a, text: { content, link } } = token
    const className = [
      a.bold          ? styles.bold       : '',
      a.italic        ? styles.italic     : '',
      a.strikethrough ? styles.strike     : '',
      a.underline     ? styles.underline  : '',
      a.code          ? styles.inlineCode : '',
    ].filter(Boolean).join(' ') || undefined

    const el = <span key={i} className={className}>{content}</span>
    return link
      ? <a key={i} href={link.url} target="_blank" rel="noreferrer" className={className}>{content}</a>
      : el
  })
}

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

// title: the article's title, used as alt text for its images.
function Block({ block, title }) {
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
        <>
          <img src={src} alt={title} className={styles.blockImg} loading="lazy" />
          {cap.length > 0 && (
            <p className={styles.caption}><RichText tokens={cap} /></p>
          )}
        </>
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
function NotionContent({ blocks, title, skipId }) {
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
        return <Block key={group.id ?? i} block={group} title={title} />
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
          <img
            src={post.image}
            alt={post.title}
            width={1600}
            height={900}
            className={styles.heroImg}
            onError={() => setFailedImg(post.image)}
          />
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

      {post.blocks && <NotionContent blocks={post.blocks} title={post.title} skipId={post.coverBlockId} />}
    </>
  )
}
