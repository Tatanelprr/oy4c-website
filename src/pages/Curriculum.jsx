import styles from './Curriculum.module.css'

export default function Curriculum() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Programme</span>
          <h1>OY4CCurriculum</h1>
          <p className={styles.heroSub}>
            Climate modules designed by youth, for classrooms worldwide. Full details coming soon.
          </p>
        </div>
      </section>

      <section className={styles.placeholder}>
        <div className={styles.placeholderInner}>
          <span className={styles.comingSoon}>Coming Soon</span>
          <p>
            We're putting together everything you need to know about the OY4CCurriculum - what it covers, how to integrate it into your school, and the impact it's already making. Check back soon!
          </p>
          <a href="mailto:curriculum@oy4c.org" className={styles.ctaBtn}>
            Get in touch →
          </a>
        </div>
      </section>
    </>
  )
}