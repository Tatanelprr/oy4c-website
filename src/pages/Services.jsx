import styles from './Services.module.css'

export default function Services() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Services</span>
          <h1>Our Services</h1>
          <p className={styles.heroSub}>
            The ways we partner with schools, organisations, and communities to drive climate action. Full details coming soon.
          </p>
        </div>
      </section>

      <section className={styles.placeholder}>
        <div className={styles.placeholderInner}>
          <span className={styles.comingSoon}>Coming Soon</span>
          <p>
            We're putting together everything you need to know about the services we offer - what they include, how to get involved, and the impact they create. Check back soon!
          </p>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtn}>
            Get in touch →
          </a>
        </div>
      </section>
    </>
  )
}
