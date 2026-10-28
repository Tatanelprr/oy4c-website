import { useState, useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Tag, Mail, Loader, Newspaper, Leaf } from 'lucide-react'
import { fetchBlogPosts, formatPostDate } from '../lib/notion'
import styles from './Blog.module.css'
import usePageMeta from '../lib/usePageMeta'
import { PAGE_META } from '../data/pageMeta'

// Placeholder cover for posts without an image: soft tint + icon, picked
// from the post id so each card keeps the same look between visits.
const COVER_TINTS = ['lavender', 'teal', 'cream', 'green']
const COVER_ICONS = [Newspaper, Leaf]

const PAGE_SIZE = 12

// FNV-1a: well spread even for ids that differ by a character or two
function hashId(id = '') {
  let h = 0x811c9dc5
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

function CoverPlaceholder({ id }) {
  const h = hashId(id)
  const Icon = COVER_ICONS[(h >>> 8) % COVER_ICONS.length]
  return (
    <div className={`${styles.cardImg} ${styles.cover} ${styles[`cover_${COVER_TINTS[h % COVER_TINTS.length]}`]}`}>
      <Icon size={40} strokeWidth={1.5} aria-hidden="true" />
    </div>
  )
}

function ArticleCard({ article, eager }) {
  const [imgFailed, setImgFailed] = useState(false)
  const tags = article.tags ?? []
  const author = article.author?.trim()
  const date = formatPostDate(article.date)
  return (
    <Link to={`/blog/${article.id}`} className={styles.card}>
      {article.image && !imgFailed ? (
        <div className={styles.cardImg}>
          <img src={article.image} alt={article.title} width={1600} height={900} loading={eager ? undefined : 'lazy'} onError={() => setImgFailed(true)} />
        </div>
      ) : (
        <CoverPlaceholder id={article.id} />
      )}
      <div className={styles.cardBody}>
        {tags.length > 0 && (
          <div className={styles.cardTags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        <h2 className={styles.cardTitle}>{article.title}</h2>
        {article.excerpt?.trim() && (
          <p className={styles.cardExcerpt}>{article.excerpt}</p>
        )}
        {(date || author) && (
          <div className={styles.cardMeta}>
            {date && (
              <span className={styles.metaItem}>
                <Calendar size={13} aria-hidden="true" />
                {date}
              </span>
            )}
            {author && (
              <span className={styles.metaItem}>
                <User size={13} aria-hidden="true" />
                {author}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export default function Blog() {
  usePageMeta(PAGE_META['/blog'])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTag, setActiveTag] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [announcement, setAnnouncement] = useState('')
  const gridRef = useRef(null)
  const focusIndex = useRef(null)

  useEffect(() => {
    fetchBlogPosts()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const tags = useMemo(
    () => ['all', ...Array.from(new Set(articles.flatMap((a) => a.tags ?? [])))],
    [articles]
  )

  const filtered =
    activeTag === 'all'
      ? articles
      : articles.filter((a) => (a.tags ?? []).includes(activeTag))
  const visible = filtered.slice(0, visibleCount)

  // After "Load more", focus the first new card so keyboard users keep their place
  // (the button itself may have just disappeared).
  useEffect(() => {
    if (focusIndex.current === null) return
    gridRef.current?.children[focusIndex.current]?.focus()
    focusIndex.current = null
  }, [visibleCount])

  function selectTag(tag) {
    setActiveTag(tag)
    setVisibleCount(PAGE_SIZE)
    setAnnouncement('')
  }

  function loadMore() {
    const next = Math.min(visibleCount + PAGE_SIZE, filtered.length)
    focusIndex.current = visibleCount
    setVisibleCount(next)
    setAnnouncement(`Showing ${next} of ${filtered.length} articles`)
  }

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Stories from the field</span>
          <h1>OY4C Blog</h1>
          <p className={styles.heroSub}>
            Insights, updates, and stories from our global network of youth climate educators.
          </p>
        </div>
      </section>

      {/* ARTICLES */}
      <section className={styles.main}>
        <div className={styles.inner}>

          {loading && (
            <div className={styles.loading}>
              <Loader size={28} className={styles.spinner} />
              <p>Loading articles…</p>
            </div>
          )}

          {error && !loading && (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p className={styles.emptyTitle}>Could not load articles</p>
              <p className={styles.emptyDesc}>Please try again later.</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {tags.length > 1 && (
                <div className={styles.filters}>
                  <Tag size={14} className={styles.filterIcon} />
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      className={`${styles.filterBtn} ${activeTag === tag ? styles.filterBtnActive : ''}`}
                      onClick={() => selectTag(tag)}
                    >
                      {tag === 'all' ? 'All' : tag}
                    </button>
                  ))}
                </div>
              )}

              {filtered.length > 0 ? (
                <>
                  <div className={styles.grid} ref={gridRef}>
                    {visible.map((article, i) => (
                      <ArticleCard key={article.id} article={article} eager={i < 3} />
                    ))}
                  </div>
                  {visible.length < filtered.length && (
                    <div className={styles.loadMoreWrap}>
                      <button type="button" className={styles.loadMore} onClick={loadMore}>
                        Load more
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                      <polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>
                    </svg>
                  </div>
                  <p className={styles.emptyTitle}>No articles yet</p>
                  <p className={styles.emptyDesc}>Check back soon, stories from our global network are on their way.</p>
                </div>
              )}
              <p className={styles.srOnly} aria-live="polite">{announcement}</p>
            </>
          )}

          <div className={styles.contribute}>
            <a href="mailto:media@oy4c.org" className={styles.contributeLink}>
              <Mail size={14} />
              Want to write for the blog? Contribute to the OY4C Blog →
            </a>
          </div>

        </div>
      </section>
    </>
  )
}
