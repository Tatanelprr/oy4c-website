import { Link } from 'react-router-dom'
import {
  BookOpen, Mic, School, Briefcase, Handshake, Sprout, Users,
  Flag, Heart, Newspaper, Mic2
} from 'lucide-react'
import styles from './Home.module.css'
import { useState, useEffect } from 'react'

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

      {/* IMPACT REPORT — au dessus des metrics */}
      <section className={styles.impactTop}>
        <div className={styles.impactTopInner}>
          <div>
            <span className="section-eyebrow">2025</span>
            <h2 className="section-title">Impact Report</h2>
            <p className="section-body">
              A transformative year of growth, innovation and global reach. Discover what OY4C accomplished in 2025 — by the numbers and beyond.
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

      {/* KEY METRICS */}
      <section className={styles.metrics}>
        <p className={styles.metricsLabel}>Our impact in numbers</p>
        <div className={styles.metricsGrid}>
          {[
            { num: '500+', label: 'Volunteers worldwide' },
            { num: '40+', label: 'Countries represented' },
            { num: '10k+', label: 'Students reached' },
            { num: '200+', label: 'Curricula integrated' },
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
              <Link to="/curriculum">Integrate the OY4C Curriculum →</Link>
              <span className={styles.sep}>✦</span>
              <Link to="/takeaction">Take the OY4C Pledge →</Link>
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
            { name: 'Climate Cardinals', logo: '/partners/climate-cardinals.avif' },
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
      </section>

      {/* WHAT WE DO */}
      <section className={styles.what}>
        <div className={styles.whatInner}>
          <div>
            <span className="section-eyebrow">What we do</span>
            <h2 className="section-title">Bringing climate education to every classroom</h2>
            <p className="section-body">
              We believe young people shouldn't just learn about the climate crisis — they should lead the response. OY4C builds, trains, and empowers a global network of youth educators.
            </p>
            <Link to="/about" className="btn-pill btn-pill-primary">Learn about our approach →</Link>
          </div>
          <div className={styles.pillars}>
            {[
              { icon: <BookOpen />, title: 'OY4C Curriculum', desc: 'Climate modules designed by youth, for classrooms worldwide.', cta: 'Integrate now →', to: '/curriculum' },
              { icon: <Mic />, title: 'CCiC', desc: 'Climate conversations in classrooms — our flagship programme.', cta: 'Learn more →', to: '/ccic' },
            ].map((p) => (
              <Link key={p.title} to={p.to} className={styles.pillar}>
                <span className={styles.pillarIcon}>{p.icon}</span>
                <div className={styles.pillarTitle}>{p.title}</div>
                <div className={styles.pillarDesc}>{p.desc}</div>
                <span className={styles.pillarArrow}>{p.cta}</span>
              </Link>
            ))}
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
            { icon: <Sprout />, who: "I'm a Young Person", desc: 'Join the movement, take the pledge, and become a climate educator.', cta: 'Take action →', to: '/takeaction' },
            { icon: <School />, who: "I'm an Educator", desc: "Integrate OY4C's climate curriculum into your school or programme.", cta: 'Explore curriculum →', to: '/curriculum' },
            { icon: <Handshake />, who: "I'm a Partner", desc: 'Explore how your organisation can collaborate with OY4C globally.', cta: 'Get in touch →', to: '/partnerships' },
            { icon: <Briefcase />, who: "I'm a Funder", desc: 'Support our mission and see the measurable impact of your investment.', cta: 'See our impact →', to: '/impact' },
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
              <div className={styles.newsExcerpt}>What happens when no trees are left? Deforestation around the world is not just a problem — it's a crisis.</div>
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

      {/* TAKE ACTION */}
	  <section className={styles.takeAction}>
		<span className="section-eyebrow" style={{ color: 'var(--white)' }}>Get involved</span>
		<h2>Ready to make a difference?</h2>
		<p>Whether you're a student, teacher, funder or ally — there's a place for you in the OY4C movement.</p>
		<div className={styles.actionCards}>
			{[
			{ icon: <BookOpen />, title: 'Integrate the Curriculum', desc: 'Bring OY4C climate education to your school or classroom.', to: '/curriculum' },
			{ icon: <Users />, title: 'Join the Team', desc: 'Become part of our global community of youth climate educators.', to: '/team' },
			{ icon: <Flag />, title: 'Take the OY4C Pledge', desc: 'Commit to climate action and join thousands of young advocates globally.', to: '/takeaction' },
			{ icon: <Heart />, title: 'Donate Today', desc: 'Your contribution funds youth climate educators in schools worldwide.', href: 'https://validaid.org/fundraiser/174' },
			].map((a) =>
			a.href ? (
				<a key={a.title} href={a.href} target="_blank" rel="noreferrer" className={styles.actionCard}>
				<span className={styles.actionIcon}>{a.icon}</span>
				<div className={styles.actionTitle}>{a.title}</div>
				<div className={styles.actionDesc}>{a.desc}</div>
				</a>
			) : (
				<Link key={a.title} to={a.to} className={styles.actionCard}>
				<span className={styles.actionIcon}>{a.icon}</span>
				<div className={styles.actionTitle}>{a.title}</div>
				<div className={styles.actionDesc}>{a.desc}</div>
				</Link>
			)
			)}
		</div>
	  </section>
    </>
  )
}