import { Briefcase } from 'lucide-react'
import styles from '../styles/Placeholder.module.css'

export default function Consultancy() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Services</span>
          <h1>Consultancy</h1>
          <p className={styles.heroSub}>
            Expert guidance from OY4C's global network to help your organisation embed high-quality climate change education.
          </p>
        </div>
      </section>

      <section className={styles.placeholder}>
        <div className={styles.placeholderInner}>
          <div className={styles.placeholderIcon}>
            <Briefcase size={32} />
          </div>
          <span className={styles.comingSoon}>Coming Soon</span>
          <p>
            Our consultancy offer is being developed. Get in touch to discuss how OY4C can support your organisation's climate change education strategy - from curriculum design to training and implementation.
          </p>
          <a href="mailto:hello@oy4c.org" className={styles.ctaBtn}>
            Start a conversation →
          </a>
        </div>
      </section>
    </>
  )
}
