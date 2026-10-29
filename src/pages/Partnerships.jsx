import { useState, useEffect, useRef } from 'react'
import { Globe, Heart, Users, Handshake, X } from 'lucide-react'
import styles from './Partnerships.module.css'
import usePageMeta from '../lib/usePageMeta'
import { PAGE_META } from '../data/pageMeta'

// Local copies of the partner logos: used when Notion has no logo, and when the
// Notion one fails to load (i.ibb.co, behind /api/img, is sometimes down).
const LOGO_LOCAL = {
  'Feel Good Action':              '/partners/feel-good-action.webp',
  'Climate Cardinals':             '/partners/climate-cardinals.webp',
  'Force of Nature':               '/partners/force-of-nature.webp',
  'Climate Majority Project':      '/partners/climate-majority-project.webp',
  'Climate Quilt':                 '/partners/climate-quilt.png',
  'Energy for Refugees Amsterdam': '/partners/energy-for-refugees.jpg',
}

// Swaps a failed logo for its local copy, once.
function fallBackToLocalLogo(e, name) {
  const local = LOGO_LOCAL[name]
  if (local && e.currentTarget.getAttribute('src') !== local) e.currentTarget.src = local
}

// Partners not tagged "Partner" in Notion (Climate Fresk sits under "As Seen In" there)
const EXTRA_PARTNERS = [
  { name: 'Greening Education Partnership', logo: '/partners/gep.webp' },
  { name: 'Climate Fresk', logo: '/seen-in/climate-fresk.png' },
]

// "What we build together" stays hidden until there are case studies to show
// (Ava). Set to true to show it again.
const SHOW_WHAT_WE_BUILD = false

// "Our projects" circle: every partner except these
const NOT_PROJECTS = new Set(['Climate Quilt'])

// TODO: 2-3 sentences and a link per project, keyed by partner name, e.g.
// 'GEP': { text: '…', link: 'https://…' }
const PROJECT_INFO = {}

export default function Partnerships() {
  usePageMeta(PAGE_META['/partnerships'])
  const [partners, setPartners] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const [project, setProject]   = useState(null)
  const dialogRef = useRef(null)

  const allPartners = [...partners, ...EXTRA_PARTNERS].map((p) => ({ ...p, logo: p.logo || LOGO_LOCAL[p.name] }))
  const projects = allPartners.filter((p) => !NOT_PROJECTS.has(p.name))
  const info = project ? PROJECT_INFO[project.name] : null

  useEffect(() => {
    if (project) dialogRef.current?.showModal()
  }, [project])

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => { setPartners(data.partners); setLoading(false) })
      .catch((err) => { setError(String(err)); setLoading(false) })
  }, [])

  return (
    <>
      {/* HERO — image background with dark overlay */}
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

      {/* NOTE — points to the "how to partner" section further down */}
      <div className={styles.note}>
        <p>
          Meet the organisations we already work with below — and if you'd like to join them,{' '}
          <a href="#partner-with-us">scroll down to learn how to partner with us ↓</a>
        </p>
      </div>

      {/* CURRENT PARTNERS — loaded from /api/partners */}
      <section className={styles.partners}>
        <div className={styles.partnersInner}>
          <span className="section-eyebrow">Our partners</span>
          <h2 className="section-title">Organisations we work with</h2>

          {loading && <p className={styles.partnersLoading}>Loading partners…</p>}
          {error   && <p className={styles.partnersError}>Unable to load partners.</p>}

          {!loading && !error && (
            <div className={styles.partnersGrid}>
              {allPartners.map((p) => {
                return (
                  <div key={p.name} className={styles.partnerCard}>
                    <div className={styles.partnerLogo}>
                      {p.logo ? (
                        <img src={p.logo} alt={p.name} loading="lazy" onError={(e) => fallBackToLocalLogo(e, p.name)} />
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

      {/* PARTNER WITH US — how it works */}
      <section id="partner-with-us" className={styles.intro}>
        <div className={styles.introInner}>
          <div className={styles.introText}>
            <span className="section-eyebrow">Partner with us</span>
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

      {/* OUR PROJECTS — partners on a circle, click opens a pop-in */}
      {SHOW_WHAT_WE_BUILD && !loading && !error && (
        <section className={styles.projects}>
          <div className={styles.projectsInner}>
            <span className="section-eyebrow">Our projects</span>
            <h2 className="section-title">What we build together</h2>
            <ul className={styles.orbit} style={{ '--n': projects.length }}>
              {projects.map((p, i) => (
                <li key={p.name} className={styles.orbitItem} style={{ '--i': i }}>
                  <button type="button" className={styles.orbitBtn} onClick={() => setProject(p)}>
                    {p.logo ? <img src={p.logo} alt={p.name} loading="lazy" /> : p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <dialog
            ref={dialogRef}
            className={styles.projectDialog}
            aria-labelledby="project-title"
            onClose={() => setProject(null)}
            onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
          >
            {project && (
              <div className={styles.projectBody}>
                <button type="button" className={styles.projectClose} onClick={() => dialogRef.current.close()} aria-label="Close">
                  <X size={20} />
                </button>
                <div className={styles.projectHead}>
                  {project.logo && <img src={project.logo} alt="" className={styles.projectLogo} />}
                  <h3 id="project-title" className={styles.projectName}>{project.name}</h3>
                </div>
                {info?.text && <p className={styles.projectText}>{info.text}</p>}
                {info?.link && (
                  <a href={info.link} target="_blank" rel="noreferrer" className={styles.projectLink}>
                    Learn more →
                  </a>
                )}
              </div>
            )}
          </dialog>
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        <h2>Interested in partnering with OY4C?</h2>
        <p>
          We're always open to new collaborations.
          <br />
          If your organisation shares our values, let's talk.
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
