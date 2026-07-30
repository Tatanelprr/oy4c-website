import { Mic } from 'lucide-react'
import styles from '../styles/Placeholder.module.css'

export default function Speaker() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Services</span>
          <h1>Speaker Programme</h1>
          <p className={styles.heroSub}>
            OY4C youth climate educators are available to speak at schools, conferences, panels, and events worldwide.
          </p>
        </div>
      </section>

      <section className={styles.placeholder}>
        <div className={styles.placeholderInner}>
          <div className={styles.placeholderIcon}>
            <Mic size={32} />
          </div>
          <span className={styles.comingSoon}>Coming Soon</span>
          <p>
            We're formalising our speaker request process. In the meantime, get in touch to invite an OY4C speaker to your event — we'd love to bring youth-led climate education to your audience.
          </p>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtn}>
            Request a speaker →
          </a>
        </div>
      </section>
    </>
  )
}
