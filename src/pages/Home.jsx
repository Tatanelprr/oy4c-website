import { Link } from 'react-router-dom'
import {
  BookOpen, Mic, School, Briefcase, Handshake, Sprout,
  Newspaper, Mic2
} from 'lucide-react'
import styles from './Home.module.css'
import { useState, useEffect } from 'react'

const SEEN_IN = [
  { name: 'National Geographic', src: '/seen-in/national-geographic.svg' },
  { name: 'DoSomething.org',     src: '/seen-in/dosomething.png' },
  { name: 'TEDx',                src: '/seen-in/tedx.png' },
  { name: 'Euronews',            src: '/seen-in/euronews.svg' },
  { name: 'Environmental Media Association', src: '/seen-in/ema.png' },
  { name: 'Global Heroes',       src: '/seen-in/global-heroes.png' },
  { name: 'Sierra Club',         src: '/seen-in/sierra-club.png' },
  { name: 'QS Impact',           src: '/seen-in/qs.svg' },
  { name: 'UCL',                 src: '/seen-in/ucl.svg' },
  { name: 'Turner Contemporary', src: '/seen-in/turner-contemporary.png' },
  { name: 'Digital Camp',        src: '/seen-in/digital-camp.png' },
  { name: 'Climate Fresk',       src: '/seen-in/climate-fresk.png' },
]

const SLIDES = [
  'https://images.squarespace-cdn.com/content/v1/61bb9351758f6f75c02a5f7f/3ff677bf-f0d6-4e32-9d7f-95d9f34c6282/IMG_1049.JPG',
  'https://images.squarespace-cdn.com/content/v1/61bb9351758f6f75c02a5f7f/26ec6b1b-f5cb-4282-b5ce-68bbd7825f4f/CongoBrazza-credit-Bobulix-Flickr.jpg',
]

function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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
  return (
    <>
      {/* HERO */}
<section className={styles.hero}>
  <HeroSlideshow />
  <div className={styles.heroContent}>
    <span className={styles.heroEyebrow}>Youth-led climate education</span>
    <h1>
      Education for Youth.<br />
      <em>By Youth.</em>
      Together for the Climate.
    </h1>
    <p className={styles.heroSub}>
      To create widespread awareness and action towards a sustainable future, OY4C empowers the next generation with high-quality, accessible, youth-led climate change education.
    </p>
    <div className={styles.heroBtns}>
      <Link to="/about" className="btn-pill btn-pill-primary">Learn about OY4C</Link>
      <Link to="/takeaction" className="btn-pill btn-pill-outline">Take Action</Link>
    </div>
  </div>
</section>

      {/* AS SEEN IN */}
      <section className={styles.seenIn}>
        <p className={styles.seenInLabel}>As Seen In</p>
        <div className={styles.seenInTrack}>
          <div className={styles.seenInInner}>
            {[0, 1].map((i) => (
              <span key={i} className={styles.seenInSet}>
                {SEEN_IN.map((logo) => (
                  <img
                    key={logo.name}
                    src={logo.src}
                    alt={logo.name}
                    className={styles.seenInLogo}
                    draggable={false}
                  />
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

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
            <div className={styles.impactYear}>2025</div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials}>
        <div className={styles.testimonialsInner}>
          <h2 className={`section-title ${styles.testimonialsTitle}`}>What students say</h2>
          <div className={styles.testimonialGrid}>
            <blockquote className={styles.testimonialCard}>
              <p>"I felt really educated because I had no idea that things like this existed"</p>
              <cite>Student, 13, Nadi, Fiji</cite>
            </blockquote>
            <blockquote className={styles.testimonialCard}>
              <p>"Liberated and inspired. Showed me some insight to what I can do better to help the climate crisis."</p>
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
      <section className={styles.partners}>
        <div className={styles.partnersHead}>
          <span className="section-eyebrow">Our partners</span>
          <h2 className="section-title">Organisations we work with</h2>
        </div>
        <div className={styles.partnersRow}>
          {[
            { name: 'Feel Good Action', logo: '/partners/feel-good-action.webp' },
            { name: 'Climate Cardinals', logo: '/partners/climate-cardinals.png' },
            { name: 'Force of Nature', logo: '/partners/force-of-nature.webp' },
            { name: 'Climate Majority Project', logo: '/partners/climate-majority-project.webp' },
            { name: 'Climate Quilt', logo: '/partners/climate-quilt.png' },
            { name: 'Energy for Refugees', logo: '/partners/energy-for-refugees.jpg' },
          ].map((p) => (
            <div key={p.name} className={styles.partnerLogo}>
              <img src={p.logo} alt={p.name} />
            </div>
          ))}
        </div>
        <div className={styles.partnersViewAll}>
          <Link to="/partnerships" className={styles.partnersViewAllLink}>View all partners →</Link>
        </div>
      </section>

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
              <span className={styles.pillarIcon}><BookOpen /></span>
              <div className={styles.pillarTitle}>OY4CCurriculum</div>
              <div className={styles.pillarDesc}>Ready-to-use, youth-developed, interdisciplinary climate change curriculum. Free for schools and educators worldwide.</div>
              <span className={styles.pillarArrow}>Get the OY4CCurriculum →</span>
            </Link>
            <Link to="/ccic" className={styles.pillar}>
              <span className={styles.pillarIcon}><Mic /></span>
              <div className={styles.pillarTitle}>CCiC: Climate Curriculum into Classrooms</div>
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
        <div className={styles.pathsGrid}>
          {[
            { icon: <Sprout />, who: "I'm a Young Person", desc: "You don't need permission to teach your generation. Bring OY4C to your community!", cta: 'Start here →', to: '/takeaction' },
            { icon: <School />, who: "I'm an Educator or School", desc: 'A free, ready-to-teach climate change curriculum built by the generation you\'re teaching', cta: 'Get the curriculum →', to: '/curriculum' },
            { icon: <Handshake />, who: "I'm a Partner", desc: 'We work with organisations to take climate change education further than either of us could alone.', cta: 'Partner with us →', to: '/partner' },
            { icon: <Briefcase />, who: "I'm a Funder", desc: '133 volunteers. 43 countries. Six continents. See what youth-led delivery achieves, and what\'s next.', cta: 'See our impact →', to: '/impact' },
          ].map((p) => (
            <Link key={p.who} to={p.to} className={styles.pathCard}>
              <span className={styles.pathIcon}>{p.icon}</span>
              <div className={styles.pathWho}>{p.who}</div>
              <div className={styles.pathDesc}>{p.desc}</div>
              <span className={styles.pathCta}>{p.cta}</span>
            </Link>
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