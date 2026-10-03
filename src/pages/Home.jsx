import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  School, Briefcase, Handshake, Sprout,
  Newspaper, Mic2, GraduationCap
} from 'lucide-react'
import styles from './Home.module.css'
import VolunteerMap from '../components/VolunteerMap'

// Local logo fallbacks until CDN URLs are set in Notion
const LOGO_LOCAL = {
  'National Geographic':             '/seen-in/national-geographic.png',
  'DoSomething.org':                 '/seen-in/dosomething.png',
  'TedX':                            '/seen-in/tedx.png',
  'Euronews':                        '/seen-in/euronews.svg',
  'Environmental Media Association': '/seen-in/ema.png',
  'Global Heroes':                   '/seen-in/global-heroes.png',
  'Sierra Club':                     '/seen-in/sierra-club.png',
  'QS Impact':                       '/seen-in/qs.svg',
  'UCL':                             '/seen-in/ucl.png',
  'Turner Contemporary':             '/seen-in/turner-contemporary.png',
  'Digital Camp':                    '/seen-in/digital-camp.png',
  'Climate Fresk':                   '/seen-in/climate-fresk.png',
  'Feel Good Action':                '/partners/feel-good-action.webp',
  'Climate Cardinals':               '/partners/climate-cardinals.png',
  'Force of Nature':                 '/partners/force-of-nature.webp',
  'Climate Majority Project':        '/partners/climate-majority-project.webp',
  'Climate Quilt':                   '/partners/climate-quilt.png',
  'Energy for Refugees Amsterdam':   '/partners/energy-for-refugees.jpg',
}

const INVERT_LOGOS = new Set(['Turner Contemporary'])

const SLIDES = [
  '/hero/hero-1.jpg',
  '/hero/hero-2.jpg',
  '/hero/hero-3.jpg',
  '/hero/hero-4.jpg',
]

// Contenu de la carte blanche, synchronisé avec le slide actif
const HERO_SLIDES = [
  {
    eyebrow: 'Youth-led climate change education',
    title: (
      <>
        Education for Youth.<br />
        <em>By Youth.</em>
        Together for the Climate.
      </>
    ),
    sub: 'To create widespread awareness and action towards a sustainable future, OY4C empowers the next generation with high-quality, accessible, youth-led climate change education.',
    buttons: [
      { label: 'Learn about OY4C', to: '/about', variant: 'primary' },
      { label: 'Take Action', to: '/takeaction', variant: 'outline' },
    ],
  },
  {
    eyebrow: 'OY4CCurriculum',
    title: 'Free, ready-to-teach climate change education',
    sub: 'Interdisciplinary, youth-developed lessons, free for schools and educators everywhere.',
    buttons: [
      { label: 'Get the OY4CCurriculum', to: '/curriculum', variant: 'primary' },
    ],
  },
  {
    eyebrow: 'CCiC',
    title: '670 students. 5 continents. 3 months.',
    sub: 'Our pilot programme brought climate change lessons into classrooms around the world.',
    buttons: [
      { label: 'See the CCiC pilot', to: '/ccic', variant: 'primary' },
    ],
  },
  {
    eyebrow: 'Our people',
    title: '133 volunteers. 43 countries.',
    sub: 'A global team of young people turning climate education into action on every continent.',
    buttons: [
      { label: 'Meet our people', to: '/team', variant: 'primary' },
    ],
  },
]

const PATHS = [
  { icon: <Sprout />, who: "I'm a Young Person", desc: "You don't need permission to teach your generation. Bring OY4C to your community!", cta: 'Start here →', to: '/takeaction', img: '/hero/hero-1.jpg' },
  { icon: <School />, who: "I'm an Educator or School", desc: 'A free, ready-to-teach climate change curriculum built by the generation you\'re teaching', cta: 'Get the curriculum →', to: '/curriculum', img: '/paths/path-educator.jpg' },
  { icon: <Handshake />, who: "I'm a Partner", desc: 'We work with organisations to take climate change education further than either of us could alone.', cta: 'Partner with us →', to: '/partnerships', img: '/paths/path-partner.png' },
  { icon: <Briefcase />, who: "I'm a Funder", desc: '133 volunteers. 43 countries. Six continents. See what youth-led delivery achieves, and what\'s next.', cta: 'See our impact →', to: '/impact', img: '/paths/path-funder.jpg' },
]

function HeroSlideshow({ current, setCurrent }) {
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [setCurrent])

  return (
    <div className={styles.slideshowBg}>
      {SLIDES.map((src, i) => (
        <div
          key={src}
          className={styles.slide}
          style={{
            backgroundImage: `url('${src}')`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className={styles.slideshowOverlay} />
      <div className={styles.slideshowDots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const [seenIn, setSeenIn]         = useState([])
  const [partnersList, setPartners] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activePath, setActivePath]      = useState(0)
  const pathsRef = useRef(null)

  const handlePathsScroll = () => {
    const el = pathsRef.current
    if (!el) return
    const card = el.children[0]
    if (!card) return
    const step = card.offsetWidth + 16 // card width + gap
    setActivePath(Math.round(el.scrollLeft / step))
  }

  const scrollToPath = (i) => {
    const el = pathsRef.current
    if (!el) return
    const card = el.children[0]
    if (!card) return
    const step = card.offsetWidth + 16
    el.scrollTo({ left: i * step, behavior: 'smooth' })
  }

  const activeHero = HERO_SLIDES[currentSlide]

  useEffect(() => {
    fetch('/api/partners')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then((data) => {
        setSeenIn(data.seenIn)
        setPartners(data.partners)
      })
      .catch(() => {}) // fail silently — sections stay empty
  }, [])

  return (
    <>
      {/* HERO */}
<section className={styles.hero}>
  <HeroSlideshow current={currentSlide} setCurrent={setCurrentSlide} />
  <div className={`${styles.heroContent} ${currentSlide !== 0 ? styles.heroContentAlt : ''}`}>
    <div key={currentSlide} className={styles.heroContentInner}>
      <span className={styles.heroEyebrow}>{activeHero.eyebrow}</span>
      <h1>{activeHero.title}</h1>
      <p className={styles.heroSub}>{activeHero.sub}</p>
      <div className={styles.heroBtns}>
        {activeHero.buttons.map((b) => (
          <Link
            key={b.to}
            to={b.to}
            className={`btn-pill ${b.variant === 'primary' ? 'btn-pill-primary' : 'btn-pill-outline'}`}
          >
            {b.label}
          </Link>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* AS SEEN IN */}
      {seenIn.length > 0 && (
        <section className={styles.seenIn}>
          <p className={styles.seenInLabel}>As Seen In</p>
          <div className={styles.seenInTrack}>
            <div className={styles.seenInInner}>
              {[0, 1].map((i) => (
                <span key={i} className={styles.seenInSet}>
                  {seenIn.map((item) => {
                    const src = item.logo || LOGO_LOCAL[item.name]
                    if (!src) return null
                    const invert = INVERT_LOGOS.has(item.name)
                    return (
                      <img
                        key={item.name}
                        src={src}
                        alt={item.name}
                        className={`${styles.seenInLogo}${invert ? ' ' + styles.seenInLogoInvert : ''}`}
                        draggable={false}
                      />
                    )
                  })}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* IMPACT REPORT — au dessus des metrics */}
      <section className={styles.impactTop}>
        <div className={styles.impactTopInner}>
          <div>
            <span className="section-eyebrow">2025</span>
            <h2 className="section-title">Impact Report</h2>
            <p className="section-body">
              A transformative year of growth, innovation and global reach. Discover what OY4C accomplished in 2025, by the numbers and beyond.
            </p>
            <a href="/s/2025-Impact-Report-576j.pdf" target="_blank" rel="noreferrer" className={styles.btnAccent}>
              Download the report →
            </a>
          </div>
          <div className={styles.impactTopVisual}>
            <VolunteerMap />
            <p className={styles.mapCaption}>🌍 Countries where OY4C volunteers are active</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsInner}>
          <h2 className={`section-title ${styles.testimonialsTitle}`}>What students say</h2>
          <div className={styles.testimonialGrid}>
            <blockquote className={styles.testimonialCard}>
              <GraduationCap className={styles.testimonialIcon} size={32} strokeWidth={1.75} />
              <p>"I felt really <span className={styles.highlight}>educated</span> because I had no idea that things like this existed"</p>
              <cite>Student, 13, Nadi, Fiji</cite>
            </blockquote>
            <blockquote className={styles.testimonialCard}>
              <GraduationCap className={styles.testimonialIcon} size={32} strokeWidth={1.75} />
              <p>"<span className={styles.highlight}>Liberated and inspired</span>. Showed me some insight to what I can do better to help the climate crisis."</p>
              <cite>Student, 16, Rotorua, New Zealand</cite>
            </blockquote>
          </div>
        </div>
      </section>

      {/* KEY METRICS */}
      <section className={styles.metrics}>
        <p className={styles.metricsLabel}>Our impact in numbers</p>
        <div className={styles.metricsGrid}>
          {[
            { num: '133', label: 'Volunteers worldwide' },
            { num: '43', label: 'Countries represented' },
            { num: '10,000', label: 'Students reached' },
            { num: '80,000', label: 'Across social media' },
          ].map((m) => (
            <div key={m.label} className={styles.metric}>
              <div className={styles.metricNum}>{m.num}</div>
              <div className={styles.metricLbl}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BANDEAU DÉFILANT */}
      <div className={styles.announcementBar}>
        <div className={styles.marqueeTrack}>
          {[...Array(3)].map((_, i) => (
            <span key={i} className={styles.marqueeInner}>
              <a href="https://validaid.org/fundraiser/174" target="_blank" rel="noreferrer">Donate Today!</a>
              <span className={styles.sep}>✦</span>
              <Link to="/curriculum">Integrate the OY4CCurriculum →</Link>
              <span className={styles.sep}>✦</span>
              <Link to="/blog">Stay up to date! →</Link>
              <span className={styles.sep}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* PARTNERS */}
      {partnersList.length > 0 && (
        <section className={styles.partners}>
          <div className={styles.partnersHead}>
            <span className="section-eyebrow">Our partners</span>
            <h2 className="section-title">Organisations we work with</h2>
          </div>
          <div className={styles.partnersRow}>
            {partnersList.map((p) => {
              const logo = p.logo || LOGO_LOCAL[p.name]
              return (
                <div key={p.name} className={styles.partnerLogo}>
                  {logo && <img src={logo} alt={p.name} />}
                </div>
              )
            })}
            <div className={styles.partnerLogo}>
              <img src="/partners/gep.png" alt="GEP" />
            </div>
          </div>
          <div className={styles.partnersViewAll}>
            <Link to="/partnerships" className={styles.partnersViewAllLink}>View all partners →</Link>
          </div>
        </section>
      )}

      {/* WHAT WE DO */}
      <section className={styles.what}>
        <div className={styles.whatInner}>
          <div>
            <span className="section-eyebrow">What we do</span>
            <h2 className="section-title">Climate change education built by youth, for youth</h2>
            <p className="section-body">
              Almost half of national curricula don't even mention climate change. The generation inheriting the crisis isn't being equipped for it, so we are equipping ourselves. OY4C is a global team of young people designing and delivering free, interdisciplinary, action-driven climate change education, in classrooms across six continents.
            </p>
            <Link to="/about" className="btn-pill btn-pill-primary">Learn about OY4C →</Link>
          </div>
          <div className={styles.pillars}>
            <Link to="/curriculum" className={styles.pillar}>
              <div className={styles.pillarHead}>
                <img src="/curriculum-logo.png" alt="OY4CCurriculum" className={styles.pillarCurriculumLogo} />
                <div className={styles.pillarTitle}>OY4CCurriculum</div>
              </div>
              <div className={styles.pillarDesc}>Ready-to-use, youth-developed, interdisciplinary climate change curriculum. Free for schools and educators worldwide.</div>
              <span className={styles.pillarArrow}>Get the OY4CCurriculum →</span>
            </Link>
            <Link to="/ccic" className={styles.pillar}>
              <div className={styles.pillarHead}>
                <img src="/ccic-logo.jpg" alt="CCiC" style={{ height: '48px', objectFit: 'contain' }} />
                <div className={styles.pillarTitle}>CCiC: Climate Curriculum into Classrooms</div>
              </div>
              <div className={styles.pillarDesc}>Our workshop programme, delivered across six continents, now an open resource anyone can run, with everything you need to bring climate conversations into your classroom.</div>
              <span className={styles.pillarArrow}>Learn more →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* VISITOR PATHS */}
      <section className={styles.paths}>
        <div className={styles.pathsHead}>
          <span className="section-eyebrow" style={{ color: 'var(--white)' }}>Find your way in</span>
          <h2 className="section-title" style={{ color: 'var(--white)' }}>What brings you here?</h2>
        </div>
        <div className={styles.pathsGrid} ref={pathsRef} onScroll={handlePathsScroll}>
          {PATHS.map((p) => (
            <Link key={p.who} to={p.to} className={styles.pathCard}>
              {p.img
                ? <img src={p.img} alt={p.who} className={styles.pathImg} />
                : <div className={`${styles.pathImg} ${styles.pathImgPlaceholder}`} />}
              <div className={styles.pathBody}>
                <span className={styles.pathIcon}>{p.icon}</span>
                <div className={styles.pathWho}>{p.who}</div>
                <div className={styles.pathDesc}>{p.desc}</div>
                <span className={styles.pathCta}>{p.cta}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className={styles.pathsDots}>
          {PATHS.map((p, i) => (
            <button
              key={p.who}
              aria-label={`Go to ${p.who}`}
              className={`${styles.pathsDot} ${i === activePath ? styles.pathsDotActive : ''}`}
              onClick={() => scrollToPath(i)}
            />
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section className={styles.news}>
        <div className={styles.newsHead}>
          <div>
            <span className="section-eyebrow">In the news & on the blog</span>
            <h2 className="section-title">OY4C in the spotlight</h2>
          </div>
          <Link to="/blog" className={styles.btnOutlineDark}>View all →</Link>
        </div>
        <div className={styles.newsGrid}>
          <a href="/oy4c-blog/when-no-trees-are-left" className={styles.newsCardFeatured}>
            <div className={styles.newsImgFeatured} />
            <div className={styles.newsBody}>
              <span className={styles.newsTag}>Blog · Featured</span>
              <div className={styles.newsTitle}>When No Trees Are Left</div>
              <div className={styles.newsExcerpt}>What happens when no trees are left? Deforestation around the world is not just a problem, it's a crisis.</div>
              <span className={styles.newsRead}>Read more →</span>
            </div>
          </a>
          <div className={styles.newsCol}>
            {[
              { icon: <Newspaper />, tag: 'Press', title: 'OY4C featured in Global Youth Climate Summit', date: 'April 2025' },
              { icon: <Mic2 />, tag: 'Event', title: 'OY4C speaks at COP side event on youth-led education', date: 'March 2025' },
            ].map((n) => (
              <a key={n.title} href="#" className={styles.newsCardSmall}>
                <div className={styles.newsCardSmallIcon}>{n.icon}</div>
                <div className={styles.newsBody}>
                  <span className={styles.newsTag}>{n.tag}</span>
                  <div className={styles.newsTitle}>{n.title}</div>
                  <div className={styles.newsDate}>{n.date}</div>
                  <span className={styles.newsRead}>Read more →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
