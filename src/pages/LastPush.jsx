import styles from './LastPush.module.css'

export default function LastPush() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Campaign</span>
          <h1>The Last Push</h1>
          <p className={styles.heroSub}>
            A campaign mobilising youth for urgent climate milestones. Full details coming soon.
          </p>
        </div>
      </section>

      <section className={styles.placeholder}>
        <div className={styles.placeholderInner}>
          <span className={styles.comingSoon}>Coming Soon</span>
          <p>
            We're putting together everything you need to know about The Last Push campaign, its goals, how to get involved, and the impact we're aiming for. Check back soon!
          </p>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtn}>
            Get in touch →
          </a>
        </div>
      </section>
    </>
  )
}