import { Sprout } from 'lucide-react'
import styles from '../styles/Placeholder.module.css'

export default function TakeAction() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Get involved</span>
          <h1>Take Action</h1>
          <p className={styles.heroSub}>
            Join the OY4C movement — take the pledge, integrate our curriculum, and become a climate advocate in your community.
          </p>
        </div>
      </section>

      <section className={styles.placeholder}>
        <div className={styles.placeholderInner}>
          <div className={styles.placeholderIcon}>
            <Sprout size={32} />
          </div>
          <span className={styles.comingSoon}>Coming Soon</span>
          <p>
            Our Take Action hub is on its way. From taking the OY4C Pledge to spreading climate education in your school, there are many ways to make a difference. Check back soon — and in the meantime, reach out to get started.
          </p>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtn}>
            Get in touch →
          </a>
        </div>
      </section>
    </>
  )
}
