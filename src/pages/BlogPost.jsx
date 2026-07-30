import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, User, Loader } from 'lucide-react'
import { fetchBlogPost } from '../lib/notion'
import styles from './BlogPost.module.css'

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
        <>
          <img src={src} alt="" className={styles.blockImg} />
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

function NotionContent({ blocks }) {
  const groups = groupBlocks(blocks)
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

export default function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  // Track error per-id so stale errors don't leak to new navigation
  const [fetchError, setFetchError] = useState({ id: null, msg: null })

  const error   = fetchError.id === id ? fetchError.msg : null
  const loading = !error && post?.id !== id

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

  return (
    <>
      <Link to="/blog" className={styles.back}>
        <ArrowLeft size={15} /> Back to blog
      </Link>

      <div className={styles.hero}>
        {post.image && (
          <img src={post.image} alt={post.title} className={styles.heroImg} />
        )}

        {post.tags.length > 0 && (
          <div className={styles.heroTags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <h1 className={styles.title}>{post.title}</h1>

        <div className={styles.meta}>
          {post.date && (
            <span className={styles.metaItem}>
              <Calendar size={14} />
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          )}
          {post.author && (
            <span className={styles.metaItem}>
              <User size={14} />
              {post.author}
            </span>
          )}
        </div>
      </div>

      <hr className={styles.divider} />

      {post.blocks && <NotionContent blocks={post.blocks} />}
    </>
  )
}
