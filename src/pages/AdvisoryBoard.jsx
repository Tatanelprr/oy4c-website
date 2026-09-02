import { Users } from 'lucide-react'
import styles from '../styles/Placeholder.module.css'

export default function AdvisoryBoard() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Leadership</span>
          <h1>Advisory Board</h1>
          <p className={styles.heroSub}>
            Experienced leaders, educators, and climate experts who guide and support OY4C's mission and strategy.
          </p>
        </div>
      </section>

      <section className={styles.placeholder}>
        <div className={styles.placeholderInner}>
          <div className={styles.placeholderIcon}>
            <Users size={32} />
          </div>
          <span className={styles.comingSoon}>Coming Soon</span>
          <p>
            Meet the advisors who help shape OY4C's direction and amplify our global impact. Full profiles and bios are coming soon, we're excited to introduce this remarkable group of people.
          </p>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtn}>
            Get in touch →
          </a>
        </div>
      </section>
    </>
  )
}
