import { useState, useEffect } from 'react'
import { Globe, Heart, Users, Handshake } from 'lucide-react'
import styles from './Partnerships.module.css'

// Local logo paths until CDN URLs are set in Notion
const LOGO_LOCAL = {
  'Feel Good Action':              '/partners/feel-good-action.webp',
  'Climate Cardinals':             '/partners/climate-cardinals.png',
  'Force of Nature':               '/partners/force-of-nature.webp',
  'Climate Majority Project':      '/partners/climate-majority-project.webp',
  'Climate Quilt':                 '/partners/climate-quilt.png',
  'Energy for Refugees Amsterdam': '/partners/energy-for-refugees.jpg',
}

export default function Partnerships() {
  const [partners, setPartners] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => { setPartners(data.partners); setLoading(false) })
      .catch((err) => { setError(String(err)); setLoading(false) })
  }, [])

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Work with us</span>
          <h1>
            Building a global<br />
            <em>coalition for change.</em>
          </h1>
          <p className={styles.heroSub}>
            OY4C partners with organisations that share our commitment to youth empowerment, climate change education, and systemic change. Together, we go further.
          </p>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <div className={styles.introInner}>
          <div className={styles.introText}>
            <span className="section-eyebrow">Why partner with OY4C?</span>
            <h2 className="section-title">Stronger together</h2>
            <p>
              Partnerships are at the heart of how OY4C scales its mission. We believe that closing the global climate change education gap requires collective action - and that means building bridges between youth organisations, schools, NGOs, and businesses that share our values.
            </p>
            <p>
              Whether you're looking to co-create educational content, reach a global youth audience, or amplify your climate initiatives, we'd love to explore how we can work together.
            </p>
            <a href="mailto:partnerships@oy4c.org" className="btn-pill btn-pill-primary" style={{ marginTop: 8 }}>
              Get in touch →
            </a>
          </div>
          <div className={styles.introValues}>
            {[
              { icon: <Globe size={20} />, text: 'Global reach across 43 countries' },
              { icon: <Users size={20} />, text: '133 passionate youth volunteers' },
              { icon: <Heart size={20} />, text: 'Mission-aligned, values-driven collaboration' },
              { icon: <Handshake size={20} />, text: 'Flexible partnership models' },
            ].map((v) => (
              <div key={v.text} className={styles.introValue}>
                <div className={styles.introValueIcon}>{v.icon}</div>
                <div className={styles.introValueText}>{v.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className={styles.partners}>
        <div className={styles.partnersInner}>
          <span className="section-eyebrow">Our partners</span>
          <h2 className="section-title">Organisations we work with</h2>

          {loading && <p className={styles.partnersLoading}>Loading partners…</p>}
          {error   && <p className={styles.partnersError}>Unable to load partners.</p>}

          {!loading && !error && (
            <div className={styles.partnersGrid}>
              {partners.map((p) => {
                const logo = p.logo || LOGO_LOCAL[p.name]
                return (
                  <div key={p.name} className={styles.partnerCard}>
                    <div className={styles.partnerLogo}>
                      {logo ? (
                        <img src={logo} alt={p.name} />
                      ) : (
                        <div className={styles.partnerLogoPlaceholder}>{p.name}</div>
                      )}
                    </div>
                    <div className={styles.partnerName}>{p.name}</div>
                    {p.description && (
                      <div className={styles.partnerDesc}>{p.description}</div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Interested in partnering with OY4C?</h2>
        <p>
          We're always open to new collaborations. If your organisation shares our values, let's talk.
        </p>
        <div className={styles.ctaBtns}>
          <a href="mailto:partnerships@oy4c.org" className={styles.ctaBtn}>
            Get in touch →
          </a>
        </div>
      </section>
    </>
  )
}
