import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  School, Briefcase, Handshake, Sprout,
  Newspaper, GraduationCap, ChevronLeft, ChevronRight
} from 'lucide-react'
import { fetchBlogPosts, formatPostDate } from '../lib/notion'
import styles from './Home.module.css'
import VolunteerMap from '../components/VolunteerMap'
import usePageMeta from '../lib/usePageMeta'
import { PAGE_META } from '../data/pageMeta'

// Local logo fallbacks until CDN URLs are set in Notion
const LOGO_LOCAL = {
  'National Geographic':             '/seen-in/national-geographic.webp',
  'DoSomething.org':                 '/seen-in/dosomething.png',
  'TedX':                            '/seen-in/tedx.png',
  'Euronews':                        '/seen-in/euronews.svg',
  'Environmental Media Association': '/seen-in/ema.webp',
  'Global Heroes':                   '/seen-in/global-heroes.png',
  'Sierra Club':                     '/seen-in/sierra-club.png',
  'QS Impact':                       '/seen-in/qs.svg',
  'UCL':                             '/seen-in/ucl.webp',
  'Turner Contemporary':             '/seen-in/turner-contemporary.png',
  'Digital Camp':                    '/seen-in/digital-camp.png',
  'Climate Fresk':                   '/seen-in/climate-fresk.png',
  'Feel Good Action':                '/partners/feel-good-action.webp',
  'Climate Cardinals':               '/partners/climate-cardinals.webp',
  'Force of Nature':                 '/partners/force-of-nature.webp',
  'Climate Majority Project':        '/partners/climate-majority-project.webp',
  'Climate Quilt':                   '/partners/climate-quilt.png',
  'Energy for Refugees Amsterdam':   '/partners/energy-for-refugees.jpg',
}

const INVERT_LOGOS = new Set(['Turner Contemporary'])

// Partners not tagged "Partner" in Notion (Climate Fresk sits under "As Seen In" there)
const EXTRA_PARTNERS = [
  { name: 'GEP', logo: '/partners/gep.webp' },
  { name: 'Climate Fresk', logo: '/seen-in/climate-fresk.png' },
]

const SLIDES = [
  { src: '/hero/hero-1.webp' },
  // Zoomed from the left so the board title clears the white card
  { src: '/hero/hero-2.webp', zoom: { scale: 1.4, origin: 'left 30%' } },
  { src: '/hero/hero-3.webp', credit: 'Green School Bali', position: 'center bottom' },
  { src: '/hero/hero-4.webp', credit: 'Green School Bali' },
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
  { icon: <Sprout />, who: "I'm a Young Person", desc: "You don't need permission to teach your generation. Bring OY4C to your community!", cta: 'Start here →', to: '/takeaction', img: '/hero/hero-1.webp', imgW: 1600, imgH: 900 },
  { icon: <School />, who: "I'm an Educator or School", desc: 'A free, ready-to-teach climate change curriculum built by the generation you\'re teaching', cta: 'Get the curriculum →', to: '/curriculum', img: '/paths/path-educator.webp', imgW: 600, imgH: 400 },
  { icon: <Handshake />, who: "I'm a Partner", desc: 'We work with organisations to take climate change education further than either of us could alone.', cta: 'Partner with us →', to: '/partnerships', img: '/paths/path-partner.webp', imgW: 890, imgH: 1266 },
  { icon: <Briefcase />, who: "I'm a Funder", desc: '133 volunteers. 43 countries. Six continents. See what youth-led delivery achieves, and what\'s next.', cta: 'See our impact →', to: '/impact', img: '/paths/path-funder.webp', imgW: 600, imgH: 400 },
]

// Position of slide i when c is shown: 0 = on screen, 100 = waiting right, -100 = waiting left
function slideSide(i, c) {
  const o = (i - c + SLIDES.length) % SLIDES.length
  return o === 0 ? 0 : o <= SLIDES.length / 2 ? 100 : -100
}

function HeroSlideshow({ current, setCurrent, paused }) {
  const n = SLIDES.length
  // Remember the outgoing slide so only it and the incoming one animate;
  // it exits opposite to the side the incoming slide is waiting on
  const [shown, setShown] = useState({ cur: current, prev: current, exit: 0 })
  const xOf = (i, s) => i === s.cur ? 0 : i === s.prev ? s.exit : slideSide(i, s.cur)
  if (shown.cur !== current) setShown({ cur: current, prev: shown.cur, exit: -xOf(current, shown) })

  // Paused while hovered; leaving restarts a full 10s countdown
  useEffect(() => {
    if (paused) return
    const timer = setTimeout(() => setCurrent((current + 1) % n), 10000)
    return () => clearTimeout(timer)
  }, [current, n, setCurrent, paused])

  return (
    <div className={styles.slideshowBg}>
      {SLIDES.map(({ src, position, zoom }, i) => {
        const moving = i === shown.cur || i === shown.prev
        const x = xOf(i, shown)
        return (
          <div
            key={src}
            className={styles.slide}
            style={{ transform: `translateX(${x}%)`, transition: moving ? undefined : 'none' }}
          >
            <div
              className={styles.slideImg}
              style={{
                backgroundImage: `url('${src}')`,
                backgroundPosition: position,
                transform: zoom ? `scale(${zoom.scale})` : undefined,
                transformOrigin: zoom?.origin,
              }}
            />
          </div>
        )
      })}
      <div className={styles.slideshowOverlay} />
      {SLIDES[current].credit && (
        <span className={styles.slideCredit}>Photo: {SLIDES[current].credit}</span>
      )}
      <button type="button" className={`${styles.slideArrow} ${styles.slideArrowLeft}`} aria-label="Previous slide" onClick={() => setCurrent((current - 1 + n) % n)}>
        <ChevronLeft size={28} />
      </button>
      <button type="button" className={`${styles.slideArrow} ${styles.slideArrowRight}`} aria-label="Next slide" onClick={() => setCurrent((current + 1) % n)}>
        <ChevronRight size={28} />
      </button>
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
  usePageMeta(PAGE_META['/'])
  const [seenIn, setSeenIn]         = useState([])
  const [partnersList, setPartners] = useState([])
  const [latestPosts, setLatestPosts] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [heroHovered, setHeroHovered]   = useState(false)
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

  useEffect(() => {
    // API returns published posts newest first
    fetchBlogPosts()
      .then((posts) => setLatestPosts(posts.slice(0, 3)))
      .catch(() => {}) // fail silently — news grid stays empty
  }, [])

  const [featuredPost, ...otherPosts] = latestPosts

  return (
    <>
      {/* HERO */}
<section className={styles.hero} onMouseEnter={() => setHeroHovered(true)} onMouseLeave={() => setHeroHovered(false)}>
  <HeroSlideshow current={currentSlide} setCurrent={setCurrentSlide} paused={heroHovered} />
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
                // the second copy only makes the marquee loop: hidden from screen readers
                <span key={i} className={styles.seenInSet} aria-hidden={i === 1 || undefined}>
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
                        loading="lazy"
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
            <a href="/impact-report-2025.pdf" target="_blank" rel="noreferrer" className={styles.btnAccent}>
              Download the report →
            </a>
          </div>
          <div className={styles.impactTopVisual}>
            <VolunteerMap />
            <p className={styles.mapCaption}>Countries where OY4C volunteers are active</p>
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
            {[...partnersList, ...EXTRA_PARTNERS].map((p) => {
              const logo = p.logo || LOGO_LOCAL[p.name]
              return (
                <div key={p.name} className={styles.partnerLogo}>
                  {logo ? <img src={logo} alt={p.name} loading="lazy" /> : <span className={styles.partnerName}>{p.name}</span>}
                </div>
              )
            })}
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
                <img src="/curriculum-logo.png" alt="" className={styles.pillarCurriculumLogo} width="532" height="373" loading="lazy" />
                <div className={styles.pillarTitle}>OY4CCurriculum</div>
              </div>
              <div className={styles.pillarDesc}>Ready-to-use, youth-developed, interdisciplinary climate change curriculum. Free for schools and educators worldwide.</div>
              <span className={styles.pillarArrow}>Get the OY4CCurriculum →</span>
            </Link>
            <Link to="/ccic" className={styles.pillar}>
              <div className={styles.pillarHead}>
                <img src="/ccic-logo.webp" alt="" style={{ height: '48px', width: 'auto', objectFit: 'contain' }} width="520" height="347" loading="lazy" />
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
          <span className="section-eyebrow" style={{ color: 'var(--black)' }}>Find your way in</span>
          <h2 className="section-title" style={{ color: 'var(--black)' }}>What brings you here?</h2>
        </div>
        <div className={styles.pathsGrid} ref={pathsRef} onScroll={handlePathsScroll}>
          {PATHS.map((p) => (
            <Link key={p.who} to={p.to} className={styles.pathCard}>
              {p.img
                ? <img src={p.img} alt="" className={styles.pathImg} width={p.imgW} height={p.imgH} loading="lazy" />
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
        {featuredPost && (
          <div className={`${styles.newsGrid} ${otherPosts.length === 0 ? styles.newsGridSolo : ''}`}>
            <Link to={`/blog/${featuredPost.id}`} className={styles.newsCardFeatured}>
              <div
                className={styles.newsImgFeatured}
                // Fallback photo layered underneath, so a failed image never leaves an empty block
                style={featuredPost.image ? { backgroundImage: `url('${featuredPost.image}'), url('/news/news-fallback-congo.webp')` } : undefined}
              />
              <div className={styles.newsBody}>
                <span className={styles.newsTag}>Blog · Latest</span>
                <div className={styles.newsTitle}>{featuredPost.title}</div>
                {featuredPost.excerpt?.trim() && <div className={styles.newsExcerpt}>{featuredPost.excerpt}</div>}
                <span className={styles.newsRead}>Read more →</span>
              </div>
            </Link>
            {otherPosts.length > 0 && <div className={styles.newsCol}>
              {otherPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`} className={styles.newsCardSmall}>
                  <div className={styles.newsCardSmallIcon}><Newspaper aria-hidden="true" /></div>
                  <div className={styles.newsBody}>
                    <span className={styles.newsTag}>{post.tags?.[0] ?? 'Blog'}</span>
                    <div className={styles.newsTitle}>{post.title}</div>
                    {formatPostDate(post.date) && <div className={styles.newsDate}>{formatPostDate(post.date)}</div>}
                    <span className={styles.newsRead}>Read more →</span>
                  </div>
                </Link>
              ))}
            </div>}
          </div>
        )}
      </section>

    </>
  )
}
