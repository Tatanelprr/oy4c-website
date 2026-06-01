import { Link } from 'react-router-dom'
import { FileText, Globe, Users, BookOpen, GraduationCap } from 'lucide-react'
import styles from './Impact.module.css'

export default function Impact() {
  return (
    <>
  {/* HERO */}
  <section className={styles.hero}>
    <div className={styles.heroBg} />
    <div className={styles.heroContent}>
      <span className={styles.heroEyebrow}>Our impact</span>
      <h1>
        Measuring what<br />
        <em>matters.</em>
      </h1>
      <p className={styles.heroSub}>
        From classrooms in Fiji to communities in Nigeria — here's what OY4C has built, reached, and changed since day one.
      </p>
    </div>
  </section>

  {/* METRICS */}
  <section className={styles.metrics}>
    <span className="section-eyebrow" style={{ textAlign: 'center', display: 'block' }}>By the numbers</span>
    <h2 className="section-title" style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto 0' }}>OY4C in numbers</h2>
    <div className={styles.metricsGrid}>
      {[
        { num: '500+', label: 'Volunteers worldwide' },
        { num: '40+', label: 'Countries represented' },
        { num: '10k+', label: 'Students reached' },
        { num: '200+', label: 'Curricula integrated' },
        { num: '670', label: 'Students taught live via CCiC' },
        { num: '100k+', label: 'Monthly online reach' },
        { num: '4.63/5', label: 'CCiC workshop rating' },
        { num: '5', label: 'Continents reached' },
      ].map((m) => (
        <div key={m.label} className={styles.metric}>
          <div className={styles.metricNum}>{m.num}</div>
          <div className={styles.metricLbl}>{m.label}</div>
        </div>
      ))}
    </div>
  </section>

  {/* IMPACT REPORT */}
  <section className={styles.report}>
    <div className={styles.reportInner}>
      <div className={styles.reportCard}>
        <div className={styles.reportYear}>2025</div>
        <h3>Impact Report</h3>
        <p>A transformative year of growth, innovation and global reach. Discover what OY4C accomplished in 2025 — by the numbers and beyond.</p>
        <a href="/s/2025-Impact-Report-576j.pdf" target="_blank" rel="noreferrer" className={styles.btnAccent}>
          Download the report →
        </a>
      </div>
      <div className={styles.reportText}>
        <span className="section-eyebrow">Our story in numbers</span>
        <h2 className="section-title">Built on youth power, driven by urgency</h2>
        <p>
          OY4C started with a simple belief: young people understand the climate crisis better than anyone. We turned that belief into a global education movement, spanning 40+ countries and reaching hundreds of thousands of students.
        </p>
        <p>
          Every year, we publish an Impact Report documenting our reach, our programmes, and the stories behind the numbers. Because accountability matters — and so does transparency.
        </p>
      </div>
    </div>
  </section>

  {/* CASE STUDIES */}
  <section className={styles.caseStudies}>
    <div className={styles.caseStudiesInner}>
      <span className="section-eyebrow">Impact stories</span>
      <h2 className="section-title">Case studies & stories</h2>
      <div className={styles.comingSoonBox}>
        <p>Our case studies and impact stories are being compiled. Check back soon to read about the real-world change OY4C is making in classrooms and communities worldwide.</p>
        <span className={styles.comingSoon}>Coming Soon</span>
      </div>
    </div>
  </section>

  {/* SDGs */}
  <section className={styles.sdgs}>
    <div className={styles.sdgsInner}>
      <span className="section-eyebrow">Global goals</span>
      <h2 className="section-title">Supporting the UN SDGs</h2>
      <p>
        OY4C's work directly contributes to several United Nations Sustainable Development Goals — because climate education isn't just about the environment. It's about equity, access, and the future we all share.
      </p>
      <div className={styles.sdgsList}>
        {[
          'SDG 4 — Quality Education',
          'SDG 10 — Reduced Inequalities',
          'SDG 13 — Climate Action',
          'SDG 16 — Peace, Justice & Strong Institutions',
          'SDG 17 — Partnerships for the Goals',
        ].map((s) => (
          <span key={s} className={styles.sdgBadge}>{s}</span>
        ))}
      </div>
    </div>
  </section>

  {/* CTA */}
  <section className={styles.cta}>
    <h2>Want to support our mission?</h2>
    <p>Every donation, partnership, and curriculum integration helps us reach more students worldwide.</p>
    <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
      <a href="https://validaid.org/fundraiser/174" target="_blank" rel="noreferrer" className={styles.ctaBtn}>
        Donate Today →
      </a>
      <Link to="/partnerships" className={styles.ctaBtn}>
        Become a Partner →
      </Link>
    </div>
  </section>
    </>
  )
}