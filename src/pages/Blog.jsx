import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, User, Tag, Mail, Loader } from 'lucide-react'
import { fetchBlogPosts } from '../lib/notion'
import styles from './Blog.module.css'

function ArticleCard({ article }) {
  return (
    <Link to={`/blog/${article.id}`} className={styles.card}>
      {article.image && (
        <div className={styles.cardImg}>
          <img src={article.image} alt={article.title} />
        </div>
      )}
      <div className={styles.cardBody}>
        {article.tags.length > 0 && (
          <div className={styles.cardTags}>
            {article.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
        <h2 className={styles.cardTitle}>{article.title}</h2>
        {article.excerpt && (
          <p className={styles.cardExcerpt}>{article.excerpt}</p>
        )}
        <div className={styles.cardMeta}>
          {article.date && (
            <span className={styles.metaItem}>
              <Calendar size={13} />
              {new Date(article.date).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          )}
          {article.author && (
            <span className={styles.metaItem}>
              <User size={13} />
              {article.author}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export default function Blog() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTag, setActiveTag] = useState('all')

  useEffect(() => {
    fetchBlogPosts()
      .then(setArticles)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const tags = useMemo(
    () => ['all', ...Array.from(new Set(articles.flatMap((a) => a.tags)))],
    [articles]
  )

  const filtered =
    activeTag === 'all'
      ? articles
      : articles.filter((a) => a.tags.includes(activeTag))

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
                      onClick={() => setActiveTag(tag)}
                    >
                      {tag === 'all' ? 'All' : tag}
                    </button>
                  ))}
                </div>
              )}

              {filtered.length > 0 ? (
                <div className={styles.grid}>
                  {filtered.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
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
            </>
          )}

          <div className={styles.contribute}>
            <a href="mailto:hello@oy4c.org" className={styles.contributeLink}>
              <Mail size={14} />
              Want to write for the blog? Contribute to the OY4C Blog →
            </a>
          </div>

        </div>
      </section>
    </>
  )
}
